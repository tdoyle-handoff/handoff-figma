import React from 'react'

export type SearchQuery = {
  location: string
  minPrice: string
  maxPrice: string
  beds: string
  baths: string
  type: string
  dom: string
}

type Props = {
  value: SearchQuery
  onChange: (next: SearchQuery) => void
  onSearch: () => void
}

export default function Filters({ value, onChange, onSearch }: Props) {
  const update = (patch: Partial<SearchQuery>) => onChange({ ...value, ...patch })

  return (
    <div className="border rounded p-4">
      <div className="font-medium mb-3">Search Filters</div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-sm text-muted-foreground">Location</span>
          <input
            className="border rounded px-2 py-1"
            type="text"
            placeholder="City, ZIP, or Address"
            value={value.location}
            onChange={(e) => update({ location: e.target.value })}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-muted-foreground">Min Price</span>
          <input
            className="border rounded px-2 py-1"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={value.minPrice}
            onChange={(e) => update({ minPrice: e.target.value })}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-muted-foreground">Max Price</span>
          <input
            className="border rounded px-2 py-1"
            type="number"
            inputMode="numeric"
            placeholder="Any"
            value={value.maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-muted-foreground">Beds</span>
          <input
            className="border rounded px-2 py-1"
            type="number"
            inputMode="numeric"
            placeholder="Any"
            value={value.beds}
            onChange={(e) => update({ beds: e.target.value })}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-muted-foreground">Baths</span>
          <input
            className="border rounded px-2 py-1"
            type="number"
            inputMode="numeric"
            placeholder="Any"
            value={value.baths}
            onChange={(e) => update({ baths: e.target.value })}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-muted-foreground">Type</span>
          <select
            className="border rounded px-2 py-1"
            value={value.type}
            onChange={(e) => update({ type: e.target.value })}
          >
            <option value="">Any</option>
            <option value="single_family">Single Family</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="multi_family">Multi-Family</option>
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-muted-foreground">Days on Market</span>
          <input
            className="border rounded px-2 py-1"
            type="number"
            inputMode="numeric"
            placeholder="Any"
            value={value.dom}
            onChange={(e) => update({ dom: e.target.value })}
          />
        </label>
      </div>

      <div className="mt-4">
        <button className="px-3 py-2 border rounded" onClick={onSearch}>
          Search
        </button>
      </div>
    </div>
  )
}

