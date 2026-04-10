'use client'

import { signOut } from '@/app/actions/auth'
import { useState } from 'react'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogout() {
    setLoading(true)
    setError('')
    try {
      await signOut()
    } catch {
      setError('Sign out failed')
      setLoading(false)
    }
  }

  return (
    <div>
      {error && <div style={{ color: '#f87171', fontSize: '11px', marginBottom: '6px' }}>{error}</div>}
      <button
        onClick={handleLogout}
        disabled={loading}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #334155',
          background: 'transparent',
          color: '#94a3b8',
          fontSize: '13px',
          fontWeight: 500,
          cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Signing out...' : 'Sign Out'}
      </button>
    </div>
  )
}