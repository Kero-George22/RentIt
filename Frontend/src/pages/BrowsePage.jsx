import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useMarketplace } from '../context/MarketplaceContext'
import { categories } from '../data/mockData'

const AVAILABILITY_OPTIONS = [
  { label: 'Sale', value: 'sale' },
  { label: 'Rent', value: 'rent' },
  { label: 'Both', value: 'both' },
]

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
]

const PAGE_SIZE = 9

function getDisplayPrice(product) {
  return product.salePrice || product.rentalPricePerDay || 0
}

export default function BrowsePage() {
  const [searchParams] = useSearchParams()
  const { products } = useMarketplace()

  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''

  const [keyword, setKeyword] = useState(initialQuery)
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : [],
  )
  const [priceRange, setPriceRange] = useState(1500)
  const [availability, setAvailability] = useState(['sale', 'rent', 'both'])
  const [rating, setRating] = useState(0)
  const [sortBy, setSortBy] = useState('featured')
  const [page, setPage] = useState(1)

  const filteredProducts = useMemo(() => {
    const query = keyword.toLowerCase()

    return products
      .filter((product) => {
        const matchesKeyword =
          !query ||
          product.title.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)

        const matchesCategory =
          selectedCategories.length === 0 || selectedCategories.includes(product.category)

        const matchesPrice = getDisplayPrice(product) <= priceRange

        const matchesAvailability =
          availability.length === 0 ||
          availability.some((value) => {
            if (value === 'both') {
              return product.availability === 'BOTH'
            }

            if (value === 'sale') {
              return product.availability === 'SALE' || product.availability === 'BOTH'
            }

            if (value === 'rent') {
              return product.availability === 'RENT' || product.availability === 'BOTH'
            }

            return false
          })

        const matchesRating = product.rating >= rating

        return (
          matchesKeyword &&
          matchesCategory &&
          matchesPrice &&
          matchesAvailability &&
          matchesRating
        )
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return getDisplayPrice(a) - getDisplayPrice(b)
        }

        if (sortBy === 'price-desc') {
          return getDisplayPrice(b) - getDisplayPrice(a)
        }

        if (sortBy === 'rating') {
          return b.rating - a.rating
        }

        return 0
      })
  }, [products, keyword, selectedCategories, priceRange, availability, rating, sortBy])

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const pagedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleCategory = (categoryName) => {
    setPage(1)
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((entry) => entry !== categoryName)
        : [...prev, categoryName],
    )
  }

  const toggleAvailability = (availabilityValue) => {
    setPage(1)
    setAvailability((prev) =>
      prev.includes(availabilityValue)
        ? prev.filter((entry) => entry !== availabilityValue)
        : [...prev, availabilityValue],
    )
  }

  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-5 px-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Search</h3>
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2"
              type="search"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value)
                setPage(1)
              }}
              placeholder="Search products"
            />
          </div>

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Category</h3>
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  className="h-4 w-4"
                  type="checkbox"
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => toggleCategory(category.name)}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Price Range: up to ${priceRange}</h3>
            <input
              className="w-full"
              type="range"
              min="20"
              max="1500"
              value={priceRange}
              onChange={(event) => {
                setPriceRange(Number(event.target.value))
                setPage(1)
              }}
            />
          </div>

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Availability</h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${availability.includes(option.value) ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => toggleAvailability(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Star Rating</h3>
            <select
              className="w-full rounded-md border border-gray-200 px-3 py-2"
              value={rating}
              onChange={(event) => {
                setRating(Number(event.target.value))
                setPage(1)
              }}
            >
              <option value="0">All ratings</option>
              <option value="4">4 stars & above</option>
              <option value="4.5">4.5 stars & above</option>
            </select>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {selectedCategories.length === 0 && <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">All Categories</span>}
              {selectedCategories.map((categoryName) => (
                <button
                  type="button"
                  key={categoryName}
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                  onClick={() => toggleCategory(categoryName)}
                >
                  {categoryName} ×
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600">Sort by</label>
              <select
                className="rounded-md border border-gray-200 px-3 py-2"
                id="sort"
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value)
                  setPage(1)
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pagedProducts.length === 0 && <p className="text-sm text-gray-500">No products found for the current filters.</p>}
            {pagedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
