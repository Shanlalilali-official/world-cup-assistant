const axios = require('axios');
const cacheService = require('./cacheService');

/**
 * OpenWeatherMap — free tier (1,000 calls/day)
 * Provides weather data for World Cup host cities
 *
 * Get API key at: https://openweathermap.org/api
 */
const weatherService = {
  client: axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5',
    timeout: 8000,
  }),

  apiKey: process.env.OPENWEATHER_API_KEY || '',

  // 16 host city coordinates
  VENUES: [
    { city: 'Mexico City', country: 'Mexico', lat: 19.43, lon: -99.13 },
    { city: 'Guadalajara', country: 'Mexico', lat: 20.66, lon: -103.35 },
    { city: 'Monterrey', country: 'Mexico', lat: 25.69, lon: -100.32 },
    { city: 'Toronto', country: 'Canada', lat: 43.65, lon: -79.38 },
    { city: 'Vancouver', country: 'Canada', lat: 49.28, lon: -123.12 },
    { city: 'East Rutherford', country: 'USA', lat: 40.81, lon: -74.07 },
    { city: 'Los Angeles', country: 'USA', lat: 33.95, lon: -118.34 },
    { city: 'Dallas', country: 'USA', lat: 32.78, lon: -96.80 },
    { city: 'Kansas City', country: 'USA', lat: 39.10, lon: -94.58 },
    { city: 'Atlanta', country: 'USA', lat: 33.75, lon: -84.39 },
    { city: 'Houston', country: 'USA', lat: 29.76, lon: -95.37 },
    { city: 'Seattle', country: 'USA', lat: 47.61, lon: -122.33 },
    { city: 'Santa Clara', country: 'USA', lat: 37.35, lon: -121.96 },
    { city: 'Philadelphia', country: 'USA', lat: 39.95, lon: -75.16 },
    { city: 'Miami', country: 'USA', lat: 25.76, lon: -80.19 },
    { city: 'Foxborough', country: 'USA', lat: 42.07, lon: -71.25 },
  ],

  isEnabled() {
    return !!this.apiKey;
  },

  /**
   * Get weather for a specific venue city
   */
  async getCityWeather(cityName) {
    const cacheKey = cacheService.key('weather', cityName);
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const venue = this.VENUES.find(
      (v) => v.city.toLowerCase() === cityName.toLowerCase()
    );

    if (!venue && !this.isEnabled()) {
      return this.getMockWeather(cityName);
    }

    try {
      const { data } = await this.client.get('/weather', {
        params: {
          lat: venue?.lat || 0,
          lon: venue?.lon || 0,
          appid: this.apiKey,
          units: 'metric',
          lang: 'zh_cn',
        },
      });

      const weather = {
        city: data.name || cityName,
        country: data.sys?.country || '',
        temp: Math.round(data.main?.temp),
        feelsLike: Math.round(data.main?.feels_like),
        humidity: data.main?.humidity,
        description: data.weather?.[0]?.description,
        icon: data.weather?.[0]?.icon,
        wind: {
          speed: data.wind?.speed,
          deg: data.wind?.deg,
        },
        isMatchWeather: true,
      };

      cacheService.set(cacheKey, weather, 'injuries');
      return weather;
    } catch (err) {
      console.warn(`[Weather] Failed for ${cityName}:`, err.message);
      return this.getMockWeather(cityName);
    }
  },

  /**
   * Get weather for all host cities
   */
  async getAllVenueWeather() {
    const cacheKey = cacheService.key('weather', 'all-venues');
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const results = await Promise.allSettled(
      this.VENUES.map((v) => this.getCityWeather(v.city))
    );

    const weather = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value);

    cacheService.set(cacheKey, weather, 'injuries');
    return weather;
  },

  /**
   * Mock weather for June-July host cities (when API key unavailable)
   */
  getMockWeather(cityName) {
    const mockData = {
      'mexico city': { temp: 23, humidity: 55, description: 'partly cloudy', icon: '02d' },
      'guadalajara': { temp: 28, humidity: 45, description: 'clear sky', icon: '01d' },
      'monterrey': { temp: 32, humidity: 50, description: 'sunny', icon: '01d' },
      'toronto': { temp: 24, humidity: 60, description: 'scattered clouds', icon: '03d' },
      'vancouver': { temp: 19, humidity: 70, description: 'light rain', icon: '10d' },
      'east rutherford': { temp: 27, humidity: 55, description: 'partly cloudy', icon: '02d' },
      'los angeles': { temp: 26, humidity: 40, description: 'clear sky', icon: '01d' },
      'dallas': { temp: 34, humidity: 45, description: 'sunny', icon: '01d' },
      'kansas city': { temp: 29, humidity: 55, description: 'scattered clouds', icon: '03d' },
      'atlanta': { temp: 30, humidity: 60, description: 'thunderstorm', icon: '11d' },
      'houston': { temp: 33, humidity: 65, description: 'humid', icon: '02d' },
      'seattle': { temp: 21, humidity: 65, description: 'cloudy', icon: '04d' },
      'santa clara': { temp: 24, humidity: 50, description: 'clear sky', icon: '01d' },
      'philadelphia': { temp: 27, humidity: 55, description: 'partly cloudy', icon: '02d' },
      'miami': { temp: 31, humidity: 70, description: 'scattered showers', icon: '10d' },
      'foxborough': { temp: 25, humidity: 55, description: 'partly cloudy', icon: '02d' },
    };

    const key = cityName?.toLowerCase() || '';
    const weather = mockData[key] || { temp: 25, humidity: 50, description: 'fair', icon: '01d' };

    return {
      city: cityName,
      temp: weather.temp,
      humidity: weather.humidity,
      description: weather.description,
      icon: weather.icon,
      wind: { speed: 3.5, deg: 180 },
      isMatchWeather: true,
      isMock: true,
    };
  },
};

module.exports = weatherService;
