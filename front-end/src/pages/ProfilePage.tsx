import { User, Mail, Calendar, Award } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-500 to-accent-500" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 gap-4">
            <div className="w-24 h-24 rounded-full bg-white dark:bg-neutral-900 border-4 border-white dark:border-neutral-900 shadow-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-600">G</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold">Guest User</h1>
              <p className="text-neutral-500">Not signed in</p>
            </div>
            <a href="/settings" className="btn-secondary">Edit Profile</a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <Award className="w-6 h-6 mx-auto text-primary-500 mb-2" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-neutral-500">Searches</p>
        </div>
        <div className="card p-4 text-center">
          <User className="w-6 h-6 mx-auto text-primary-500 mb-2" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-neutral-500">Saved</p>
        </div>
        <div className="card p-4 text-center">
          <Calendar className="w-6 h-6 mx-auto text-primary-500 mb-2" />
          <p className="text-2xl font-bold">-</p>
          <p className="text-sm text-neutral-500">Member Since</p>
        </div>
        <div className="card p-4 text-center">
          <Award className="w-6 h-6 mx-auto text-primary-500 mb-2" />
          <p className="text-2xl font-bold">Free</p>
          <p className="text-sm text-neutral-500">Plan</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-4">Sign in to access more features</h2>
        <p className="text-neutral-500 mb-4">Create an account to save searches, bookmark results, and more.</p>
        <a href="/auth" className="btn-primary">Sign In / Create Account</a>
      </div>
    </div>
  )
}
