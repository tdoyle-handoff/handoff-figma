import React from 'react'

export function LeftSidebar() {
  return (
    div className="h-full bg-primary text-primary-foreground p-4 space-y-3"
      div className="text-xs uppercase/relaxed tracking-wide text-white/70"Navigation/div
      nav className="space-y-1.5"
        a className="block px-3 py-2 rounded-md hover:bg-white/10 transition" href="#transactions"Transactions/a
        a className="block px-3 py-2 rounded-md hover:bg-white/10 transition" href="#search"Search/a
        a className="block px-3 py-2 rounded-md hover:bg-white/10 transition" href="#vendors"Vendors/a
        a className="block px-3 py-2 rounded-md hover:bg-white/10 transition" href="#documents"Documents/a
        a className="block px-3 py-2 rounded-md hover:bg-white/10 transition" href="#messages"Messages/a
        a className="block px-3 py-2 rounded-md hover:bg-white/10 transition" href="#guides"Guides/a
      /nav
    /div
  )
}

