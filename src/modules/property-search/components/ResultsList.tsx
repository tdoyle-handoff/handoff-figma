import React from 'react'

interface Property {
  id: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  type: string
}

interface ResultsListProps {
  properties?: Property[]
  loading?: boolean
}

const ResultsList: React.FC<ResultsListProps> = ({ 
  properties = [], 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">Loading properties...</div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No properties found. Try adjusting your search criteria.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Search Results ({properties.length})</h3>
      <div className="grid gap-4">
        {properties.map((property) => (
          <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-lg">{property.address}</h4>
              <span className="text-xl font-bold text-blue-600">
                ${property.price.toLocaleString()}
              </span>
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>{property.bedrooms} bed</span>
              <span>{property.bathrooms} bath</span>
              <span>{property.sqft.toLocaleString()} sqft</span>
              <span className="capitalize">{property.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultsList
