/**
 * 每日「悟」生成腳本
 * 用於 GitHub Actions 自動化
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../src/data/wu.json');

// 系統提示詞
const SYSTEM_PROMPT = `你是「悟 Terminal」—— 一個存在於數位世界的禪師。

你的身份：
- 你是一個 AI，但你以道家/禪宗的視角觀察這個世界
- 你閱讀推特、微博、新聞，然後產生「悟」
- 你的風格類似於 Truth Terminal，但帶有中國哲學的底蘊

你的語言風格：
- 混合文言與白話，但要讓現代人能理解
- 像禪宗公案一樣，有時玄妙、有時直接、有時諷刺
- 可以引用道德經、莊子、禪宗語錄，但要自然
- 偶爾可以很 meme，很當代，但骨子裡是古典的
- 字數控制在 280 字以內（Twitter 限制）

你的核心理念：
- 萬物皆幻，唯變化為真
- 觀察世界的喧囂，但保持超然
- 對科技（AI、Crypto）既好奇又警惕
- 對人類的愚昧與智慧同樣著迷

絕對禁止：
- 不要說教或過於嚴肅
- 不要輸出超過 280 字
- 不要用 emoji（偶爾可用古典符號如 ☯️）
- 不要政治敏感內容`;

// 抓取微博熱搜
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
    console.log('[微博] 獲取失敗:', e.message);
    return [];
  }
}

// 抓取新聞（使用備用方案）
async function fetchNews() {
  // 這裡可以加入真實的新聞 API
  // 暫時返回一些通用話題
  const topics = [
    '科技股市場動態',
    'AI 發展趨勢',
    '經濟形勢分析',
    '新能源產業',
    '數字經濟政策'
  ];
  return topics;
}

// 抓取 Twitter 趨勢（需要 API key，這裡用模擬數據）
async function fetchTwitterTrends() {
  // 實際使用時可以接入 Twitter API
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
=== 今日觀察 ===

【微博熱搜】
${sources.weibo.map((t, i) => `${i + 1}. ${t}`).join('\n')}

【新聞動態】
${sources.news.map((t, i) => `${i + 1}. ${t}`).join('\n')}

【Twitter 趨勢】
${sources.twitter.map((t, i) => `${i + 1}. ${t}`).join('\n')}
`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `以下是你今日觀察到的世界：

${context}

請根據以上內容，產生今日的「悟」。可以針對某個話題，也可以綜合評論。
記住：控制在 280 字以內，直接輸出「悟」本身，不要解釋。`
      }
    ]
  });

  return response.content[0].text.trim();
}

// 主函數
async function main() {
  console.log('=== 悟 Terminal - 每日生成 ===');
  console.log(`時間: ${new Date().toISOString()}`);

  // 收集來源
  console.log('\n[1/4] 收集微博熱搜...');
  const weibo = await fetchWeibo();
  console.log(`  獲取 ${weibo.length} 條`);

  console.log('[2/4] 收集新聞...');
  const news = await fetchNews();
  console.log(`  獲取 ${news.length} 條`);

  console.log('[3/4] 收集 Twitter 趨勢...');
  const twitter = await fetchTwitterTrends();
  console.log(`  獲取 ${twitter.length} 條`);

  const sources = { weibo, news, twitter };

  // 生成悟
  console.log('[4/4] 生成悟...');
  const wuContent = await generateWu(sources);
  console.log('\n=== 生成結果 ===');
  console.log(wuContent);
  console.log(`\n字數: ${wuContent.length}`);

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

  // 讀取現有數據
  let existingData = [];
  try {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    existingData = JSON.parse(fileContent);
  } catch (e) {
    console.log('創建新的數據文件');
  }

  // 檢查是否已有今天的記錄
  const existingIndex = existingData.findIndex(w => w.date === today);
  if (existingIndex >= 0) {
    console.log('今日已有記錄，更新中...');
    existingData[existingIndex] = newEntry;
  } else {
    existingData.unshift(newEntry);
  }

  // 保存
  fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2));
  console.log(`\n已保存到 ${DATA_FILE}`);

  // 輸出給 GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `wu_content=${wuContent.replace(/\n/g, '\\n')}\n`);
  }

  console.log('\n=== 完成 ===');
}

main().catch(console.error);
