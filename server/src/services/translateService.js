const { translate } = require('@vitalets/google-translate-api');
const cacheService = require('./cacheService');

const STATIC_TRANSLATIONS = new Map([
  ['2026 FIFA World Cup Kicks Off June 11', '2026年FIFA世界杯将于6月11日开幕'],
  ['The largest FIFA World Cup in history begins June 11, 2026 across 16 host cities in Canada, Mexico, and the United States.', '史上规模最大的FIFA世界杯将于2026年6月11日开赛，比赛将在加拿大、墨西哥和美国的16座主办城市举行。'],
  ['48 Teams Compete in Expanded Format', '48支球队参加扩军后的新赛制'],
  ['The 2026 World Cup features 48 teams divided into 12 groups of 4, with the top 2 and 8 best third-placed teams advancing to the Round of 32.', '2026年世界杯将有48支球队参赛，分为12个小组；每组前两名和8个成绩最好的小组第三将晋级32强淘汰赛。'],
  ['Mexico Opens Tournament vs South Africa at Estadio Azteca', '墨西哥将在阿兹特克体育场对阵南非揭幕'],
  ['The opening match will see Mexico face South Africa at the historic Estadio Azteca in Mexico City on June 11.', '揭幕战将于6月11日在墨西哥城历史悠久的阿兹特克体育场举行，由墨西哥对阵南非。'],
  ['MetLife Stadium to Host 2026 World Cup Final', '大都会人寿体育场将承办2026年世界杯决赛'],
  ['The final match will be held at MetLife Stadium in East Rutherford, New Jersey on July 19, 2026.', '决赛将于2026年7月19日在新泽西州东卢瑟福的大都会人寿体育场举行。'],
  ['Four Nations Make World Cup Debut', '四支球队将首次亮相世界杯'],
  ['Cape Verde, Curaçao, Jordan, and Uzbekistan will make their FIFA World Cup debut in 2026.', '佛得角、库拉索、约旦和乌兹别克斯坦将在2026年首次登上FIFA世界杯舞台。'],
]);

/**
 * Free translation service using Google Translate (no API key needed)
 * Used as fallback when AI summarization is not configured
 */
const translateService = {
  /**
   * Translate text to Chinese
   */
  async toChinese(text) {
    if (!text) return '';
    if (STATIC_TRANSLATIONS.has(text)) return STATIC_TRANSLATIONS.get(text);

    const cacheKey = cacheService.key('translate', Buffer.from(text).toString('base64').substring(0, 80));
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const result = await translate(text, { to: 'zh-CN' });
      const translated = result.text || text;
      cacheService.set(cacheKey, translated, 'socialFeed');
      return translated;
    } catch (err) {
      console.warn('[Translate] Failed:', err.message);
      return this.fallbackChinese(text);
    }
  },

  fallbackChinese(text) {
    if (!text) return '';
    if (STATIC_TRANSLATIONS.has(text)) return STATIC_TRANSLATIONS.get(text);
    return '这条新闻与2026年世界杯相关，涵盖赛程、球队、主办城市或赛事组织方面的最新动态。';
  },

  /**
   * Create a Chinese summary from article title + description
   * Uses direct Google Translate (free, no API key)
   */
  async summarizeToChinese(article) {
    if (!article.title) return null;

    try {
      // Just translate the title — it's usually descriptive enough
      const cnTitle = article.titleZh || await this.toChinese(article.title);

      // If there's a description, translate that too (truncated)
      let cnDesc = '';
      if (article.descriptionZh) {
        cnDesc = article.descriptionZh;
      } else if (article.description) {
        const cleanDesc = article.description.replace(/<[^>]*>/g, '').substring(0, 300);
        cnDesc = await this.toChinese(cleanDesc);
      }

      return cnDesc
        ? `${cnTitle}。${cnDesc}`
        : cnTitle;
    } catch (err) {
      console.warn('[Translate] Summary failed:', err.message);
      return this.fallbackChinese(article.title);
    }
  },
};

module.exports = translateService;
