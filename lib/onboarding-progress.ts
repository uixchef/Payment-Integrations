export const ONBOARDING_PRODUCTS_KEY = "onboarding-products-count"

export function getOnboardingProductsCount(): number {
  if (typeof window === "undefined") return 0
  const raw = sessionStorage.getItem(ONBOARDING_PRODUCTS_KEY)
  if (!raw) return 0
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0
}

export function setOnboardingProductsCount(count: number) {
  sessionStorage.setItem(
    ONBOARDING_PRODUCTS_KEY,
    String(Math.max(0, Math.floor(count)))
  )
  window.dispatchEvent(new Event("onboarding-progress-change"))
}

export function incrementOnboardingProducts() {
  setOnboardingProductsCount(getOnboardingProductsCount() + 1)
}

export type OnboardingStepId = "connect" | "product" | "link"

export type OnboardingStepStatus = "completed" | "active" | "pending"

export function resolveOnboardingStepStatus(
  stepId: OnboardingStepId,
  {
    providersDone,
    productsDone,
  }: {
    providersDone: boolean
    productsDone: boolean
  }
): OnboardingStepStatus {
  if (stepId === "connect") {
    return providersDone ? "completed" : "active"
  }

  if (stepId === "product") {
    return productsDone ? "completed" : "active"
  }

  return providersDone && productsDone ? "active" : "pending"
}
