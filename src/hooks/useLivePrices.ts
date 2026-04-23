import { useEffect, useRef, useState } from 'react'
import { TwelveDataWebSocket } from '@/api/websocket'
import { usePreferencesStore } from '@/stores/preferencesStore'

export function useLivePrices(symbols: string[]) {
  const apiKey = usePreferencesStore((s) => s.apiKey)
  const [prices, setPrices] = useState<Record<string, number>>({})
  const wsRef = useRef<TwelveDataWebSocket | null>(null)
  const symbolsRef = useRef<string[]>([])

  useEffect(() => {
    if (!apiKey || symbols.length === 0) return

    const onTrade = (symbol: string, price: number) => {
      setPrices((prev) => ({ ...prev, [symbol]: price }))
    }

    if (!wsRef.current) {
      wsRef.current = new TwelveDataWebSocket(apiKey, onTrade)
      wsRef.current.connect()
    }

    const prev = new Set(symbolsRef.current)
    const next = new Set(symbols)

    // unsubscribe removed
    for (const s of prev) {
      if (!next.has(s)) wsRef.current.unsubscribe(s)
    }
    // subscribe new
    for (const s of next) {
      if (!prev.has(s)) wsRef.current.subscribe(s)
    }
    symbolsRef.current = symbols

    return () => {
      // only disconnect when component unmounts entirely
    }
  }, [apiKey, symbols.join(',')])  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      wsRef.current?.disconnect()
      wsRef.current = null
    }
  }, [])

  return prices
}
