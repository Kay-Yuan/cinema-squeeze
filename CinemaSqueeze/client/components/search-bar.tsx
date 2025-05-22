"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-full 
                   bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="absolute right-1 p-2 text-gray-600 dark:text-gray-400 hover:text-primary 
                   dark:hover:text-primary rounded-full bg-gray-100 dark:bg-gray-700"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
