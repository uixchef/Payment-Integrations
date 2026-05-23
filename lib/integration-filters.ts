export type FilterType = "payment-methods" | "geographic-location"

export type FilterOption = {
  id: string
  label: string
  icon?: "earth" | "flag"
  flagCode?: string
}

export type FilterSelectionMode = "single" | "multi"

export type FilterDefinition = {
  id: string
  tagLabel: string
  menuLabel: string
  emptyStatus: string
  options: FilterOption[]
  selectionMode?: FilterSelectionMode
  showStatusBar?: boolean
  showFooter?: boolean
}

export const FILTER_DEFINITIONS: Record<FilterType, FilterDefinition> = {
  "payment-methods": {
    id: "payment-methods",
    tagLabel: "Payment method",
    menuLabel: "Payment methods",
    emptyStatus: "No methods selected yet",
    options: [
      { id: "cards", label: "Cards" },
      { id: "wallets", label: "Wallets" },
      { id: "bank-transfer", label: "Bank transfer" },
      { id: "buy-now-pay-later", label: "Buy now pay later" },
      { id: "cc-dc", label: "CC/DC" },
      { id: "venmo", label: "Venmo" },
      { id: "vouchers", label: "Vouchers" },
      { id: "apple-pay", label: "Apple Pay" },
    ],
  },
  "geographic-location": {
    id: "geographic-location",
    tagLabel: "Geographic location",
    menuLabel: "Geographic location",
    emptyStatus: "No countries selected yet",
    options: [
      { id: "global", label: "Available globally", icon: "earth" },
      { id: "US", label: "United States of America", icon: "flag", flagCode: "US" },
      { id: "CA", label: "Canada", icon: "flag", flagCode: "CA" },
      { id: "IN", label: "India", icon: "flag", flagCode: "IN" },
      { id: "ID", label: "Indonesia", icon: "flag", flagCode: "ID" },
      { id: "AF", label: "Afghanistan", icon: "flag", flagCode: "AF" },
      { id: "AX", label: "Aland Islands", icon: "flag", flagCode: "AX" },
      { id: "AL", label: "Albania", icon: "flag", flagCode: "AL" },
      { id: "WS", label: "American Samoa", icon: "flag", flagCode: "WS" },
      { id: "AR", label: "Argentina", icon: "flag", flagCode: "AR" },
      { id: "AD", label: "Andorra", icon: "flag", flagCode: "AD" },
      { id: "AO", label: "Angola", icon: "flag", flagCode: "AO" },
      { id: "indigenous-territories", label: "Indigenous Territories" },
      { id: "indian-ocean-territories", label: "Indian Ocean Territories" },
      { id: "indochina", label: "Indochina" },
      { id: "independence-islands", label: "Independence Islands" },
    ],
  },
}

export const ADD_FILTER_OPTIONS = Object.values(FILTER_DEFINITIONS) as Array<{
  id: FilterType
  menuLabel: string
}>
