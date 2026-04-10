import Link from 'next/link'
import { LogoutButton } from './_components/logout-button'

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Regions', href: '/admin/regions' },
  { label: 'Origin Cities', href: '/admin/origin-cities' },
  { label: 'Interests', href: '/admin/interests' },
  { label: 'Travel Types', href: '/admin/travel-types' },
  { label: 'Place Types', href: '/admin/place-types' },
  { label: 'Places', href: '/admin/places' },
  { label: 'Place Images', href: '/admin/place-images' },
  { label: 'Place Contacts', href: '/admin/place-contacts' },
  { label: 'Ratings', href: '/admin/ratings' },
  { label: 'Newsletter', href: '/admin/newsletter' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <aside style={{
        width: '220px',
        background: '#0f172a',
        color: '#e2e8f0',
        padding: '20px 0',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #1e293b' }}>
          <Link href="/admin" style={{ color: '#22c55e', textDecoration: 'none', fontSize: '20px', fontWeight: 800 }}>
            TripSS Admin
          </Link>
        </div>
        <nav style={{ marginTop: '12px', flex: 1 }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                padding: '10px 20px',
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b' }}>
          <Link href="/" style={{ display: 'block', color: '#64748b', textDecoration: 'none', fontSize: '13px', marginBottom: '12px' }}>
            ← Back to site
          </Link>
          <LogoutButton />
        </div>
      </aside>
      <main style={{ flex: 1, background: '#f8fafc', padding: '32px', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
