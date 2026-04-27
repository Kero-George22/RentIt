import {
  Globe,
  Search,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  UserCircle2,
  Scale,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useMarketplace } from '../context/MarketplaceContext'

const DASHBOARD_PATH = {
  customer: '/dashboard/customer',
  seller: '/dashboard/seller',
  admin: '/dashboard/admin',
}

export default function SiteHeader() {
  const navigate = useNavigate()
  const {
    role,
    currentUser,
    cartCount,
    searchSuggestions,
    switchRole,
    logout,
    authToken,
  } = useMarketplace()

  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const suggestions = useMemo(() => searchSuggestions(query), [query, searchSuggestions])

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Our Store', to: '/browse' },
    { label: 'Browse', to: '/browse', hasDropdown: true },
    { label: 'Blogs', to: '/browse', hasDropdown: true },
  ]

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    if (!query.trim()) {
      return
    }

    navigate(`/browse?q=${encodeURIComponent(query.trim())}`)
    setShowSuggestions(false)
    setMenuOpen(false)
  }

  const handleSuggestionSelect = (productId) => {
    navigate(`/product/${productId}`)
    setShowSuggestions(false)
    setQuery('')
    setMenuOpen(false)
  }

  const dashboardLink = DASHBOARD_PATH[role]

  return (
    <header className="relative z-[25]">
      <div className="bg-slate-900 text-white text-xs py-2">
        <div className="mx-auto max-w-6xl px-4 flex items-center gap-3.5 justify-between">
          <div className="flex items-center gap-3.5">
            <span>
              <Globe size={14} /> EN
            </span>
            <span>Free shipping on orders above $100</span>
          </div>
          <div className="flex items-center gap-3.5">
            <span>My Account</span>
            <span>
              <Scale size={14} /> Compare
            </span>
            <span className="bg-white/14 rounded-full px-2 py-1">
              <ShoppingCart size={14} /> Cart ({cartCount})
            </span>
            <select
              className="w-auto min-w-[120px] rounded-md border border-white/30 bg-white/10 px-2 py-1 text-xs text-white"
              value={role}
              onChange={(event) => switchRole(event.target.value)}
              aria-label="Switch role"
            >
              <option value="guest">Guest</option>
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      <div className="sticky top-0 bg-white/96 border-b border-gray-200 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 min-h-[76px] grid grid-cols-[auto_1fr_auto_auto] items-center gap-5">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight">
            <span className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 text-white grid place-items-center">R</span> RentBuy
          </Link>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav
            className={`col-span-4 mt-3 hidden flex-col gap-2 border-t border-gray-200 pt-3 lg:col-span-1 lg:mt-0 lg:flex lg:flex-row lg:items-center lg:justify-center lg:gap-4 lg:border-t-0 lg:pt-0 ${menuOpen ? 'flex' : ''}`}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) => `bg-transparent text-gray-900 font-medium px-2 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer ${isActive ? 'text-blue-600' : 'hover:bg-gray-50'}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown size={14} />}
              </NavLink>
            ))}

            {dashboardLink && authToken && (
              <NavLink
                to={dashboardLink}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `bg-transparent text-gray-900 font-medium px-2 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer ${isActive ? 'text-blue-600' : 'hover:bg-gray-50'}`}
              >
                Dashboard
              </NavLink>
            )}

            {!authToken ? (
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `bg-transparent text-gray-900 font-medium px-2 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer ${isActive ? 'text-blue-600' : 'hover:bg-gray-50'}`}
              >
                Login
              </NavLink>
            ) : (
              <button
                type="button"
                className="bg-transparent text-gray-900 font-medium px-2 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  logout()
                  setMenuOpen(false)
                }}
              >
                Logout
              </button>
            )}
          </nav>

          <form className="relative flex items-center w-full max-w-[340px]" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                window.setTimeout(() => setShowSuggestions(false), 120)
              }}
              placeholder="Search products"
              aria-label="Search products"
              className="pr-11"
            />
            <button type="submit" className="w-9 h-9 rounded-lg grid place-items-center absolute right-1 bg-blue-600 text-white cursor-pointer" aria-label="Search">
              <Search size={16} />
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-[calc(100%+7px)] z-10 m-0 list-none rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                {suggestions.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      className="w-full rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => handleSuggestionSelect(product.id)}
                    >
                      {product.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-2.5 py-1.5 text-xs text-gray-500">
            <UserCircle2 size={18} />
            <span>{currentUser.role}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
