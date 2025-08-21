import React from 'react'

export function LeftSidebar() {
  return (
    div className="p-3 space-y-2"
      div className="text-xs uppercase text-muted-foreground"Navigation/div
      nav className="space-y-1"
        a className="block px-2 py-1 rounded hover:bg-muted" href="#transactions"Transactions/a
        a className="block px-2 py-1 rounded hover:bg-muted" href="#search"Search/a
        a className="block px-2 py-1 rounded hover:bg-muted" href="#vendors"Vendors/a
        a className="block px-2 py-1 rounded hover:bg-muted" href="#documents"Documents/a
        a className="block px-2 py-1 rounded hover:bg-muted" href="#messages"Messages/a
        a className="block px-2 py-1 rounded hover:bg-muted" href="#guides"Guides/a
      /nav
    /div
  )
}

