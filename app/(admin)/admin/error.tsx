'use client'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div style={{ background: '#fef2f2', borderRadius: '12px', padding: '32px', maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#dc2626', margin: '0 0 8px' }}>Something went wrong</h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 16px' }}>
          {error.message || 'An unexpected error occurred while loading this page.'}
        </p>
        {error.digest && (
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px' }}>Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          style={{
            padding: '10px 20px', borderRadius: '6px', border: 'none',
            background: '#dc2626', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  )
}