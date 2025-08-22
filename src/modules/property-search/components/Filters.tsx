import React from 'react'

interface FiltersProps {
  // Add filter props as needed
}

const Filters: React.FC<FiltersProps> = () => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Property Filters</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Price Range</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Min" 
              className="border rounded px-3 py-2 w-full"
            />
            <input 
              type="number" 
              placeholder="Max" 
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Property Type</label>
          <select className="border rounded px-3 py-2 w-full">
            <option value="">All Types</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Filters
