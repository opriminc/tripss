export default function Home() {
  return (
    <main style={styles.container}>
      {/* Background blobs */}
      <div style={{ ...styles.blob, top: '-80px', left: '-80px', background: 'rgba(134,239,172,0.35)' }} />
      <div style={{ ...styles.blob, bottom: '-100px', right: '-60px', background: 'rgba(147,197,253,0.35)', width: '400px', height: '400px' }} />

      <div style={styles.card}>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Coming Soon
        </div>

        <h1 style={styles.title}>Trip<span style={styles.titleAccent}>SS</span></h1>
        <p style={styles.tagline}>Your weekend escape, sorted.</p>

        <p style={styles.description}>
          Discover the best local getaways, day trips, and holiday experiences
          — handpicked for locals who love exploring without going far.
        </p>

        <div style={styles.divider} />

        <div style={styles.features}>
          <Feature icon="🏕️" text="Weekend camping & nature trails" />
          <Feature icon="🏘️" text="Hidden local gems near you" />
          <Feature icon="🗓️" text="Holiday event roundups" />
          <Feature icon="🚗" text="Easy day-trip itineraries" />
          <Feature icon="🍽️" text="Local food & culture spots" />
          <Feature icon="👨‍👩‍👧" text="Family & group-friendly picks" />
        </div>
      </div>
    </main>
  )
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={styles.feature}>
      <div style={styles.featureIconWrap}>{icon}</div>
      <span style={styles.featureText}>{text}</span>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(145deg, #f0fdf4 0%, #eff6ff 60%, #fefce8 100%)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    filter: 'blur(60px)',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '28px',
    padding: '52px 44px',
    maxWidth: '580px',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #bbf7d0, #d1fae5)',
    color: '#166534',
    fontWeight: 600,
    fontSize: '12px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    padding: '6px 16px',
    borderRadius: '999px',
    marginBottom: '24px',
    border: '1px solid rgba(134,239,172,0.5)',
  },
  badgeDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#22c55e',
    display: 'inline-block',
    boxShadow: '0 0 6px #22c55e',
  },
  title: {
    fontSize: '56px',
    fontWeight: 900,
    color: '#0f172a',
    margin: '0 0 10px',
    letterSpacing: '-2px',
    lineHeight: 1.1,
  },
  titleAccent: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  tagline: {
    fontSize: '18px',
    color: '#64748b',
    fontWeight: 400,
    margin: '0 0 20px',
    letterSpacing: '0.2px',
  },
  description: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.8',
    margin: '0 0 28px',
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
    marginBottom: '28px',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    textAlign: 'left',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(248,250,252,0.8)',
    borderRadius: '14px',
    padding: '13px 15px',
    border: '1px solid rgba(226,232,240,0.8)',
    transition: 'transform 0.2s',
  },
  featureIconWrap: {
    fontSize: '20px',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    flexShrink: 0,
  },
  featureText: {
    fontSize: '13px',
    color: '#334155',
    fontWeight: 500,
    lineHeight: '1.4',
  },
}
