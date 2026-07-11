import { Moon, Sun, Monitor, Palette, Type, Accessibility } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-neutral-500 mt-2">Customize your MWMBL experience</p>
      </div>

      {/* Appearance */}
      <section className="card p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
            <Palette className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="font-semibold">Appearance</h2>
            <p className="text-sm text-neutral-500">Customize the look and feel</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Light', icon: Sun, theme: 'light' },
              { label: 'Dark', icon: Moon, theme: 'dark' },
              { label: 'System', icon: Monitor, theme: 'system' },
            ].map((t) => (
              <button key={t.theme} className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-primary-500 transition-colors">
                <t.icon className="w-6 h-6 mx-auto mb-2 text-neutral-600" />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Color Preset</label>
          <div className="grid grid-cols-4 gap-2">
            {['Default', 'Nord', 'Dracula', 'Catppuccin'].map((name, i) => (
              <button key={name} className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-500 transition-colors">
                <div className={`w-full h-8 rounded mb-2 ${['bg-sky-500', 'bg-slate-400', 'bg-purple-500', 'bg-pink-400'][i]}`} />
                <span className="text-xs font-medium">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="card p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
            <Accessibility className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="font-semibold">Accessibility</h2>
            <p className="text-sm text-neutral-500">Make MWMBL easier to use</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Font Size</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Small', size: 'sm' },
              { label: 'Medium', size: 'base' },
              { label: 'Large', size: 'lg' },
            ].map((t) => (
              <button key={t.size} className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-500 transition-colors">
                <span className={`font-medium ${t.size === 'sm' ? 'text-sm' : t.size === 'base' ? 'text-base' : 'text-lg'}`}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="card p-6">
        <h2 className="font-semibold mb-4">Privacy Settings</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium">Search History</p>
              <p className="text-sm text-neutral-500">Remember your searches locally</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium">Safe Search</p>
              <p className="text-sm text-neutral-500">Filter explicit content</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
        </div>
      </section>
    </div>
  )
}
