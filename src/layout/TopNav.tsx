import React from 'react'

export function TopNav() {
  return (
    div className="h-14 px-6 flex items-center justify-between bg-card border-b shadow-soft"
      div className="flex items-center gap-3"
        div className="w-8 h-8 bg-primary rounded" /
        span className="font-semibold"Handoff/span
      /div
      div className="flex items-center gap-3"
        button className="text-sm btn-secondary px-3 py-1.5 rounded-md border"Notifications/button
        button className="text-sm btn-primary px-3 py-1.5 rounded-md"Profile/button
      /div
    /div
  )
}

