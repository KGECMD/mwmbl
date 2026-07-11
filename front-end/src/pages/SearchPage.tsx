import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, Filter, Loader2, ExternalLink, Bookmark, Clock, Share2 } from 'lucide-react'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      performSearch(q)
    }
  }, [searchParams])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/v2/search/?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (err) {
      console.error('Search failed:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearchParams({ q: query })
    performSearch(query)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Input */}
      <div className="sticky top-20 z-30 bg-neutral-50 dark:bg-neutral-950 py-4">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the web..."
              className="w-full pl-12 pr-12 py-4 text-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 animate-spin" />}
          </div>
        </form>
        <div className="flex items-center justify-between mt-4">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">{results.length} results for "{query}"</p>
          {results.map((result, i) => (
            <div key={i} className="group card p-4 hover:shadow-md transition-all">
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-neutral-500 truncate">{result.domain}</span>
                      {result.state && <span className="badge-success text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Verified</span>}
                    </div>
                    <h3 className="text-lg font-medium text-primary-600 dark:text-primary-400 group-hover:underline truncate">{result.title}</h3>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400 line-clamp-2">{result.extract}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-neutral-300 dark:text-neutral-600 flex-shrink-0" />
                </div>
              </a>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button className="flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-600">
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
                <button className="flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-600">
                  <Clock className="w-4 h-4" />
                  {new Date().toLocaleDateString()}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-neutral-500">Try different keywords or check your spelling</p>
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="w-16 h-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Start searching</h3>
          <p className="text-neutral-500">Enter your search query above</p>
        </div>
      )}
    </div>
  )
}
