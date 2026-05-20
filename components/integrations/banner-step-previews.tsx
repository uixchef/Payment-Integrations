import Image from "next/image"
import type { ReactNode } from "react"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"

const B = INTEGRATION_ASSETS.banner
const L = INTEGRATION_ASSETS.logos

function PreviewFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-[136px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f2f4f7] px-4 py-2">
      {children}
    </div>
  )
}

function ProviderLogo({
  src,
  alt,
  size,
  className,
}: {
  src: string
  alt: string
  size: number
  className: string
}) {
  return (
    <div
      className={`absolute overflow-hidden rounded-full bg-white shadow-[0_5px_10px_-2px_rgba(0,0,0,0.25)] ring-[0.4px] ring-black/10 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size * 2}
        height={size * 2}
        unoptimized
        className="size-full object-cover"
        aria-hidden
      />
    </div>
  )
}

export function ProvidersStepPreview() {
  return (
    <PreviewFrame>
      <div className="relative h-[52px] w-[104px]">
        <ProviderLogo
          src={L.stripe}
          alt=""
          size={22}
          className="left-[41px] top-0"
        />
        <ProviderLogo
          src={L.paypal}
          alt=""
          size={17}
          className="left-[18px] top-[4px]"
        />
        <ProviderLogo
          src={B.nmi}
          alt=""
          size={17}
          className="left-[67px] top-[4px]"
        />
        <ProviderLogo
          src={B.authorizeNet}
          alt=""
          size={15}
          className="left-[88px] top-[12px]"
        />
        <ProviderLogo
          src={L.razorpay}
          alt=""
          size={15}
          className="left-0 top-[11px]"
        />
        <ProviderLogo
          src={B.gocardless}
          alt=""
          size={15}
          className="left-[33px] top-[28px]"
        />
        <ProviderLogo
          src={B.mastercard}
          alt=""
          size={15}
          className="left-[12px] top-[31px]"
        />
        <ProviderLogo
          src={B.gpay}
          alt=""
          size={15}
          className="left-[54px] top-[28px]"
        />
        <ProviderLogo
          src={B.square}
          alt=""
          size={15}
          className="left-[75px] top-[31px]"
        />
      </div>
    </PreviewFrame>
  )
}

export function ProductsStepPreview() {
  return (
    <PreviewFrame>
      <div className="w-[119px] rounded-[3px] bg-white p-1 shadow-[0_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(16,24,40,0.39)]">
        <div className="mb-1 flex items-center justify-between border-b border-[#dcdbd5] pb-1">
          <span className="text-[6px] leading-none text-[#1c1b17]">Products</span>
          <span className="rounded-[1px] bg-[#eff4ff] px-1 py-0.5 text-[3px] font-semibold leading-none text-[#004eeb]">
            Add Variants
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between rounded-[3px] bg-[#e4ebf6] px-1 py-0.5">
            <div className="flex items-center gap-1">
              <div className="size-[14px] overflow-hidden rounded-[2px] bg-[#f2f5f9]">
                <Image
                  src={B.productWaterBottle}
                  alt=""
                  width={28}
                  height={28}
                  unoptimized
                  className="size-full object-cover"
                  aria-hidden
                />
              </div>
              <div>
                <p className="text-[5px] leading-tight text-[#1c1b17]">Water Bottle</p>
                <p className="text-[4px] leading-tight text-black/50">12 Variants</p>
              </div>
            </div>
            <span className="text-[5px] leading-tight text-[#1c1b17]">$50</span>
          </div>
          <div className="flex items-center justify-between rounded-[3px] bg-[#fdfdfc] px-1 py-0.5">
            <div className="flex items-center gap-1">
              <div className="size-[14px] overflow-hidden rounded-[2px] bg-[#f4f3e8]">
                <Image
                  src={B.productBicycle}
                  alt=""
                  width={28}
                  height={28}
                  unoptimized
                  className="size-full object-cover"
                  aria-hidden
                />
              </div>
              <div>
                <p className="text-[5px] leading-tight text-[#1c1b17]">Bicycle</p>
                <p className="text-[4px] leading-tight text-black/50">2 Variants</p>
              </div>
            </div>
            <span className="text-[5px] leading-tight text-[#1c1b17]">$50</span>
          </div>
        </div>
      </div>
    </PreviewFrame>
  )
}

export function LinkStepPreview() {
  return (
    <PreviewFrame>
      <div className="relative w-[125px]">
        <div className="flex overflow-hidden rounded-[2px] border border-[#d0d5dd] bg-white shadow-[0_1px_1px_rgba(16,24,40,0.1),-1px_-1px_1px_rgba(16,24,40,0.39)]">
          <div className="min-w-0 flex-1 truncate border-r border-[#d0d5dd] px-1 py-0.5 text-[8px] leading-tight text-[#101828]">
            http://branditx.io/i/16irM7DO
          </div>
          <div className="flex shrink-0 items-center gap-0.5 px-1 py-0.5">
            <img
              src={B.copy}
              alt=""
              width={9}
              height={9}
              className="size-[9px]"
              aria-hidden
              draggable={false}
            />
            <span className="text-[8px] font-semibold leading-tight text-[#344054]">
              Copy
            </span>
          </div>
        </div>
        <span className="absolute -bottom-1 left-0.5 inline-flex items-center gap-0.5 rounded bg-[#039855] px-1 py-0.5 shadow-[0_1px_1px_rgba(16,24,40,0.1),-1px_-1px_1px_rgba(16,24,40,0.39)]">
          <img
            src={B.mail}
            alt=""
            width={8}
            height={8}
            className="size-2"
            aria-hidden
            draggable={false}
          />
          <span className="text-[7px] font-medium leading-none text-white">SMS</span>
        </span>
      </div>
    </PreviewFrame>
  )
}
