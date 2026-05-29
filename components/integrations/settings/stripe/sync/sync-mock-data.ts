/**
 * Static mock dataset for the Stripe sync wizard.
 *
 * Array lengths match tab chip counts (Contacts & cards 52, Subscriptions 212,
 * Not eligible 12) so pagination row counts stay realistic.
 */

export type CardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "jcb"
  | "diners"
  | "unionpay"
  | "applepay"
  | "googlepay"
  | "amazonpay"
  | "affirm"
  | "alipay"
  | "klarna"

export type SavedPaymentMethod = {
  brand: CardBrand
  last4: string
}

export type ContactRow = {
  id: string
  name: string
  phone: string
  status: "matched" | "new"
  paymentMethods: SavedPaymentMethod[]
  expiry: string
  initials: string
  avatarTone: AvatarTone
}

export type SubscriptionRow = {
  id: string
  customer: string
  initials: string
  avatarTone: AvatarTone
  product: string
  amount: string
  interval: "Monthly" | "Yearly"
  created: string
  paymentMethods: SavedPaymentMethod[]
  status: "active"
}

export type NotEligibleReason =
  | "Usage based billing"
  | "Active trial period"
  | "Bills within 72hrs"

export type NotEligibleRow = {
  id: string
  customer: string
  initials: string
  avatarTone: AvatarTone
  product: string
  amount: string
  brand: CardBrand
  cardLast4: string
  reason: NotEligibleReason
}

export type AvatarTone =
  | "blue"
  | "amber"
  | "emerald"
  | "rose"
  | "violet"
  | "slate"
  | "teal"
  | "fuchsia"

export const STRIPE_SYNC_COUNTS = {
  contacts: 52,
  subscriptions: 212,
  notEligible: 12,
} as const

const TONES: AvatarTone[] = [
  "blue",
  "amber",
  "emerald",
  "rose",
  "violet",
  "slate",
  "teal",
  "fuchsia",
]

const BRANDS: CardBrand[] = [
  "visa",
  "mastercard",
  "applepay",
  "affirm",
  "alipay",
  "amazonpay",
  "discover",
  "jcb",
  "googlepay",
  "diners",
  "unionpay",
  "klarna",
  "amex",
]

function toneFor(index: number): AvatarTone {
  return TONES[index % TONES.length]
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

const CONTACT_SEEDS: Array<{
  name: string
  status: ContactRow["status"]
  brand: CardBrand
  cardLast4: string
  expiry: string
}> = [
  { name: "Olivia John", status: "matched", brand: "visa", cardLast4: "4242", expiry: "04/28" },
  { name: "Erin Ekstrom Bothman", status: "matched", brand: "mastercard", cardLast4: "5555", expiry: "09/27" },
  { name: "Madelyn Calzoni", status: "new", brand: "applepay", cardLast4: "1234", expiry: "11/26" },
  { name: "Madelyn Geidt", status: "matched", brand: "affirm", cardLast4: "0005", expiry: "01/27" },
  { name: "Dulce Schleifer", status: "matched", brand: "alipay", cardLast4: "9876", expiry: "06/28" },
  { name: "Allison Mango", status: "new", brand: "amazonpay", cardLast4: "8888", expiry: "02/29" },
  { name: "Adison Carder", status: "new", brand: "discover", cardLast4: "2222", expiry: "03/30" },
  { name: "Lewis Hamilton", status: "new", brand: "jcb", cardLast4: "3333", expiry: "05/31" },
  { name: "Hanna Gouse", status: "new", brand: "googlepay", cardLast4: "4444", expiry: "07/29" },
  { name: "Omar Bator", status: "new", brand: "diners", cardLast4: "6666", expiry: "08/30" },
  { name: "Cristofer Dorwart", status: "matched", brand: "unionpay", cardLast4: "7777", expiry: "10/31" },
  { name: "Ann Saris", status: "matched", brand: "klarna", cardLast4: "9999", expiry: "12/28" },
  { name: "Lincoln Rosser", status: "matched", brand: "visa", cardLast4: "1111", expiry: "01/28" },
  { name: "Sophie Carter", status: "matched", brand: "mastercard", cardLast4: "4321", expiry: "02/28" },
  { name: "Craig Ekstrom Bothman", status: "new", brand: "applepay", cardLast4: "1357", expiry: "03/29" },
]

function buildPaymentMethods(
  index: number,
  primaryBrand: CardBrand,
  primaryLast4: string
): SavedPaymentMethod[] {
  const methods: SavedPaymentMethod[] = [
    { brand: primaryBrand, last4: primaryLast4 },
  ]

  const extraCount =
    index % 4 === 0 ? 3 : index % 7 === 0 ? 1 : index % 11 === 0 ? 2 : 0

  for (let i = 0; i < extraCount; i++) {
    methods.push({
      brand: BRANDS[(index + i + 1) % BRANDS.length],
      last4: String(2000 + ((index * 73 + i * 11) % 9000)).slice(-4),
    })
  }

  return methods
}

function buildContacts(count: number): ContactRow[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = CONTACT_SEEDS[index % CONTACT_SEEDS.length]
    const suffix = index >= CONTACT_SEEDS.length ? ` ${Math.floor(index / CONTACT_SEEDS.length) + 1}` : ""
    const name = `${seed.name}${suffix}`
    const primaryBrand = BRANDS[index % BRANDS.length]
    const primaryLast4 = String(1000 + ((index * 137) % 9000)).slice(-4)

    return {
      id: `contact-${index + 1}`,
      name,
      phone: `+1 415 ${String(100 + (index % 900)).padStart(3, "0")} ${String(index + 1).padStart(4, "0")}`,
      status: seed.status,
      paymentMethods: buildPaymentMethods(index, primaryBrand, primaryLast4),
      expiry: seed.expiry,
      initials: initialsOf(name),
      avatarTone: toneFor(index),
    }
  })
}

const SUBSCRIPTION_PRODUCTS = [
  { product: "Hair cut & styling - Testing one", interval: "Monthly" as const, base: 1500 },
  { product: "Deep tissue therapy - Release pack", interval: "Monthly" as const, base: 1600 },
  { product: "Tranquil touch therapy.", interval: "Yearly" as const, base: 1700 },
  { product: "Hair cut & styling - The 'Reboot'", interval: "Monthly" as const, base: 1800 },
  { product: "Massage therapy - Serenity bundle", interval: "Yearly" as const, base: 2000 },
  { product: "Hair cut & styling - The 'Italian Cut'", interval: "Yearly" as const, base: 2200 },
  { product: "Hair cut & styling - The 'Executive'", interval: "Yearly" as const, base: 2500 },
  { product: "UX design - The 'User-Friendly' sprint", interval: "Monthly" as const, base: 2700 },
  { product: "Web development - The 'Foundation' build", interval: "Monthly" as const, base: 3000 },
  { product: "Mobile app development - Phase one", interval: "Monthly" as const, base: 3200 },
  { product: "Cloud solutions - The 'Sync & Scale'", interval: "Monthly" as const, base: 3500 },
  { product: "Deep tissue therapy - Release pack", interval: "Yearly" as const, base: 3800 },
  { product: "Calm touch therapy.", interval: "Monthly" as const, base: 4000 },
  { product: "Hair cut & styling - The 'Refresh'", interval: "Yearly" as const, base: 4500 },
  { product: "Massage therapy - Serenity bundle", interval: "Yearly" as const, base: 4800 },
]

function addDays(base: Date, days: number): Date {
  const next = new Date(base)
  next.setDate(next.getDate() + days)
  return next
}

function formatDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${m}/${day}/${d.getFullYear()}`
}

const BASE_DATE = new Date("2026-10-30")

function buildSubscriptions(count: number): SubscriptionRow[] {
  return Array.from({ length: count }, (_, index) => {
    const productEntry = SUBSCRIPTION_PRODUCTS[index % SUBSCRIPTION_PRODUCTS.length]
    const contactSeed = CONTACT_SEEDS[index % CONTACT_SEEDS.length]
    const suffix = index >= CONTACT_SEEDS.length ? ` ${Math.floor(index / CONTACT_SEEDS.length) + 1}` : ""
    const customer = `${contactSeed.name}${suffix}`
    const amount = productEntry.base + (Math.floor(index / SUBSCRIPTION_PRODUCTS.length) * 50)
    const primaryBrand = BRANDS[index % BRANDS.length]
    const primaryLast4 = String(1000 + ((index * 137) % 9000)).slice(-4)

    return {
      id: `sub-${index + 1}`,
      customer,
      initials: initialsOf(customer),
      avatarTone: toneFor(index),
      product: productEntry.product,
      amount: `$${amount}`,
      interval: productEntry.interval,
      created: formatDate(addDays(BASE_DATE, index % 365)),
      paymentMethods: buildPaymentMethods(index, primaryBrand, primaryLast4),
      status: "active" as const,
    }
  })
}

const NOT_ELIGIBLE_REASONS: NotEligibleReason[] = [
  "Usage based billing",
  "Active trial period",
  "Bills within 72hrs",
]

function buildNotEligible(count: number): NotEligibleRow[] {
  return Array.from({ length: count }, (_, index) => {
    const contactSeed = CONTACT_SEEDS[index % CONTACT_SEEDS.length]
    const productEntry = SUBSCRIPTION_PRODUCTS[index % SUBSCRIPTION_PRODUCTS.length]
    return {
      id: `ne-${index + 1}`,
      customer: contactSeed.name,
      initials: initialsOf(contactSeed.name),
      avatarTone: toneFor(index),
      product: productEntry.product,
      amount: `$${productEntry.base}`,
      brand: contactSeed.brand,
      cardLast4: contactSeed.cardLast4,
      reason: NOT_ELIGIBLE_REASONS[index % NOT_ELIGIBLE_REASONS.length],
    }
  })
}

export const STRIPE_SYNC_CONTACTS = buildContacts(STRIPE_SYNC_COUNTS.contacts)
export const STRIPE_SYNC_SUBSCRIPTIONS = buildSubscriptions(
  STRIPE_SYNC_COUNTS.subscriptions
)
export const STRIPE_SYNC_NOT_ELIGIBLE = buildNotEligible(
  STRIPE_SYNC_COUNTS.notEligible
)

/** Slice a dataset for the current pagination window. */
export function paginateRows<T>(rows: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}
