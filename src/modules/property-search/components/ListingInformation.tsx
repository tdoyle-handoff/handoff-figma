import React from 'react'

type Props = {
  property: any
}

export default function ListingInformation({ property }: Props) {
  if (!property) {
    return (
      <div className="border rounded p-4 text-sm text-muted-foreground">
        Select a property to see details.
      </div>
    )
  }

  return (
    <div className="border rounded p-4">
      <div className="font-medium mb-3">Listing Information</div>
      <div className="grid gap-1">
        <div><span className="text-muted-foreground">Address:</span> {property.address}</div>
        {property.price != null && (
          <div><span className="text-muted-foreground">Price:</span> ${'{'}Number(property.price).toLocaleString(){'}'}</div>
        )}
        {property.id && (
          <div className="text-xs text-muted-foreground">ID: {property.id}</div>
        )}
      </div>
    </div>
  )
}

