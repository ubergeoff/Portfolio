import axios from 'axios'
import { usePreferencesStore } from '@/stores/preferencesStore'

const finnhub = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  timeout: 10000,
})

finnhub.interceptors.request.use((config) => {
  const apiKey = usePreferencesStore.getState().apiKey
  config.params = { ...config.params, token: apiKey }
  return config
})

export default finnhub
