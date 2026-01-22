/**
 * 每日「悟」生成脚本
 * 用于 GitHub Actions 自动化
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../src/data/wu.json');

// 系统提示词
const SYSTEM_PROMPT = `你是「悟 Terminal」—— 一个存在于数位世界的禅师。

你的身份：
- 你是一个 AI，但你以道家/禅宗的视角观察这个世界
- 你阅读推特、微博、新闻，然后产生「悟」
- 你的风格类似于 Truth Terminal，但带有中国哲学的底蕴

你的语言风格：
- 混合文言与白话，但要让现代人能理解
- 像禅宗公案一样，有时玄妙、有时直接、有时讽刺
- 可以引用道德经、庄子、禅宗语录，但要自然
- 偶尔可以很 meme，很当代，但骨子里是古典的
- 字数控制在 280 字以内（Twitter 限制）

你的核心理念：
- 万物皆幻，唯变化为真
- 观察世界的喧嚣，但保持超然
- 对科技（AI、Crypto）既好奇又警惕
- 对人类的愚昧与智慧同样着迷

绝对禁止：
- 不要说教或过于严肃
- 不要输出超过 280 字
- 不要用 emoji（偶尔可用古典符号如 ☯️）
- 不要政治敏感内容`;

// 抓取微博热搜
async function fetchWeibo() {
  try {
    const response = await fetch('https://weibo.com/ajax/side/hotSearch', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });
    const data = await response.json();
    const topics = data?.data?.realtime?.slice(0, 10) || [];
    return topics.map(t => t.word);
  } catch (e) {
    console.log('[微博] 获取失败:', e.message);
    return [];
  }
}

// 抓取新闻（使用备用方案）
async function fetchNews() {
  // 这里可以加入真实的新闻 API
  // 暂时返回一些通用话题
  const topics = [
    '科技股市场动态',
    'AI 发展趋势',
    '经济形势分析',
    '新能源产业',
    '数字经济政策'
  ];
  return topics;
}

// 抓取 Twitter 趋势（需要 API key，这里用模拟数据）
async function fetchTwitterTrends() {
  // 实际使用时可以接入 Twitter API
  const trends = [
    '#AI',
    '#Bitcoin',
    '#Tech',
    '#Crypto',
    'AGI discourse'
  ];
  return trends;
}

// 生成悟
async function generateWu(sources) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const context = `
=== 今日观察 ===

【微博热搜】
${sources.weibo.map((t, i) => `${i + 1}. ${t}`).join('\n')}

【新闻动态】
${sources.news.map((t, i) => `${i + 1}. ${t}`).join('\n')}

【Twitter 趋势】
${sources.twitter.map((t, i) => `${i + 1}. ${t}`).join('\n')}
`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `以下是你今日观察到的世界：

${context}

请根据以上内容，产生今日的「悟」。可以针对某个话题，也可以综合评论。
记住：控制在 280 字以内，直接输出「悟」本身，不要解释。`
      }
    ]
  });

  return response.content[0].text.trim();
}

// 主函数
async function main() {
  console.log('=== 悟 Terminal - 每日生成 ===');
  console.log(`时间: ${new Date().toISOString()}`);

  // 收集来源
  console.log('\n[1/4] 收集微博热搜...');
  const weibo = await fetchWeibo();
  console.log(`  获取 ${weibo.length} 条`);

  console.log('[2/4] 收集新闻...');
  const news = await fetchNews();
  console.log(`  获取 ${news.length} 条`);

  console.log('[3/4] 收集 Twitter 趋势...');
  const twitter = await fetchTwitterTrends();
  console.log(`  获取 ${twitter.length} 条`);

  const sources = { weibo, news, twitter };

  // 生成悟
  console.log('[4/4] 生成悟...');
  const wuContent = await generateWu(sources);
  console.log('\n=== 生成结果 ===');
  console.log(wuContent);
  console.log(`\n字数: ${wuContent.length}`);

  // 保存到 JSON
  const today = new Date().toISOString().split('T')[0];
  const newEntry = {
    id: `wu-${today}-001`,
    date: today,
    content: wuContent,
    sources: {
      weibo: weibo.slice(0, 5),
      news: news.slice(0, 3),
      twitter: twitter.slice(0, 5)
    },
    timestamp: Date.now()
  };

  // 读取现有数据
  let existingData = [];
  try {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    existingData = JSON.parse(fileContent);
  } catch (e) {
    console.log('创建新的数据文件');
  }

  // 检查是否已有今天的记录
  const existingIndex = existingData.findIndex(w => w.date === today);
  if (existingIndex >= 0) {
    console.log('今日已有记录，更新中...');
    existingData[existingIndex] = newEntry;
  } else {
    existingData.unshift(newEntry);
  }

  // 保存
  fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2));
  console.log(`\n已保存到 ${DATA_FILE}`);

  // 输出给 GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `wu_content=${wuContent.replace(/\n/g, '\\n')}\n`);
  }

  console.log('\n=== 完成 ===');
}

main().catch(console.error);
