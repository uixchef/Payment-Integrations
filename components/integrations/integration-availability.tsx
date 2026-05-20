import Image from "next/image"
import { INTEGRATION_ASSETS, flagAsset } from "@/lib/integration-assets"
import type { IntegrationItem } from "@/lib/integrations-data"
import { cn } from "@/lib/utils"

/** Figma Countries row (2123:66907): 24px avatars, 1.5px ring, -4px overlap. */
const FLAG_SIZE_PX = 24

function FlagAvatar({
  code,
  index,
  hasMoreAfter,
}: {
  code: string
  index: number
  hasMoreAfter: boolean
}) {
  return (
    <span
      className={cn("relative size-6 shrink-0", hasMoreAfter && "-mr-1")}
      style={{ zIndex: index + 1 }}
      title={code}
      aria-hidden
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <Image
          src={flagAsset(code)}
          alt=""
          width={FLAG_SIZE_PX}
          height={FLAG_SIZE_PX}
          unoptimized
          className="absolute inset-0 size-full max-w-none object-cover"
        />
      </span>
      <span
        className="pointer-events-none absolute inset-0 rounded-full border-[1.5px] border-solid border-[var(--card-surface-color,white)] transition-colors"
        aria-hidden
      />
    </span>
  )
}

function ExtraCountAvatar({
  count,
  index,
}: {
  count: number
  index: number
}) {
  return (
    <span
      className="relative flex h-6 shrink-0 items-center justify-center rounded-full bg-[#f2f4f7] px-1.5 text-xs font-medium leading-[17px] text-[#475467]"
      style={{ zIndex: index + 1 }}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full border-2 border-solid border-[var(--card-surface-color,white)] transition-colors"
        aria-hidden
      />
      +{count}
    </span>
  )
}

function GlobeIcon({ variant }: { variant: "earth" | "public" }) {
  const src =
    variant === "public"
      ? INTEGRATION_ASSETS.icons.public
      : INTEGRATION_ASSETS.icons.earth

  return (
    <span className="relative size-6 shrink-0">
      <Image
        src={src}
        alt=""
        width={FLAG_SIZE_PX}
        height={FLAG_SIZE_PX}
        unoptimized
        className="size-6"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 rounded-full border-[1.5px] border-solid border-[var(--card-surface-color,white)] transition-colors"
        aria-hidden
      />
    </span>
  )
}

function FlagStack({
  flags,
  extraCount,
}: {
  flags: string[]
  extraCount?: number
}) {
  return (
    <div className="isolate flex shrink-0 items-center">
      <div className="flex shrink-0 items-start">
        {flags.map((code, index) => (
          <FlagAvatar
            key={`${code}-${index}`}
            code={code}
            index={index}
            hasMoreAfter={index < flags.length - 1 || extraCount != null}
          />
        ))}
        {extraCount != null ? (
          <ExtraCountAvatar count={extraCount} index={flags.length} />
        ) : null}
      </div>
    </div>
  )
}

function RegionLabel({ label }: { label: string }) {
  return (
    <div className="flex min-w-0 flex-1 items-center overflow-hidden">
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <div className="flex shrink-0 items-center gap-1 overflow-hidden">
          <div className="flex shrink-0 items-center gap-0.5">
            <GlobeIcon variant="public" />
            <span className="truncate text-base font-medium leading-6 text-[#475467]">
              {label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function IntegrationAvailability({ item }: { item: IntegrationItem }) {
  const { availability } = item

  if (availability.kind === "global" || availability.kind === "location") {
    return (
      <div className="flex w-full items-center gap-1.5">
        <GlobeIcon variant="earth" />
        <span className="truncate text-base font-medium leading-6 text-[#475467]">
          {availability.label}
        </span>
      </div>
    )
  }

  if (availability.kind === "region") {
    return (
      <div className="flex w-full items-center gap-1">
        <GlobeIcon variant="public" />
        <span className="truncate text-base font-medium leading-6 text-[#475467]">
          {availability.label}
        </span>
      </div>
    )
  }

  if (availability.regionLabel) {
    return (
      <div className="flex w-full items-center gap-0.5">
        <FlagStack flags={availability.flags} extraCount={availability.extraCount} />
        <span className="shrink-0 text-base font-medium leading-6 text-[#475467]">
          ,
        </span>
        <RegionLabel label={availability.regionLabel} />
      </div>
    )
  }

  return (
    <div className="flex w-full items-center">
      <FlagStack flags={availability.flags} extraCount={availability.extraCount} />
    </div>
  )
}
