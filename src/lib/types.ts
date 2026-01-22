export interface WuEntry {
  id: string
  date: string
  content: string
  sources: {
    weibo?: string[]
    news?: string[]
    twitter?: string[]
  }
  timestamp: number
}

export interface SourceInfo {
  type: 'weibo' | 'news' | 'twitter'
  items: string[]
}
