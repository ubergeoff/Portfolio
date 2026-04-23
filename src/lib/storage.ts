const CACHE_PROFILES_KEY = 'portfolio-cache-profiles'
const CACHE_CANDLES_KEY = 'portfolio-cache-candles'
const CANDLE_CACHE_TTL_MS = 5 * 60 * 1000   // 5 minutes
const PROFILE_CACHE_TTL_MS = 24 * 60 * 60 * 1000  // 24 hours
const MAX_CACHE_ENTRIES = 50

interface CacheEntry<T> {
  data: T
  fetchedAt: number
}

type CacheMap<T> = Record<string, CacheEntry<T>>

function readCache<T>(key: string): CacheMap<T> {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeCache<T>(key: string, cache: CacheMap<T>) {
  try {
    localStorage.setItem(key, JSON.stringify(cache))
  } catch {
    // Storage quota exceeded — evict oldest half
    const entries = Object.entries(cache).sort((a, b) => a[1].fetchedAt - b[1].fetchedAt)
    const pruned = Object.fromEntries(entries.slice(Math.floor(entries.length / 2)))
    try { localStorage.setItem(key, JSON.stringify(pruned)) } catch { /* ignore */ }
  }
}

export function getCachedProfile(symbol: string) {
  const cache = readCache<unknown>(CACHE_PROFILES_KEY)
  const entry = cache[symbol]
  if (!entry) return null
  if (Date.now() - entry.fetchedAt > PROFILE_CACHE_TTL_MS) return null
  return entry.data
}

export function setCachedProfile(symbol: string, data: unknown) {
  const cache = readCache<unknown>(CACHE_PROFILES_KEY)
  cache[symbol] = { data, fetchedAt: Date.now() }
  // Evict if too many entries
  const keys = Object.keys(cache)
  if (keys.length > MAX_CACHE_ENTRIES) {
    const oldest = keys.sort((a, b) => cache[a].fetchedAt - cache[b].fetchedAt)[0]
    delete cache[oldest]
  }
  writeCache(CACHE_PROFILES_KEY, cache)
}

export function getCachedCandles(key: string) {
  const cache = readCache<unknown>(CACHE_CANDLES_KEY)
  const entry = cache[key]
  if (!entry) return null
  if (Date.now() - entry.fetchedAt > CANDLE_CACHE_TTL_MS) return null
  return entry.data
}

export function setCachedCandles(key: string, data: unknown) {
  const cache = readCache<unknown>(CACHE_CANDLES_KEY)
  cache[key] = { data, fetchedAt: Date.now() }
  const keys = Object.keys(cache)
  if (keys.length > MAX_CACHE_ENTRIES) {
    const oldest = keys.sort((a, b) => cache[a].fetchedAt - cache[b].fetchedAt)[0]
    delete cache[oldest]
  }
  writeCache(CACHE_CANDLES_KEY, cache)
}

export function clearCandleCacheForSymbol(symbol: string) {
  const cache = readCache<unknown>(CACHE_CANDLES_KEY)
  const keysToDelete = Object.keys(cache).filter(k => k.startsWith(symbol + '-'))
  keysToDelete.forEach(k => delete cache[k])
  writeCache(CACHE_CANDLES_KEY, cache)
}
