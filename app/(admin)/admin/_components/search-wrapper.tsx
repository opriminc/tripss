'use client'

import { Suspense } from 'react'
import { SearchInput, Pagination } from './search-and-pagination'

export function SearchBar({ placeholder }: { placeholder?: string }) {
  return (
    <Suspense fallback={<div style={{ height: '38px' }} />}>
      <SearchInput placeholder={placeholder} />
    </Suspense>
  )
}

export function PaginationBar({ totalCount, pageSize }: { totalCount: number; pageSize?: number }) {
  return (
    <Suspense fallback={null}>
      <Pagination totalCount={totalCount} pageSize={pageSize} />
    </Suspense>
  )
}