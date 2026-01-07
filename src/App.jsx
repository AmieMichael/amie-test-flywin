import React, { useState } from 'react'
import './App.css'

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [auditData, setAuditData] = useState(null)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!searchInput.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:3001/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchInput })
      })
      
      if (!response.ok) throw new Error('Audit failed')
      
      const data = await response.json()
      setAuditData(data)
    } catch (e) {
      setError('Failed to run audit. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'LOW': return '#22c55e'
      case 'MODERATE': return '#f59e0b'
      case 'HIGH': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎯 Flywin</h1>
        <p>Opportunity Audit Dashboard</p>
      </header>

      <main className="main">
        {!auditData ? (
          <div className="search-section">
            <input
              type="text"
              placeholder="Enter company name or Opportunity ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={loading}
            />
            <button onClick={handleSearch} disabled={loading || !searchInput.trim()}>
              {loading ? 'Analyzing...' : 'Run Audit'}
            </button>
            {error && <p className="error">{error}</p>}
            {loading && <p className="loading">Pulling data and analyzing opportunity...</p>}
          </div>
        ) : (
          <div className="results">
            <button className="back-btn" onClick={() => { setAuditData(null); setSearchInput(''); }}>
              ← New Audit
            </button>

            <div 
              className="risk-banner"
              style={{ backgroundColor: getRiskColor(auditData.riskLevel) }}
            >
              <span className="risk-level">{auditData.riskLevel} RISK</span>
              <span className="company-name">{auditData.companyName}</span>
            </div>

            {auditData.riskSummary && (
              <p className="risk-summary">{auditData.riskSummary}</p>
            )}

            <div className="two-column">
              <div className="card strengths">
                <h3>💪 Strengths</h3>
                <ul>
                  {auditData.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="card risks">
                <h3>⚠️ Risks</h3>
                <ul>
                  {auditData.risks?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>

            {auditData.nextSteps && (
              <div className="card">
                <h3>📋 Next Steps</h3>
                {auditData.nextSteps.immediate?.length > 0 && (
                  <>
                    <h4>Immediate (Today)</h4>
                    <ul>
                      {auditData.nextSteps.immediate.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </>
                )}
                {auditData.nextSteps.thisWeek?.length > 0 && (
                  <>
                    <h4>This Week</h4>
                    <ul>
                      {auditData.nextSteps.thisWeek.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </>
                )}
                {auditData.nextSteps.nextTwoWeeks?.length > 0 && (
                  <>
                    <h4>Next 2 Weeks</h4>
                    <ul>
                      {auditData.nextSteps.nextTwoWeeks.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </>
                )}
              </div>
            )}

            {auditData.gapAnalysis && (
              <div className="card">
                <h3>📊 Gap Analysis</h3>
                <div className="gap-grid">
                  <div className="gap-section complete">
                    <h4>✅ Complete</h4>
                    <ul>
                      {auditData.gapAnalysis.complete?.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                  </div>
                  <div className="gap-section partial">
                    <h4>⚠️ Partial</h4>
                    <ul>
                      {auditData.gapAnalysis.partial?.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                  </div>
                  <div className="gap-section missing">
                    <h4>❌ Missing</h4>
                    <ul>
                      {auditData.gapAnalysis.missing?.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {auditData.crmLinks && (auditData.crmLinks.salesforce || auditData.crmLinks.hubspot) && (
              <div className="card">
                <h3>🔗 CRM Links</h3>
                <div className="crm-links">
                  {auditData.crmLinks.salesforce && (
                    <a href={auditData.crmLinks.salesforce} target="_blank" rel="noreferrer">
                      Open in Salesforce →
                    </a>
                  )}
                  {auditData.crmLinks.hubspot && (
                    <a href={auditData.crmLinks.hubspot} target="_blank" rel="noreferrer">
                      Open in HubSpot →
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App