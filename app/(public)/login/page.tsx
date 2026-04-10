'use client'

import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createBrowserClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      router.push(redirect)
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
        />
      </div>

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%', padding: '10px', borderRadius: '6px', border: 'none',
          background: loading ? '#94a3b8' : '#22c55e', color: 'white',
          fontSize: '14px', fontWeight: 600, cursor: loading ? 'default' : 'pointer',
        }}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
          TripSS Admin
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px' }}>
          Sign in to manage your travel platform.
        </p>
        <Suspense fallback={<div style={{ color: '#94a3b8', fontSize: '14px' }}>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
