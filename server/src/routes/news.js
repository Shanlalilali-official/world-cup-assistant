const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');
const aiSummaryService = require('../services/aiSummaryService');
const translateService = require('../services/translateService');

// GET /api/news — World Cup news
// ?summarize=true → enables summarization (AI first, free translate fallback)
router.get('/', async (req, res, next) => {
  try {
    const summarize = req.query.summarize === 'true';
    const lang = req.query.lang || process.env.AI_SUMMARY_LANG || 'zh';
    const news = await newsService.getNews();

    // === Path 1: AI summarization (best quality, requires API key) ===
    if (summarize && aiSummaryService.isEnabled()) {
      const summarizedSources = await Promise.all(
        news.map(async (source) => {
          const articles = await aiSummaryService.summarizeArticles(source.articles, 8);
          return { ...source, articles };
        })
      );
      return res.json({
        sources: summarizedSources,
        lastUpdated: new Date().toISOString(),
        summarized: 'ai',
      });
    }

    // === Path 2: Summarize requested but AI not configured → free Google Translate ===
    if (summarize && lang === 'zh' && !aiSummaryService.isEnabled()) {
      const translatedSources = await Promise.all(
        news.map(async (source) => {
          const articles = await Promise.all(
            source.articles.slice(0, 6).map(async (a) => {
              const cnSummary = await translateService.summarizeToChinese(a);
              const titleZh = a.titleZh || await translateService.toChinese(a.title);
              return {
                ...a,
                description: stripHtml(a.description || ''),
                titleZh,
                aiSummary: cnSummary, // Free direct translation as summary
              };
            })
          );
          return { ...source, articles };
        })
      );
      return res.json({
        sources: translatedSources,
        lastUpdated: new Date().toISOString(),
        summarized: 'translate',
        hint: 'Free direct translation. Set AI_API_KEY in .env for higher quality AI summaries.',
      });
    }

    // === Path 3: No summarization → clean articles only ===
    const cleanSources = news.map((source) => ({
      ...source,
      articles: source.articles.map((a) => ({
        ...a,
        description: a.description ? stripHtml(a.description) : '',
        ...(lang === 'zh' && {
          titleZh: a.titleZh,
          descriptionZh: a.descriptionZh,
        }),
      })),
    }));

    res.json({
      sources: cleanSources,
      lastUpdated: new Date().toISOString(),
      aiAvailable: aiSummaryService.isEnabled(),
      hint: 'Add ?summarize=true for Chinese summaries (free). Set AI_API_KEY for higher quality.',
    });
  } catch (err) {
    next(err);
  }
});

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'").substring(0, 400);
}

module.exports = router;
