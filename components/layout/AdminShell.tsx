import React from 'react';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-foreground">
      <div className="flex w-full min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-60 flex-col border-r bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="h-14 px-4 flex items-center border-b">
            <div className="font-semibold">Boston</div>
          </div>
          <nav className="flex-1 p-2 space-y-1 text-sm">
            {[
              'Admin Dashboard',
              'User Dashboard',
              'Users',
              'Clients',
              'Orders',
              'Calls',
              'Marketing',
              'Accounting',
              'Knowledge Base',
              'HRM',
            ].map((label, idx) => (
              <button
                key={label}
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-muted ${
                  idx === 4 ? 'bg-muted font-medium' : 'text-muted-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t text-xs text-muted-foreground">v1.0</div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <div className="h-14 flex items-center gap-3 px-4 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <input
              type="search"
              placeholder="Search"
              className="h-9 w-full max-w-xl rounded-md border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="ml-auto flex items-center gap-2">
              <button className="h-9 px-3 rounded-md border text-sm hover:bg-muted">Help</button>
              <div className="h-8 w-8 rounded-full bg-muted" />
            </div>
          </div>

          {/* Content */}
          <main className="p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminShell;

