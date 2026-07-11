import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, User, Loader2, Github } from 'lucide-react'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
          <p className="text-neutral-500 mt-2">{mode === 'login' ? 'Sign in to continue' : 'Join the open source search revolution'}</p>
        </div>

        <div className="card p-6">
          <div className="flex mb-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            <button onClick={() => setMode('login')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'login' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500'}`}>Log in</button>
            <button onClick={() => setMode('signup')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'signup' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500'}`}>Sign up</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" className="input pl-10" required />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input pl-10" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input pl-10" required minLength={8} />
              </div>
            </div>
            {mode === 'login' && (
              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">Forgot password?</Link>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200 dark:border-neutral-700" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button className="btn-ghost justify-center py-2"><Github className="w-5 h-5" /></button>
            <button className="btn-ghost justify-center py-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
            </button>
            <button className="btn-ghost justify-center py-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.212 2.45c-2.196-.55-4.94-.55-7.144 0C2.088 2.898 0 6.18 0 8.727c0 3.24 1.584 6.23 4.173 8.33 2.16 1.74 4.92 2.62 7.78 2.62 2.88 0 5.62-.88 7.78-2.62 2.59-2.1 4.17-5.09 4.17-8.33 0-2.547-2.09-5.83-4.86-6.276-.87-.178-1.76-.178-2.63 0z"/></svg>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-neutral-500 mt-6">
          By continuing, you agree to our <Link to="/terms" className="text-primary-600">Terms</Link> and <Link to="/privacy" className="text-primary-600">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
