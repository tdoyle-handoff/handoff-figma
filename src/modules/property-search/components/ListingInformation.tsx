import React from 'react'

interface ListingData {
  id: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  type: string
  description?: string
  yearBuilt?: number
  lotSize?: number
  features?: string[]
}

interface ListingInformationProps {
  listing?: ListingData | null
}

const ListingInformation: React.FC<ListingInformationProps> = ({ listing }) => {
  if (!listing) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a property to view detailed information
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{listing.address}</h2>
        <div className="text-3xl font-bold text-blue-600 mb-4">
          ${listing.price.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-2xl font-bold">{listing.bedrooms}</div>
          <div className="text-sm text-gray-600">Bedrooms</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-2xl font-bold">{listing.bathrooms}</div>
          <div className="text-sm text-gray-600">Bathrooms</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-2xl font-bold">{listing.sqft.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Sq Ft</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-2xl font-bold capitalize">{listing.type}</div>
          <div className="text-sm text-gray-600">Type</div>
        </div>
      </div>

      {listing.description && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{listing.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listing.yearBuilt && (
          <div>
            <span className="font-semibold">Year Built:</span> {listing.yearBuilt}
          </div>
        )}
        {listing.lotSize && (
          <div>
            <span className="font-semibold">Lot Size:</span> {listing.lotSize.toLocaleString()} sq ft
          </div>
        )}
      </div>

      {listing.features && listing.features.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Features</h3>
          <div className="flex flex-wrap gap-2">
            {listing.features.map((feature, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ListingInformation
