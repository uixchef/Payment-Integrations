"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

function Sheet(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root modal {...props} />
}

function SheetTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  return <DialogPrimitive.Trigger {...props} />
}

function SheetClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>
) {
  return <DialogPrimitive.Close {...props} />
}

function SheetPortal(
  props: React.ComponentProps<typeof DialogPrimitive.Portal>
) {
  return <DialogPrimitive.Portal {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-[100] bg-[rgba(16,24,40,0.4)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-y-0 right-0 z-[101] flex w-[512px] min-w-[512px] max-w-[512px] shrink-0 flex-col bg-white outline-none",
          "max-sm:min-w-0 max-sm:max-w-[calc(100vw-2rem)] max-sm:w-full",
          "shadow-[-4px_0_24px_rgba(16,24,40,0.08),0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          "duration-200",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-start gap-6 px-4 pt-4",
        className
      )}
      {...props}
    />
  )
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4 pt-4",
        className
      )}
      {...props}
    />
  )
}

function SheetCloseButton({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded text-[#475467] outline-none transition-colors hover:bg-[#f2f4f7] focus-visible:ring-2 focus-visible:ring-[#84adff]",
        className
      )}
      aria-label="Close panel"
      {...props}
    >
      <X className="size-5" strokeWidth={1.75} />
    </DialogPrimitive.Close>
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("sr-only", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetCloseButton,
  SheetTitle,
}
