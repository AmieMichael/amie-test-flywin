import React, { useState } from 'react'
import './App.css'

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [auditData, setAuditData] = useState(null)

  const handleSearch = async () => {
    if (!searchInput.trim()) return
    
    setLoading(true)
    // TODO: This is where we'll call Claude API
    console.log('Searching for:', searchInput)
    
    // Placeholder for now
    setTimeout(() => {
      setLoading(false)
      setAuditData({ placeholder: true, query: searchInput })
    }, 1000)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎯 Flywin</h1>
        <p>Opportunity Audit Dashboard</p>
      </header>

      <main className="main">
        <div className="search-section">
          <input
            type="text"
            placeholder="Enter company name or Opportunity ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Analyzing...' : 'Run Audit'}
          </button>
        </div>

        {auditData && (
          <div className="results">
            <h2>Audit Results</h2>
            <p>Query: {auditData.query}</p>
            <p><em>Full audit dashboard coming soon...</em></p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App