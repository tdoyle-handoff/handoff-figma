import React, { useState } from 'react'
import { Filters } from './Filters'
import { ResultsList } from './ResultsList'
import { ListingInformation } from './ListingInformation'
import DreamHomeAddressCapture from '../../../components/DreamHomeAddressCapture'

export function SearchPanel() {
  const [query, setQuery] = useState({ location: '', minPrice: '', maxPrice: '', beds: '', baths: '', type: '', dom: '' })
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'attom' | 'mls'>('attom')

  const handleStartOnboarding = () => {
    try {
      const params = new URLSearchParams(window.location.search)
      params.set('onboarding', '1')
      const suffix = params.toString() ? `?${params.toString()}` : ''
      window.history.replaceState(null, '', `${window.location.pathname}${suffix}`)
      window.location.reload()
    } catch {
      window.location.href = `${window.location.pathname}?onboarding=1`
    }
  }

  return (
    <div className="grid gap-4">
      {/* Pre-onboarding address capture */}
      <DreamHomeAddressCapture onStartOnboarding={handleStartOnboarding} />

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          className={`px-3 py-2 border rounded ${activeTab === 'attom' ? 'bg-muted' : ''}`}
          onClick={() => setActiveTab('attom')}
        >
          ATTOM
        </button>
        <button
          className={`px-3 py-2 border rounded ${activeTab === 'mls' ? 'bg-muted' : ''}`}
          onClick={() => setActiveTab('mls')}
        >
          MLS (RETS/RESO)
        </button>
      </div>

      {activeTab === 'attom' ? (
        <>
          <Filters value={query} onChange={setQuery} onSearch={() => { /* wire to server */ }} />
          <ResultsList onSelect={setSelectedProperty} />
          <ListingInformation property={selectedProperty} />
        </>
      ) : (
        <div className="border rounded p-4">
          <div className="font-medium mb-2">MLS Listing Information</div>
          <p className="text-sm text-muted-foreground">
            MLS RETS/RESO integration will appear here. This tab is intentionally separate and not wired yet.
          </p>
        </div>
      )}
    </div>
  )
}

