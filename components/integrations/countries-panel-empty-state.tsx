"use client"

import Image from "next/image"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import { cn } from "@/lib/utils"

type CountriesPanelEmptyStateProps = {
  onClearFilters?: () => void
}

export function CountriesPanelEmptyState({
  onClearFilters,
}: CountriesPanelEmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-[100px]">
      <div className="flex flex-col items-center gap-4">
        <Image
          src={INTEGRATION_ASSETS.countries.emptyState}
          alt=""
          width={480}
          height={480}
          className="size-40 shrink-0 select-none"
          unoptimized
          aria-hidden
          priority
        />

        <div className="flex w-[352px] max-w-full flex-col items-center gap-4 px-4">
          <div className="flex w-full flex-col items-center gap-1 text-center">
            <h3 className="w-full font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
              No countries match your search or filters
            </h3>
            <p className="w-full font-[family-name:var(--font-inter)] text-sm font-normal leading-5 text-[#475467]">
              Try adjusting or clearing your filter criteria to see more results.
            </p>
          </div>

          {onClearFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className={cn(
                "inline-flex cursor-pointer items-center justify-center rounded-[8px] border border-[#84adff] bg-white px-3.5 py-2",
                "font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#004eeb]",
                "shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none transition-colors",
                "hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#84adff]"
              )}
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
