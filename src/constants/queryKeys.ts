export const queryKeys = {
  quote: (symbol: string) => ['quote', symbol] as const,
  candles: (symbol: string, range: string) => ['candles', symbol, range] as const,
  profile: (symbol: string) => ['profile', symbol] as const,
  search: (query: string) => ['search', query] as const,
}
