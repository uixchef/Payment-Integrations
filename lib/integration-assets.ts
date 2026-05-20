/** HighLevel Integrations asset paths (source + no-providers-connected). */

export const INTEGRATION_ASSETS = {
  logos: {
    stripe: "/integrations/no-providers-connected/stripe.svg",
    paypal: "/integrations/no-providers-connected/paypal.svg",
    nmi: "/integrations/source/nmi.png",
    gocardless: "/integrations/source/gocardless.png",
    square: "/integrations/source/square.png",
    authorizeNet: "/integrations/source/authorize-net.png",
    razorpay: "/integrations/logos/razorpay.png",
    manual: "/integrations/no-providers-connected/money.svg",
    clover: "/integrations/source/clover.png",
    paymob: "/integrations/source/paymob.png",
    paytabs: "/integrations/source/paytabs.png",
    eway: "/integrations/source/eway.jpg",
    payplus: "/integrations/source/payplus.png",
    easyPayDirect: "/integrations/source/easy-pay-direct.png",
    deposyt: "/integrations/source/deposyt.png",
    madison: "/integrations/source/madison.png",
    noomerik: "/integrations/source/noomerik.png",
    placeholder: "/integrations/no-providers-connected/placeholder.svg",
  },
  icons: {
    verified: "/integrations/no-providers-connected/verified.svg",
    earth: "/integrations/no-providers-connected/earth.svg",
    public: "/integrations/no-providers-connected/public.svg",
  },
  table: {
    creditCard: "/integrations/table/credit-card.svg",
    public: "/integrations/table/public.svg",
    filterLines: "/integrations/table/filter-lines.svg",
    highlightMouseCursor: "/integrations/table/highlight-mouse-cursor.svg",
  },
  toolbar: {
    grid: "/integrations/toolbar/grid.svg",
    list: "/integrations/toolbar/list.svg",
  },
  filters: {
    earth: "/integrations/filters/earth.png",
    flags: "/integrations/filters/flags",
  },
  banner: {
    stepArrow: "/integrations/banner/step-arrow.svg",
    productWaterBottle: "/integrations/banner/product-water-bottle.png",
    productBicycle: "/integrations/banner/product-bicycle.png",
    nmi: "/integrations/banner/nmi.png",
    authorizeNet: "/integrations/banner/authorize-net.png",
    gocardless: "/integrations/banner/gocardless.png",
    square: "/integrations/banner/square.png",
    razorpay: "/integrations/banner/razorpay.png",
    mastercard: "/integrations/banner/mastercard.png",
    gpay: "/integrations/banner/gpay.png",
    copy: "/integrations/banner/copy.svg",
    mail: "/integrations/banner/mail.svg",
  },
} as const

export function flagAsset(code: string) {
  return `/integrations/no-providers-connected/flags/${code}.svg`
}

export function filterFlagAsset(code: string) {
  return `${INTEGRATION_ASSETS.filters.flags}/${code}.png`
}
