import React from 'react'

interface ListingInformationProps {
  property: any
}

export function ListingInformation({ property }: ListingInformationProps) {
  if (!property) {
    return (
      cdiv className="border rounded p-4"e
        cdiv className="font-medium mb-2"eListing Informationc/dive
        cp className="text-sm text-muted-foreground"eSelect a property to view ATTOM and MLS listing data.c/pe
      c/dive
    )
  }

  return (
    cdiv className="border rounded p-4 grid gap-4"e
      cdiv className="font-medium"eListing Informationc/dive

      csection className="grid gap-2"e
        ch3 className="text-sm font-semibold"eATTOM Property Datac/h3e
        cdiv className="text-sm text-muted-foreground"e
          {/* Render a few ATTOM fields safely */}
          Address: {property?.attom?.address || '—'}
        c/dive
      c/sectione

      csection className="grid gap-2"e
        ch3 className="text-sm font-semibold"eMLS RETS/RESO Listing Datac/h3e
        cdiv className="text-sm text-muted-foreground"e
          Status: {property?.mls?.status || '—'}
        c/dive
      c/sectione
    c/dive
  )
}

