const axios = require('axios');
const cacheService = require('./cacheService');

/**
 * AI News Summary Service
 * Uses user-provided AI API (OpenAI / Claude / custom endpoint)
 * to summarize RSS news articles in Chinese or English.
 *
 * Configuration in .env:
 *   AI_API_URL=https://api.openai.com/v1/chat/completions   (or Claude, etc.)
 *   AI_API_KEY=sk-your-key-here
 *   AI_MODEL=gpt-4o                                          (or claude-sonnet-4-6, etc.)
 *   AI_SUMMARY_LANG=zh                                       (zh or en)
 */
const aiSummaryService = {
  getConfig() {
    return {
      apiUrl: process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions',
      apiKey: process.env.AI_API_KEY || '',
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      lang: process.env.AI_SUMMARY_LANG || 'zh',
    };
  },

  isEnabled() {
    return !!process.env.AI_API_KEY;
  },

  /**
   * Summarize a single article
   */
  async summarizeArticle(article) {
    if (!this.isEnabled()) return null;

    const cacheKey = cacheService.key('aiSummary', Buffer.from(article.link || article.title).toString('base64').substring(0, 50));
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const config = this.getConfig();
    const langPrompt = config.lang === 'zh'
      ? '请用中文写一段简洁的摘要（80-150字），总结这篇世界杯相关新闻的核心内容。只返回摘要文本，不要有其他内容。'
      : 'Write a concise summary (50-100 words) of this World Cup news article. Return only the summary text, nothing else.';

    try {
      const { data } = await axios.post(
        config.apiUrl,
        {
          model: config.model,
          messages: [
            {
              role: 'system',
              content: `You are a sports news summarizer for the 2026 FIFA World Cup. ${langPrompt}`,
            },
            {
              role: 'user',
              content: `Title: ${article.title}\n\nContent: ${article.description || article.title}`,
            },
          ],
          max_tokens: 300,
          temperature: 0.3,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      const summary = data.choices?.[0]?.message?.content?.trim() || '';

      if (summary) {
        cacheService.set(cacheKey, summary, 'socialFeed');
      }

      return summary;
    } catch (err) {
      console.warn(`[AI Summary] Failed: ${err.message}`);
      return null;
    }
  },

  /**
   * Summarize multiple articles in batch
   * Returns articles with AI summaries added
   */
  async summarizeArticles(articles, maxArticles = 10) {
    if (!this.isEnabled()) {
      return articles.slice(0, maxArticles).map((a) => ({
        ...a,
        aiSummary: null,
        note: 'AI summary not configured. Set AI_API_KEY in .env to enable.',
      }));
    }

    const toSummarize = articles.slice(0, maxArticles);
    const results = await Promise.allSettled(
      toSummarize.map(async (article) => {
        const summary = await this.summarizeArticle(article);
        return { ...article, aiSummary: summary };
      })
    );

    return results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value);
  },
};

module.exports = aiSummaryService;
