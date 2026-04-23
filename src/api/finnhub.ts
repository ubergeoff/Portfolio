import axios from 'axios'
import { usePreferencesStore } from '@/stores/preferencesStore'

const twelvedata = axios.create({
  baseURL: 'https://api.twelvedata.com',
  timeout: 10000,
})

twelvedata.interceptors.request.use((config) => {
  const apiKey = usePreferencesStore.getState().apiKey
  config.params = { ...config.params, apikey: apiKey }
  return config
})

export default twelvedata
