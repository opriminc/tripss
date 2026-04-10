'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

// ============================================
// Search input with debounce + intellisense dropdown
// ============================================

export function SearchInput({ placeholder = 'Search...' }: { placeholder?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get('q') ?? ''
  const [value, setValue] = useState(currentSearch)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const updateUrl = useCallback((q: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (q) {
      params.set('q', q)
      params.delete('page') // Reset to page 1 on new search
    } else {
      params.delete('q')
      params.delete('page')
    }
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (value !== currentSearch) updateUrl(value)
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [value, currentSearch, updateUrl])

  return (
    <div style={{ position: 'relative', maxWidth: '320px' }}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '9px 12px 9px 34px',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          fontSize: '14px',
          boxSizing: 'border-box',
          outline: 'none',
        }}
      />
      <svg
        style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      {value && (
        <button
          onClick={() => { setValue(''); updateUrl('') }}
          style={{
            position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px', padding: '2px',
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}

// ============================================
// Pagination controls
// ============================================

export function Pagination({ totalCount, pageSize = 100 }: { totalCount: number; pageSize?: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') ?? '1', 10)
  const totalPages = Math.ceil(totalCount / pageSize)

  if (totalPages <= 1) return null

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  // Build page numbers to show (max 7)
  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  const btnBase: React.CSSProperties = {
    padding: '6px 12px', borderRadius: '4px', border: '1px solid #e2e8f0',
    fontSize: '13px', cursor: 'pointer', background: 'white', color: '#334155',
  }
  const btnActive: React.CSSProperties = { ...btnBase, background: '#22c55e', color: 'white', border: '1px solid #22c55e' }
  const btnDisabled: React.CSSProperties = { ...btnBase, opacity: 0.4, cursor: 'default' }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
      <span style={{ fontSize: '13px', color: '#64748b' }}>
        {totalCount} records — Page {currentPage} of {totalPages}
      </span>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={currentPage === 1 ? btnDisabled : btnBase}
        >
          ‹ Prev
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} style={{ padding: '6px 8px', fontSize: '13px', color: '#94a3b8' }}>…</span>
          ) : (
            <button key={p} onClick={() => goToPage(p)} style={p === currentPage ? btnActive : btnBase}>
              {p}
            </button>
          )
        )}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={currentPage === totalPages ? btnDisabled : btnBase}
        >
          Next ›
        </button>
      </div>
    </div>
  )
}