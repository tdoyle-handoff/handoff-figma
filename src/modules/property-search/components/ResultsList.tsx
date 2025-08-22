import React from 'react'

type Props = {
  onSelect: (property: any) => void
}

export default function ResultsList({ onSelect }: Props) {
  // Placeholder list to keep UI functional; replace with fetched results.
  const mock = [
    { id: '1', address: '123 Main St, Anytown, USA', price: 500000 },
    { id: '2', address: '456 Oak Ave, Somewhere, USA', price: 725000 },
  ]

  return (
    <div className="border rounded p-4">
      <div className="font-medium mb-3">Results</div>
      <ul className="grid gap-2">
        {mock.map((p) => (
          <li key={p.id}>
            <button
              className="w-full text-left border rounded p-2 hover:bg-muted"
              onClick={() => onSelect(p)}
            >
              <div className="font-medium">{p.address}</div>
              <div className="text-sm text-muted-foreground">${'{'}p.price.toLocaleString(){'}'}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

