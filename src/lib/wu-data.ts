import { WuEntry } from './types'
import wuData from '@/data/wu.json'

export function getAllWu(): WuEntry[] {
  return (wuData as WuEntry[]).sort((a, b) => b.timestamp - a.timestamp)
}

export function getLatestWu(): WuEntry | null {
  const all = getAllWu()
  return all.length > 0 ? all[0] : null
}

export function getWuByDate(date: string): WuEntry | null {
  const all = getAllWu()
  return all.find(w => w.date === date) || null
}

export function getWuById(id: string): WuEntry | null {
  const all = getAllWu()
  return all.find(w => w.id === id) || null
}

export function getRecentWu(count: number = 10): WuEntry[] {
  return getAllWu().slice(0, count)
}
