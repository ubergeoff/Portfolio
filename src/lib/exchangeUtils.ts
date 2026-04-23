interface ExchangeInfo {
  label: string   // human-readable exchange name shown in the badge
  country: string // ISO 3166-1 alpha-2 for the flag
}

const countryNameToAlpha2: Record<string, string> = {
  'Afghanistan': 'AF', 'Albania': 'AL', 'Algeria': 'DZ', 'Argentina': 'AR',
  'Australia': 'AU', 'Austria': 'AT', 'Bahrain': 'BH', 'Belgium': 'BE',
  'Brazil': 'BR', 'Canada': 'CA', 'Chile': 'CL', 'China': 'CN',
  'Colombia': 'CO', 'Croatia': 'HR', 'Cyprus': 'CY', 'Czech Republic': 'CZ',
  'Denmark': 'DK', 'Egypt': 'EG', 'Estonia': 'EE', 'Finland': 'FI',
  'France': 'FR', 'Germany': 'DE', 'Ghana': 'GH', 'Greece': 'GR',
  'Hong Kong': 'HK', 'Hungary': 'HU', 'Iceland': 'IS', 'India': 'IN',
  'Indonesia': 'ID', 'Ireland': 'IE', 'Israel': 'IL', 'Italy': 'IT',
  'Japan': 'JP', 'Jordan': 'JO', 'Kazakhstan': 'KZ', 'Kenya': 'KE',
  'Kuwait': 'KW', 'Latvia': 'LV', 'Lithuania': 'LT', 'Luxembourg': 'LU',
  'Malaysia': 'MY', 'Malta': 'MT', 'Mauritius': 'MU', 'Mexico': 'MX',
  'Morocco': 'MA', 'Netherlands': 'NL', 'New Zealand': 'NZ', 'Nigeria': 'NG',
  'Norway': 'NO', 'Oman': 'OM', 'Pakistan': 'PK', 'Peru': 'PE',
  'Philippines': 'PH', 'Poland': 'PL', 'Portugal': 'PT', 'Qatar': 'QA',
  'Romania': 'RO', 'Russia': 'RU', 'Saudi Arabia': 'SA', 'Singapore': 'SG',
  'Slovakia': 'SK', 'Slovenia': 'SI', 'South Africa': 'ZA', 'South Korea': 'KR',
  'Spain': 'ES', 'Sri Lanka': 'LK', 'Sweden': 'SE', 'Switzerland': 'CH',
  'Taiwan': 'TW', 'Thailand': 'TH', 'Tunisia': 'TN', 'Turkey': 'TR',
  'Ukraine': 'UA', 'United Arab Emirates': 'AE', 'United Kingdom': 'GB',
  'United States': 'US', 'Venezuela': 'VE', 'Vietnam': 'VN', 'Zimbabwe': 'ZW',
}

/** Converts a full country name (as returned by Twelve Data) to ISO 3166-1 alpha-2. */
export function countryToAlpha2(countryName: string): string {
  return countryNameToAlpha2[countryName] ?? ''
}

// Twelve Data appends a dot-suffix to non-US symbols (e.g. "AFT.DE", "VOD.L").
// US stocks have no suffix. Map each suffix to a display label and country code.
const suffixMap: Record<string, ExchangeInfo> = {
  DE: { label: 'XETRA',   country: 'DE' },
  L:  { label: 'LSE',     country: 'GB' },
  PA: { label: 'EPA',     country: 'FR' },
  AS: { label: 'AMS',     country: 'NL' },
  BR: { label: 'EBR',     country: 'BE' },
  MC: { label: 'BME',     country: 'ES' },
  MI: { label: 'MIL',     country: 'IT' },
  SW: { label: 'SWX',     country: 'CH' },
  TO: { label: 'TSX',     country: 'CA' },
  V:  { label: 'TSXV',    country: 'CA' },
  AX: { label: 'ASX',     country: 'AU' },
  T:  { label: 'TSE',     country: 'JP' },
  HK: { label: 'HKEX',   country: 'HK' },
  SS: { label: 'SSE',     country: 'CN' },
  SZ: { label: 'SZSE',    country: 'CN' },
  KS: { label: 'KRX',     country: 'KR' },
  KQ: { label: 'KOSDAQ',  country: 'KR' },
  NS: { label: 'NSE',     country: 'IN' },
  BO: { label: 'BSE',     country: 'IN' },
  SI: { label: 'SGX',     country: 'SG' },
  ST: { label: 'STO',     country: 'SE' },
  CO: { label: 'CPH',     country: 'DK' },
  OL: { label: 'OSL',     country: 'NO' },
  HE: { label: 'HEL',     country: 'FI' },
  IR: { label: 'ISE',     country: 'IE' },
  NZ: { label: 'NZX',     country: 'NZ' },
  WA: { label: 'WSE',     country: 'PL' },
  BK: { label: 'SET',     country: 'TH' },
  KL: { label: 'KLSE',    country: 'MY' },
  JK: { label: 'IDX',     country: 'ID' },
  SA: { label: 'BVMF',    country: 'BR' },
  MX: { label: 'BMV',     country: 'MX' },
  BA: { label: 'BCBA',    country: 'AR' },
  JO: { label: 'JSE',     country: 'ZA' },
  TA: { label: 'TASE',    country: 'IL' },
  ME: { label: 'MOEX',    country: 'RU' },
  AT: { label: 'ATH',     country: 'GR' },
  VI: { label: 'VIE',     country: 'AT' },
  LS: { label: 'ELI',     country: 'PT' },
  IS: { label: 'BIST',    country: 'TR' },
  TW: { label: 'TWSE',    country: 'TW' },
}

const US_EXCHANGE: ExchangeInfo = { label: 'US', country: 'US' }

/** Returns the ticker without the exchange suffix, e.g. "AFT.DE" → "AFT" */
export function getBaseTicker(symbol: string): string {
  const dot = symbol.lastIndexOf('.')
  return dot === -1 ? symbol : symbol.slice(0, dot)
}

/** Returns exchange label + country code parsed from the symbol suffix. */
export function getExchangeInfo(symbol: string): ExchangeInfo | null {
  const dot = symbol.lastIndexOf('.')
  if (dot === -1) {
    // No suffix → US-listed stock; show the US badge
    return US_EXCHANGE
  }
  const suffix = symbol.slice(dot + 1).toUpperCase()
  return suffixMap[suffix] ?? { label: suffix, country: '' }
}
