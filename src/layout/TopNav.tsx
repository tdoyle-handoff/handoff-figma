import React from 'react'

export function TopNav() {
  return (
    <div className="h-14 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/handoff-logo.svg" alt="Handoff" className="h-8 w-auto" />
        <span className="font-semibold">Handoff</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-sm">Notifications</button>
        <button className="text-sm">Profile</button>
      </div>
    </div>
  )
}

