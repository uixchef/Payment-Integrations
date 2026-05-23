"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Calendar,
  CreditCard,
  Flag,
  History,
  Phone,
  Search,
  Type,
  User,
} from "lucide-react"
import { IntegrationsPagination } from "@/components/integrations/integrations-pagination"
import { cn } from "@/lib/utils"
import {
  paginateRows,
  STRIPE_SYNC_CONTACTS,
  STRIPE_SYNC_COUNTS,
  STRIPE_SYNC_NOT_ELIGIBLE,
  STRIPE_SYNC_SUBSCRIPTIONS,
} from "./sync-mock-data"
import {
  AvatarInitials,
  BrandChip,
  Checkbox,
  InfoBanner,
  NotEligibleReasonPill,
  SelectionSummary,
  StatusPill,
  SubscriptionStatusPill,
} from "./sync-primitives"

export type ReviewTab = "contacts" | "subscriptions" | "not-eligible"

export type ReviewSelections = {
  contacts: Set<string>
  subscriptions: Set<string>
}

/* -------------------------------------------------------------------------- */
/* Shared table chrome — mirrors IntegrationTable + IntegrationCountriesPanel  */
/* -------------------------------------------------------------------------- */

/**
 * Header and body cells share these base classes so the dense data tables in
 * the Stripe sync wizard read the same as the integrations dashboard and the
 * merchant-countries side panel: 36px tall rows, gray-100 header strip, gray
 * vertical dividers between columns.
 */
const HEADER_CELL =
  "flex h-9 items-center border-b border-[#d0d5dd] bg-[#f2f4f7] px-3"
const HEADER_LABEL =
  "min-w-0 flex-1 truncate font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]"
const BODY_CELL = "flex h-9 items-center border-b border-[#d0d5dd] px-3"
const BODY_TEXT =
  "truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6"

type IconComp = React.ComponentType<{
  className?: string
  strokeWidth?: number
}>

function HeaderCell({
  icon: Icon,
  label,
  align = "left",
  last = false,
}: {
  icon?: IconComp
  label?: string
  align?: "left" | "right" | "center"
  last?: boolean
}) {
  return (
    <div
      className={cn(
        HEADER_CELL,
        !last && "border-r",
        align === "center" && "justify-center",
        align === "right" && "justify-end"
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-1",
          align === "center" && "justify-center",
          align === "right" && "justify-end"
        )}
      >
        {Icon ? (
          <Icon className="size-4 shrink-0 text-[#475467]" strokeWidth={1.75} />
        ) : null}
        {label ? <span className={HEADER_LABEL}>{label}</span> : null}
      </div>
    </div>
  )
}

function BodyCell({
  children,
  tone = "primary",
  align = "left",
  last = false,
}: {
  children: React.ReactNode
  tone?: "primary" | "secondary" | "danger"
  align?: "left" | "right" | "center"
  last?: boolean
}) {
  return (
    <div
      className={cn(
        BODY_CELL,
        !last && "border-r",
        align === "center" && "justify-center",
        align === "right" && "justify-end",
        tone === "primary" && "text-[#101828]",
        tone === "secondary" && "text-[#475467]",
        tone === "danger" && "text-[#f04438]"
      )}
    >
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Step 2 root                                                                */
/* -------------------------------------------------------------------------- */

export function StepReviewSelect({
  activeTab,
  onTabChange,
  selections,
  onSelectionsChange,
  searchQuery,
  onSearchChange,
}: {
  activeTab: ReviewTab
  onTabChange: (tab: ReviewTab) => void
  selections: ReviewSelections
  onSelectionsChange: (next: ReviewSelections) => void
  searchQuery: string
  onSearchChange: (next: string) => void
}) {
  const totalForTab =
    activeTab === "contacts"
      ? STRIPE_SYNC_CONTACTS.length
      : activeTab === "subscriptions"
        ? STRIPE_SYNC_SUBSCRIPTIONS.length
        : STRIPE_SYNC_NOT_ELIGIBLE.length

  const selectionsForTab =
    activeTab === "contacts"
      ? selections.contacts
      : activeTab === "subscriptions"
        ? selections.subscriptions
        : null

  const selectionCount = selectionsForTab?.size ?? 0
  const [bannerDismissed, setBannerDismissed] = useState(false)
  // Banner persists on the Contacts tab until the user explicitly closes it;
  // selecting rows no longer auto-hides it.
  const showBanner = activeTab === "contacts" && !bannerDismissed

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  useEffect(() => {
    setPage(1)
  }, [activeTab])

  const handlePageSizeChange = (next: number) => {
    setPageSize(next)
    setPage(1)
  }

  const showPagination =
    activeTab !== "not-eligible" && totalForTab >= 10

  const useFitContent = totalForTab < 10

  const handleSelectAll = () => {
    if (!selectionsForTab) return
    if (activeTab === "contacts") {
      onSelectionsChange({
        ...selections,
        contacts: new Set(STRIPE_SYNC_CONTACTS.map((row) => row.id)),
      })
      return
    }
    if (activeTab === "subscriptions") {
      onSelectionsChange({
        ...selections,
        subscriptions: new Set(STRIPE_SYNC_SUBSCRIPTIONS.map((row) => row.id)),
      })
    }
  }

  const handleClear = () => {
    if (activeTab === "contacts")
      onSelectionsChange({ ...selections, contacts: new Set() })
    else if (activeTab === "subscriptions")
      onSelectionsChange({ ...selections, subscriptions: new Set() })
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col",
        !useFitContent && "min-h-0 flex-1"
      )}
    >
      <Tabs activeTab={activeTab} onChange={onTabChange} />

      {showBanner ? (
        <div className="shrink-0 pt-3">
          <InfoBanner
            title="Contacts associated with selected subscriptions."
            description="Matched contacts already exist in HighLevel. New contacts will be created. Saved card references are shown alongside each contact."
            onDismiss={() => setBannerDismissed(true)}
          />
        </div>
      ) : null}

      <div className="flex shrink-0 items-center justify-between pt-3">
        <div>
          {selectionsForTab && selectionCount > 0 ? (
            <SelectionSummary
              selectedCount={selectionCount}
              totalCount={totalForTab}
              onSelectAll={handleSelectAll}
              onClear={handleClear}
            />
          ) : (
            <span />
          )}
        </div>
        <SearchField value={searchQuery} onChange={onSearchChange} />
      </div>

      <div
        className={cn(
          "flex flex-col pt-3",
          useFitContent ? "shrink-0" : "min-h-0 flex-1"
        )}
      >
        {activeTab === "contacts" ? (
          <ContactsTable
            fitContent={useFitContent}
            page={page}
            pageSize={pageSize}
            selections={selections.contacts}
            onSelectionsChange={(next) =>
              onSelectionsChange({ ...selections, contacts: next })
            }
          />
        ) : activeTab === "subscriptions" ? (
          <SubscriptionsTable
            fitContent={useFitContent}
            page={page}
            pageSize={pageSize}
            selections={selections.subscriptions}
            onSelectionsChange={(next) =>
              onSelectionsChange({ ...selections, subscriptions: next })
            }
          />
        ) : (
          <NotEligibleTable fitContent={useFitContent} />
        )}
      </div>

      {showPagination ? (
        <IntegrationsPagination
          total={totalForTab}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      ) : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Tabs                                                                       */
/* -------------------------------------------------------------------------- */

function Tabs({
  activeTab,
  onChange,
}: {
  activeTab: ReviewTab
  onChange: (tab: ReviewTab) => void
}) {
  const items: Array<{ id: ReviewTab; label: string; count: number }> = [
    { id: "contacts", label: "Contacts & cards", count: STRIPE_SYNC_COUNTS.contacts },
    { id: "subscriptions", label: "Subscriptions", count: STRIPE_SYNC_COUNTS.subscriptions },
    { id: "not-eligible", label: "Not eligible", count: STRIPE_SYNC_COUNTS.notEligible },
  ]
  return (
    <div className="flex items-end gap-2 border-b border-[#d0d5dd]">
      {items.map((tab) => {
        const active = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative -mb-px inline-flex h-10 cursor-pointer items-center justify-center gap-1 rounded-t-[4px] border-b-2 px-2 py-1 outline-none transition-colors",
              "font-[family-name:var(--font-inter)] text-base leading-6",
              active
                ? "border-[#004eeb] font-semibold text-[#004eeb]"
                : "border-transparent font-medium text-[#475467] hover:text-[#101828]"
            )}
            aria-current={active ? "page" : undefined}
          >
            {tab.label}
            <span
              className={cn(
                "inline-flex h-[18px] items-center justify-center rounded-[4px] px-1.5 font-[family-name:var(--font-inter)] text-sm font-medium leading-5",
                active ? "bg-[#eff4ff] text-[#004eeb]" : "bg-[#f2f4f7] text-[#475467]"
              )}
            >
              {tab.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

function SearchField({
  value,
  onChange,
}: {
  value: string
  onChange: (next: string) => void
}) {
  return (
    <div className="relative w-[280px]">
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[#667085]"
        strokeWidth={1.75}
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search"
        className={cn(
          "h-9 w-full rounded border border-[#d0d5dd] bg-white pl-8 pr-3",
          "font-[family-name:var(--font-inter)] text-base leading-6 text-[#101828] placeholder:text-[#667085]",
          "shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none transition-colors",
          "focus:border-[#84adff] focus:shadow-[0_0_0_4px_#eff4ff,0_1px_2px_rgba(16,24,40,0.05)]"
        )}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Table shells                                                               */
/* -------------------------------------------------------------------------- */

function TableShell({
  columns,
  header,
  children,
  minWidth = 800,
  fitContent = false,
}: {
  /** Tailwind grid-cols-[...] template, including the leading checkbox track if present. */
  columns: string
  header: React.ReactNode
  children: React.ReactNode
  minWidth?: number
  /** When true (< 10 rows), table height follows content. Otherwise fills and scrolls. */
  fitContent?: boolean
}) {
  const minWidthStyle = { minWidth: `${minWidth}px` }
  return (
    <div
      className={cn(
        "grid w-full overflow-hidden rounded border border-[#d0d5dd] bg-white",
        fitContent ? "h-fit" : "min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)]"
      )}
    >
      <div className="shrink-0 overflow-x-auto">
        <div style={minWidthStyle}>
          <div className={columns} role="row">
            {header}
          </div>
        </div>
      </div>
      <div
        className={cn(
          fitContent
            ? "overflow-x-auto"
            : "min-h-0 overflow-x-auto overflow-y-auto overscroll-y-contain"
        )}
      >
        <div style={minWidthStyle} role="rowgroup">
          {children}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Contacts & cards                                                           */
/* -------------------------------------------------------------------------- */

const CONTACTS_COLUMNS =
  "grid grid-cols-[38px_minmax(220px,1.4fr)_minmax(160px,1fr)_120px_minmax(180px,1fr)_100px]"

function ContactsTable({
  fitContent,
  page,
  pageSize,
  selections,
  onSelectionsChange,
}: {
  fitContent: boolean
  page: number
  pageSize: number
  selections: Set<string>
  onSelectionsChange: (next: Set<string>) => void
}) {
  const rows = useMemo(
    () => paginateRows(STRIPE_SYNC_CONTACTS, page, pageSize),
    [page, pageSize]
  )
  const allOnPage = rows.map((c) => c.id)
  const allSelected = useMemo(
    () => allOnPage.length > 0 && allOnPage.every((id) => selections.has(id)),
    [allOnPage, selections]
  )
  const noneSelected = useMemo(
    () => allOnPage.every((id) => !selections.has(id)),
    [allOnPage, selections]
  )

  const toggleAll = () => {
    const next = new Set(selections)
    if (allSelected) allOnPage.forEach((id) => next.delete(id))
    else allOnPage.forEach((id) => next.add(id))
    onSelectionsChange(next)
  }

  const toggleRow = (id: string) => {
    const next = new Set(selections)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectionsChange(next)
  }

  return (
    <TableShell
      columns={CONTACTS_COLUMNS}
      fitContent={fitContent}
      header={
        <>
          <div className={cn(HEADER_CELL, "border-r justify-center")}>
            <Checkbox
              checked={allSelected}
              indeterminate={!allSelected && !noneSelected}
              onCheckedChange={toggleAll}
              ariaLabel="Select all rows"
            />
          </div>
          <HeaderCell icon={User} label="Contact name" />
          <HeaderCell icon={Phone} label="Phone" />
          <HeaderCell icon={Flag} label="Status" />
          <HeaderCell icon={CreditCard} label="Saved card" />
          <HeaderCell icon={Calendar} label="Expiry" last />
        </>
      }
    >
      {rows.map((row) => {
        const checked = selections.has(row.id)
        return (
          <div
            key={row.id}
            role="row"
            onClick={() => toggleRow(row.id)}
            className={cn(
              CONTACTS_COLUMNS,
              "group cursor-pointer transition-colors",
              checked ? "bg-[#f5f8ff]" : "bg-white hover:bg-[#f5f8ff]"
            )}
          >
            <div
              className={cn(BODY_CELL, "border-r justify-center")}
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => toggleRow(row.id)}
                ariaLabel={`Select ${row.name}`}
              />
            </div>
            <BodyCell tone="primary">
              <div className="flex items-center gap-2">
                <AvatarInitials initials={row.initials} tone={row.avatarTone} />
                <span className={cn(BODY_TEXT, "text-[#101828]")}>
                  {row.name}
                </span>
              </div>
            </BodyCell>
            <BodyCell tone="secondary">
              <span className={cn(BODY_TEXT, "text-[#475467]")}>{row.phone}</span>
            </BodyCell>
            <BodyCell>
              <StatusPill status={row.status} />
            </BodyCell>
            <BodyCell tone="secondary">
              <div
                className={cn(
                  "flex items-center gap-2 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]"
                )}
              >
                <BrandChip brand={row.brand} />
                <span>••••{row.cardLast4}</span>
              </div>
            </BodyCell>
            <BodyCell tone="secondary" last>
              <span className={cn(BODY_TEXT, "text-[#475467]")}>
                {row.expiry}
              </span>
            </BodyCell>
          </div>
        )
      })}
    </TableShell>
  )
}

/* -------------------------------------------------------------------------- */
/* Subscriptions                                                              */
/* -------------------------------------------------------------------------- */

const SUBSCRIPTIONS_COLUMNS =
  "grid grid-cols-[38px_minmax(160px,1fr)_240px_110px_110px_130px_180px_100px]"

const SUBSCRIPTIONS_TABLE_MIN_WIDTH = 1118

function SubscriptionsTable({
  fitContent,
  page,
  pageSize,
  selections,
  onSelectionsChange,
}: {
  fitContent: boolean
  page: number
  pageSize: number
  selections: Set<string>
  onSelectionsChange: (next: Set<string>) => void
}) {
  const rows = useMemo(
    () => paginateRows(STRIPE_SYNC_SUBSCRIPTIONS, page, pageSize),
    [page, pageSize]
  )
  const allOnPage = rows.map((c) => c.id)
  const allSelected =
    allOnPage.length > 0 && allOnPage.every((id) => selections.has(id))
  const noneSelected = allOnPage.every((id) => !selections.has(id))

  const toggleAll = () => {
    const next = new Set(selections)
    if (allSelected) allOnPage.forEach((id) => next.delete(id))
    else allOnPage.forEach((id) => next.add(id))
    onSelectionsChange(next)
  }

  const toggleRow = (id: string) => {
    const next = new Set(selections)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectionsChange(next)
  }

  return (
    <TableShell
      columns={SUBSCRIPTIONS_COLUMNS}
      minWidth={SUBSCRIPTIONS_TABLE_MIN_WIDTH}
      fitContent={fitContent}
      header={
        <>
          <div className={cn(HEADER_CELL, "border-r justify-center")}>
            <Checkbox
              checked={allSelected}
              indeterminate={!allSelected && !noneSelected}
              onCheckedChange={toggleAll}
              ariaLabel="Select all subscriptions"
            />
          </div>
          <HeaderCell icon={User} label="Customer" />
          <HeaderCell icon={Type} label="Product name" />
          <HeaderCell icon={CreditCard} label="Amount" align="right" />
          <HeaderCell icon={History} label="Interval" />
          <HeaderCell icon={Calendar} label="Created on" />
          <HeaderCell icon={CreditCard} label="Payment method" />
          <HeaderCell icon={Flag} label="Status" last />
        </>
      }
    >
      {rows.map((row) => {
        const checked = selections.has(row.id)
        return (
          <div
            key={row.id}
            role="row"
            onClick={() => toggleRow(row.id)}
            className={cn(
              SUBSCRIPTIONS_COLUMNS,
              "group cursor-pointer transition-colors",
              checked ? "bg-[#f5f8ff]" : "bg-white hover:bg-[#f5f8ff]"
            )}
          >
            <div
              className={cn(BODY_CELL, "border-r justify-center")}
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => toggleRow(row.id)}
                ariaLabel={`Select subscription for ${row.customer}`}
              />
            </div>
            <BodyCell tone="secondary">
              <div className="flex items-center gap-1">
                <AvatarInitials initials={row.initials} tone={row.avatarTone} />
                <span className={cn(BODY_TEXT, "text-[#475467]")}>
                  {row.customer}
                </span>
              </div>
            </BodyCell>
            <BodyCell tone="secondary">
              <span className={cn(BODY_TEXT, "text-[#475467]")}>
                {row.product}
              </span>
            </BodyCell>
            <BodyCell tone="secondary" align="right">
              <span className={cn(BODY_TEXT, "text-[#475467]")}>
                {row.amount}
              </span>
            </BodyCell>
            <BodyCell tone="secondary">
              <span className={cn(BODY_TEXT, "text-[#475467]")}>
                {row.interval}
              </span>
            </BodyCell>
            <BodyCell tone="secondary">
              <span className={cn(BODY_TEXT, "text-[#475467]")}>
                {row.created}
              </span>
            </BodyCell>
            <BodyCell tone="secondary">
              <div className="flex items-center gap-1 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
                <span className="inline-flex h-6 w-8 shrink-0 items-center justify-center rounded-[2px] border border-[#eaecf0] bg-white">
                  <BrandChip brand={row.brand} />
                </span>
                <span>••••{row.cardLast4}</span>
              </div>
            </BodyCell>
            <BodyCell last>
              <SubscriptionStatusPill status={row.status} />
            </BodyCell>
          </div>
        )
      })}
    </TableShell>
  )
}

/* -------------------------------------------------------------------------- */
/* Not eligible                                                               */
/* -------------------------------------------------------------------------- */

const NOT_ELIGIBLE_COLUMNS =
  "grid grid-cols-[240px_minmax(240px,1fr)_110px_180px_minmax(180px,1fr)]"

const NOT_ELIGIBLE_TABLE_MIN_WIDTH = 1096

function NotEligibleTable({ fitContent }: { fitContent: boolean }) {
  return (
    <TableShell
      columns={NOT_ELIGIBLE_COLUMNS}
      minWidth={NOT_ELIGIBLE_TABLE_MIN_WIDTH}
      fitContent={fitContent}
      header={
        <>
          <HeaderCell icon={User} label="Customer" />
          <HeaderCell icon={Type} label="Product name" />
          <HeaderCell icon={CreditCard} label="Amount" align="right" />
          <HeaderCell icon={CreditCard} label="Payment method" />
          <HeaderCell icon={Flag} label="Reason" last />
        </>
      }
    >
      {STRIPE_SYNC_NOT_ELIGIBLE.map((row) => (
        <div
          key={row.id}
          role="row"
          className={cn(NOT_ELIGIBLE_COLUMNS, "bg-white")}
        >
          <BodyCell tone="secondary">
            <div className="flex items-center gap-1">
              <AvatarInitials initials={row.initials} tone={row.avatarTone} />
              <span className={cn(BODY_TEXT, "text-[#475467]")}>
                {row.customer}
              </span>
            </div>
          </BodyCell>
          <BodyCell tone="secondary">
            <span className={cn(BODY_TEXT, "text-[#475467]")}>{row.product}</span>
          </BodyCell>
          <BodyCell tone="secondary" align="right">
            <span className={cn(BODY_TEXT, "text-[#475467]")}>{row.amount}</span>
          </BodyCell>
          <BodyCell tone="secondary">
            <div className="flex items-center gap-1 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
              <span className="inline-flex h-6 w-8 shrink-0 items-center justify-center rounded-[2px] border border-[#eaecf0] bg-white">
                <BrandChip brand={row.brand} />
              </span>
              <span>••••{row.cardLast4}</span>
            </div>
          </BodyCell>
          <BodyCell last>
            <NotEligibleReasonPill reason={row.reason} />
          </BodyCell>
        </div>
      ))}
    </TableShell>
  )
}

