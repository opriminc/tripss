'use client'

import { signOut } from '@/app/actions/auth'

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      style={{
        width: '100%',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #334155',
        background: 'transparent',
        color: '#94a3b8',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      Sign Out
    </button>
  )
}
