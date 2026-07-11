import { Link } from 'react-router-dom'
import { Search, Sparkles, Shield, Globe, Zap, Heart, TrendingUp, Users, Database } from 'lucide-react'

const features = [
  { icon: Shield, title: 'Privacy First', desc: 'No tracking, no profiling, no data selling.' },
  { icon: Globe, title: 'Community Driven', desc: 'Curated by real people for real quality.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for speed. Results appear as you type.' },
  { icon: Sparkles, title: 'Open Source', desc: 'Transparent, auditable code. No black box algorithms.' },
]

const stats = [
  { value: '100M+', label: 'Pages Indexed', icon: Database },
  { value: '50K+', label: 'Daily Searches', icon: TrendingUp },
  { value: '10K+', label: 'Contributors', icon: Users },
  { value: '100%', label: 'Open Source', icon: Heart },
]

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/50 rounded-full text-primary-700 dark:text-primary-300 mb-6">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Open Source Search Engine</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
          Search the web<br />
          <span className="gradient-text">with your values</span>
        </h1>
        <p className="text-xl text-neutral-500 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
          MWMBL is a free, open-source search engine that respects your privacy.
          No tracking, no ads, no bias. Just search.
        </p>
        <Link to="/search" className="inline-flex items-center gap-2 btn-primary px-8 py-4 text-lg">
          <Search className="w-5 h-5" />
          Start Searching
        </Link>
      </section>

      {/* Features */}
      <section className="py-16">
        <h2 className="text-2xl font-bold text-center mb-12">Why MWMBL?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-neutral-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-neutral-200 dark:border-neutral-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <s.icon className="w-8 h-8 mx-auto text-primary-500 mb-2" />
              <div className="text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-sm text-neutral-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Ready to search differently?</h2>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
          Join thousands of users who have made the switch to ethical, open-source search.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/search" className="btn-primary px-6 py-3">Start Searching</Link>
          <a href="https://github.com/mwmbl/mwmbl" target="_blank" rel="noopener noreferrer" className="btn-secondary px-6 py-3">View on GitHub</a>
        </div>
      </section>
    </div>
  )
}
