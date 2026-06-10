const axios = require('axios');
const cacheService = require('./cacheService');

/**
 * News aggregation service — fetches World Cup news from multiple RSS/API sources
 *
 * Sources:
 * - ESPN FC World Cup RSS
 * - FIFA.com official news
 * - The Guardian Football RSS
 * - Sky Sports World Cup RSS
 */
const newsService = {
  NEWS_SOURCES: [
    {
      name: 'FIFA Official',
      url: 'https://www.fifa.com/en/news/rss',
      type: 'rss',
    },
    {
      name: 'ESPN FC',
      url: 'https://www.espn.com/espn/rss/soccer/news',
      type: 'rss',
    },
    {
      name: 'The Guardian',
      url: 'https://www.theguardian.com/football/world-cup-2026/rss',
      type: 'rss',
    },
    {
      name: 'Sky Sports',
      url: 'https://www.skysports.com/football/rss',
      type: 'rss',
    },
  ],

  /**
   * Fetch all World Cup news from multiple sources
   */
  async getNews() {
    const cacheKey = cacheService.key('news');
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const results = await Promise.allSettled(
      this.NEWS_SOURCES.map(async (source) => {
        try {
          const articles = await this.fetchRSS(source.url);
          return { source: source.name, articles: articles.slice(0, 10) };
        } catch {
          return { source: source.name, articles: [] };
        }
      })
    );

    const news = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value)
      .filter((r) => r.articles.length > 0);

    // If no live news, provide static tournament context
    if (news.length === 0 || news.every((n) => n.articles.length === 0)) {
      const fallback = this.getStaticNews();
      cacheService.set(cacheKey, fallback, 'injuries');
      return fallback;
    }

    cacheService.set(cacheKey, news, 'socialFeed');
    return news;
  },

  /**
   * Fetch and parse RSS feed
   */
  async fetchRSS(url) {
    const { data } = await axios.get(url, { timeout: 8000 });
    return this.parseRSSItems(data);
  },

  /**
   * Simple RSS XML parser (no external deps)
   */
  parseRSSItems(xml) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];
      items.push({
        title: this.extractTag(item, 'title'),
        link: this.extractTag(item, 'link'),
        description: this.stripHtml(this.extractTag(item, 'description')),
        pubDate: this.extractTag(item, 'pubDate'),
        source: this.extractTag(item, 'source'),
      });
    }

    return items;
  },

  extractTag(xml, tag) {
    const regex = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
  },

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').substring(0, 300);
  },

  /**
   * Static tournament news — used as fallback when RSS is unavailable
   */
  getStaticNews() {
    return [
      {
        source: 'Tournament Info',
        articles: [
          {
            title: '2026 FIFA World Cup Kicks Off June 11',
            titleZh: '2026年FIFA世界杯将于6月11日开幕',
            link: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026',
            description: 'The largest FIFA World Cup in history begins June 11, 2026 across 16 host cities in Canada, Mexico, and the United States.',
            descriptionZh: '史上规模最大的FIFA世界杯将于2026年6月11日开赛，比赛将在加拿大、墨西哥和美国的16座主办城市举行。',
            pubDate: '2026-06-09',
            source: 'FIFA',
          },
          {
            title: '48 Teams Compete in Expanded Format',
            titleZh: '48支球队参加扩军后的新赛制',
            link: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026',
            description: 'The 2026 World Cup features 48 teams divided into 12 groups of 4, with the top 2 and 8 best third-placed teams advancing to the Round of 32.',
            descriptionZh: '2026年世界杯将有48支球队参赛，分为12个小组；每组前两名和8个成绩最好的小组第三将晋级32强淘汰赛。',
            pubDate: '2026-06-09',
            source: 'FIFA',
          },
          {
            title: 'Mexico Opens Tournament vs South Africa at Estadio Azteca',
            titleZh: '墨西哥将在阿兹特克体育场对阵南非揭幕',
            link: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026',
            description: 'The opening match will see Mexico face South Africa at the historic Estadio Azteca in Mexico City on June 11.',
            descriptionZh: '揭幕战将于6月11日在墨西哥城历史悠久的阿兹特克体育场举行，由墨西哥对阵南非。',
            pubDate: '2026-06-09',
            source: 'FIFA',
          },
          {
            title: 'MetLife Stadium to Host 2026 World Cup Final',
            titleZh: '大都会人寿体育场将承办2026年世界杯决赛',
            link: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026',
            description: 'The final match will be held at MetLife Stadium in East Rutherford, New Jersey on July 19, 2026.',
            descriptionZh: '决赛将于2026年7月19日在新泽西州东卢瑟福的大都会人寿体育场举行。',
            pubDate: '2026-06-09',
            source: 'FIFA',
          },
          {
            title: 'Four Nations Make World Cup Debut',
            titleZh: '四支球队将首次亮相世界杯',
            link: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026',
            description: 'Cape Verde, Curaçao, Jordan, and Uzbekistan will make their FIFA World Cup debut in 2026.',
            descriptionZh: '佛得角、库拉索、约旦和乌兹别克斯坦将在2026年首次登上FIFA世界杯舞台。',
            pubDate: '2026-06-09',
            source: 'FIFA',
          },
        ],
      },
    ];
  },
};

module.exports = newsService;
