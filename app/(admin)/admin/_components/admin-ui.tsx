'use client'

import React from 'react'
import { useActionState } from 'react'

const styles = {
  table: { width: '100%', borderCollapse: 'collapse' as const, background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  th: { textAlign: 'left' as const, padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #f1f5f9' },
  btn: { padding: '8px 16px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  btnPrimary: { background: '#22c55e', color: 'white' },
  btnDanger: { background: '#ef4444', color: 'white' },
  btnSecondary: { background: '#e2e8f0', color: '#334155' },
  input: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' as const },
  select: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' as const, background: 'white' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' },
  formGroup: { marginBottom: '16px' },
}

// ============================================
// Layout components
// ============================================

export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</h1>
      {children}
    </div>
  )
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>{children}</div>
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{value}</div>
    </div>
  )
}

// ============================================
// Table components
// ============================================

export function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>{headers.map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

export function Td({ children }: { children?: React.ReactNode }) {
  return <td style={styles.td}>{children}</td>
}

// ============================================
// Form components
// ============================================

export function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...styles.input, ...props.style }} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return <select {...props} style={{ ...styles.select, ...props.style }}>{props.children}</select>
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...styles.input, fontFamily: 'inherit', resize: 'vertical' as const, ...props.style }} />
}

export function Button({ variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'secondary' }) {
  const variantStyle = variant === 'danger' ? styles.btnDanger : variant === 'secondary' ? styles.btnSecondary : styles.btnPrimary
  return <button {...props} style={{ ...styles.btn, ...variantStyle, ...props.style }} />
}

// ============================================
// Form with server action + error/success feedback
// ============================================

type ActionResult = { success: true } | { success: false; error: string } | null

export function ActionForm({
  action,
  children,
  submitLabel = 'Submit',
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>
  children: React.ReactNode
  submitLabel?: string
}) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction}>
      {state && !state.success && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
          {state.error}
        </div>
      )}
      {state?.success && (
        <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
          Success!
        </div>
      )}
      {children}
      <Button type="submit" disabled={pending} style={{ marginTop: '8px', opacity: pending ? 0.6 : 1 }}>
        {pending ? 'Saving...' : submitLabel}
      </Button>
    </form>
  )
}

// ============================================
// Delete button with confirmation
// ============================================

export function DeleteButton({
  action,
  id,
  confirmMessage = 'Are you sure you want to delete this item?',
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>
  id: string
  confirmMessage?: string
}) {
  const [state, formAction, pending] = useActionState(action, null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm(confirmMessage)) {
      e.preventDefault()
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} style={{ display: 'inline' }}>
      <input type="hidden" name="id" value={id} />
      {state && !state.success && (
        <span style={{ color: '#dc2626', fontSize: '11px', marginRight: '8px' }}>{state.error}</span>
      )}
      <Button type="submit" variant="danger" disabled={pending} style={{ padding: '4px 10px', fontSize: '12px', opacity: pending ? 0.6 : 1 }}>
        {pending ? '...' : 'Delete'}
      </Button>
    </form>
  )
}
