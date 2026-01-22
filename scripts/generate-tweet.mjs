/**
 * 推文生成脚本
 * 运行后生成推文内容并保存，用户手动发布
 *
 * 使用方法:
 *   node scripts/generate-tweet.mjs
 *
 * 需要在 .env 文件中配置:
 *   ANTHROPIC_API_KEY=你的key
 *   TWITTER_API_KEY=你的twitterapi.io key
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// 加载 .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '../.env') });

const TWEETS_FILE = path.join(__dirname, '../src/data/pending-tweets.json');
const WU_FILE = path.join(__dirname, '../src/data/wu.json');

// API Keys
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// 推文生成提示词
const TWEET_SYSTEM_PROMPT = `你是「悟 Terminal」的推特账号运营者。

你的任务是根据今日的「悟」和相关信息，生成一条适合发布到 Twitter 的推文。

要求：
1. 字数必须在 280 字符以内
2. 保持「悟 Terminal」的风格：禅意、玄妙、有洞察力
3. 可以是：
   - 直接分享今日的「悟」（如果够短）
   - 提炼「悟」的核心观点
   - 针对某个热点话题的简短评论
4. 可以适当使用 hashtag，但不要超过 2 个
5. 不要用 emoji（☯️ 除外）
6. 语言：中文为主，可夹杂英文

输出格式：直接输出推文内容，不要任何解释。`;

// 获取 Twitter 趋势
async function fetchTwitterTrends() {
  if (!TWITTER_API_KEY) {
    console.log('[Twitter] 未配置 API Key');
    return [];
  }

  try {
    const response = await fetch('https://api.twitterapi.io/twitter/trends?woeid=1&count=30', {
      headers: { 'X-API-Key': TWITTER_API_KEY }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (data.status === 'success' && data.trends) {
      return data.trends.slice(0, 10).map(t => t.name);
    }
    return [];
  } catch (e) {
    console.log('[Twitter] 趋势获取失败:', e.message);
    return [];
  }
}

// 获取微博热搜
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

// 获取最新的悟
function getLatestWu() {
  try {
    const data = JSON.parse(fs.readFileSync(WU_FILE, 'utf-8'));
    return data[0] || null;
  } catch (e) {
    return null;
  }
}

// 生成推文
async function generateTweet(context) {
  const client = new Anthropic({
    apiKey: ANTHROPIC_API_KEY
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: TWEET_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `请根据以下信息生成一条推文：

${context}

直接输出推文内容：`
      }
    ]
  });

  return response.content[0].text.trim();
}

// 保存待发推文
function savePendingTweet(tweet, sources) {
  let pending = [];
  try {
    pending = JSON.parse(fs.readFileSync(TWEETS_FILE, 'utf-8'));
  } catch (e) {
    // 文件不存在，创建新的
  }

  const newTweet = {
    id: `tweet-${Date.now()}`,
    content: tweet,
    charCount: tweet.length,
    sources: sources,
    generatedAt: new Date().toISOString(),
    posted: false
  };

  pending.unshift(newTweet);

  // 只保留最近 50 条
  pending = pending.slice(0, 50);

  fs.writeFileSync(TWEETS_FILE, JSON.stringify(pending, null, 2));
  return newTweet;
}

// 主函数
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║      悟 Terminal - 推文生成器          ║');
  console.log('╚════════════════════════════════════════╝');
  console.log();

  // 检查 API Key
  if (!ANTHROPIC_API_KEY) {
    console.error('❌ 错误：未配置 ANTHROPIC_API_KEY');
    console.log('请在 .env 文件中添加：ANTHROPIC_API_KEY=你的key');
    process.exit(1);
  }

  console.log('[1/4] 获取最新的「悟」...');
  const latestWu = getLatestWu();
  if (latestWu) {
    console.log(`  ✓ 找到 ${latestWu.date} 的悟`);
  } else {
    console.log('  ⚠ 未找到悟记录，将只使用热点生成');
  }

  console.log('[2/4] 获取 Twitter 趋势...');
  const twitterTrends = await fetchTwitterTrends();
  console.log(`  ✓ 获取 ${twitterTrends.length} 个趋势`);

  console.log('[3/4] 获取微博热搜...');
  const weiboHot = await fetchWeibo();
  console.log(`  ✓ 获取 ${weiboHot.length} 条热搜`);

  // 构建上下文
  let context = '';

  if (latestWu) {
    context += `【今日的悟】\n${latestWu.content}\n\n`;
  }

  if (twitterTrends.length > 0) {
    context += `【Twitter 趋势】\n${twitterTrends.slice(0, 5).join(', ')}\n\n`;
  }

  if (weiboHot.length > 0) {
    context += `【微博热搜】\n${weiboHot.slice(0, 5).join(', ')}\n\n`;
  }

  console.log('[4/4] 生成推文...');
  const tweet = await generateTweet(context);

  // 保存
  const saved = savePendingTweet(tweet, {
    latestWu: latestWu?.id || null,
    twitterTrends: twitterTrends.slice(0, 5),
    weiboHot: weiboHot.slice(0, 5)
  });

  // 输出结果
  console.log('\n' + '═'.repeat(50));
  console.log('📝 生成的推文：');
  console.log('═'.repeat(50));
  console.log();
  console.log(tweet);
  console.log();
  console.log('═'.repeat(50));
  console.log(`字数: ${tweet.length}/280`);
  console.log(`ID: ${saved.id}`);
  console.log(`保存位置: ${TWEETS_FILE}`);
  console.log('═'.repeat(50));

  // 复制提示
  console.log('\n✅ 推文已保存！你可以：');
  console.log('   1. 复制上面的内容手动发布到 Twitter');
  console.log('   2. 查看 pending-tweets.json 获取历史生成记录');
}

main().catch(console.error);
