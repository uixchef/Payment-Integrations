const COUNTRY_LABELS: Record<string, string> = {
  AD: "Andorra",
  AE: "United Arab Emirates",
  AF: "Afghanistan",
  AL: "Albania",
  AO: "Angola",
  AR: "Argentina",
  AT: "Austria",
  AU: "Australia",
  AX: "Aland Islands",
  BE: "Belgium",
  BR: "Brazil",
  CA: "Canada",
  CH: "Switzerland",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  CR: "Costa Rica",
  CY: "Cyprus",
  DE: "Germany",
  DK: "Denmark",
  DO: "Dominican Republic",
  DZ: "Algeria",
  EE: "Estonia",
  EG: "Egypt",
  ES: "Spain",
  ET: "Ethiopia",
  FI: "Finland",
  FJ: "Fiji",
  FR: "France",
  GB: "United Kingdom",
  GH: "Ghana",
  GN: "Guinea",
  GR: "Greece",
  GT: "Guatemala",
  HK: "Hong Kong",
  HN: "Honduras",
  ID: "Indonesia",
  IE: "Ireland",
  IL: "Israel",
  IN: "India",
  IS: "Iceland",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  KE: "Kenya",
  KG: "Kyrgyzstan",
  KR: "South Korea",
  LT: "Lithuania",
  LU: "Luxembourg",
  LV: "Latvia",
  MA: "Morocco",
  MT: "Malta",
  MX: "Mexico",
  MY: "Malaysia",
  NG: "Nigeria",
  NI: "Nicaragua",
  NL: "Netherlands",
  NO: "Norway",
  NZ: "New Zealand",
  PA: "Panama",
  PE: "Peru",
  PG: "Papua New Guinea",
  PH: "Philippines",
  PL: "Poland",
  PR: "Puerto Rico",
  PT: "Portugal",
  SA: "Saudi Arabia",
  SE: "Sweden",
  SG: "Singapore",
  SI: "Slovenia",
  SK: "Slovakia",
  SN: "Senegal",
  SV: "El Salvador",
  TH: "Thailand",
  TZ: "Tanzania",
  UG: "Uganda",
  US: "United States",
  UY: "Uruguay",
  VN: "Vietnam",
  WS: "American Samoa",
  ZA: "South Africa",
}

/** A single tag or a tight cluster of tags (Figma "Multiple" group). */
export type CountryTooltipSegment = string | string[]

/** Default hidden countries shown in the +N badge tooltip (Figma 2284:57788). */
export const DEFAULT_EXTRA_COUNTRY_TOOLTIP = [
  "US",
  "CA",
  "IT",
  "AR",
  "UY",
  "AU",
  "GB",
  "JP",
  "DE",
  "FR",
] as const

/** Row layout matching Figma 2284:57788 — three rows, subgroups with tighter gap. */
export const DEFAULT_EXTRA_COUNTRY_TOOLTIP_LAYOUT: CountryTooltipSegment[][] = [
  ["US", ["CA", "IT", "AR"], "UY"],
  ["AU", ["GB", "JP", "DE"]],
  ["FR"],
]

export function getCountryLabel(code: string): string {
  return COUNTRY_LABELS[code] ?? code
}

/** Split flat country codes into rows for custom provider tooltips. */
export function chunkCountryTooltipRows(
  codes: string[],
  rowSize = 4
): string[][] {
  const rows: string[][] = []

  for (let index = 0; index < codes.length; index += rowSize) {
    rows.push(codes.slice(index, index + rowSize))
  }

  return rows
}
