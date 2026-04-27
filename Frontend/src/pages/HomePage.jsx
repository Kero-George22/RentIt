import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useMarketplace } from '../context/MarketplaceContext'
import { categories, promoBanners } from '../data/mockData'
import { useMemo, useState } from 'react'

const TREND_TABS = ['New Products', 'Best Selling', 'Featured Products']

const PROMO_BG_CLASS = {
  'promo-blue': 'from-sky-100 to-blue-50',
  'promo-pink': 'from-rose-100 to-pink-50',
  'promo-yellow': 'from-amber-100 to-yellow-50',
}

export default function HomePage() {
  const { products } = useMarketplace()
  const [activeTab, setActiveTab] = useState('New Products')

  const trendingProducts = useMemo(() => {
    if (activeTab === 'New Products') {
      return products.filter((product) => product.badges.includes('NEW')).slice(0, 8)
    }

    if (activeTab === 'Best Selling') {
      return [...products].sort((a, b) => b.rating - a.rating).slice(0, 8)
    }

    return products.filter((product) => product.availability === 'BOTH').slice(0, 8)
  }, [activeTab, products])

  return (
    <>
      <section className="border-b border-gray-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              Best electronics, now available to buy or rent
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight text-gray-900 md:text-5xl">Grab the latest gadgets without committing upfront.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 md:text-base">
              Rent premium devices for a few days or buy them outright from trusted
              sellers. Fast checkout, transparent deposits, and no hidden fees.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/browse" className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/browse" className="text-sm font-semibold text-gray-700 underline-offset-4 transition hover:text-blue-600 hover:underline">
                Learn More
              </Link>
            </div>
            <p className="mt-4 text-sm font-semibold text-blue-700">Starting at $49.00</p>
          </div>

          <div className="relative">
            <img
              src="https://picsum.photos/seed/hero-rentbuy/640/460"
              alt="Featured electronics"
              className="w-full rounded-2xl border border-white shadow-xl"
            />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white/95 px-3 py-2 text-xs font-medium text-emerald-700 shadow-sm">
              <Sparkles size={15} />
              <span>Weekend rental deals up to 25% OFF</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Our Top Categories</h2>
            <Link to="/browse" className="text-sm font-semibold text-blue-600 transition hover:text-blue-700">See all</Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" role="list">
            {categories.map((category) => (
              <Link
                to={`/browse?category=${encodeURIComponent(category.name)}`}
                className="rounded-xl border border-gray-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-md"
                key={category.id}
                role="listitem"
              >
                <img src={category.image} alt={category.name} className="h-14 w-14 rounded-lg object-cover" />
                <h3 className="mt-3 text-sm font-semibold text-gray-900">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.itemCount} Items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-3">
          {promoBanners.map((banner) => (
            <article
              className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br p-5 ${PROMO_BG_CLASS[banner.bgClass] || 'from-slate-100 to-white'}`}
              key={banner.id}
            >
              <span className="inline-flex rounded-full border border-white/80 bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-700">{banner.label}</span>
              <h3 className="mt-3 text-lg font-bold text-gray-900">{banner.title}</h3>
              <p className="mt-1 text-sm font-semibold text-blue-700">{banner.price}</p>
              <button type="button" className="mt-3 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700">
                {banner.action}
              </button>
              <img src={banner.image} alt={banner.title} className="pointer-events-none absolute -bottom-6 right-0 h-28 w-40 object-cover" />
            </article>
          ))}
        </div>
      </section>

      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Trending Products</h2>
            <div className="inline-flex flex-wrap gap-2" role="tablist" aria-label="Trending tabs">
              {TREND_TABS.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${activeTab === tab ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
