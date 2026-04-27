import { Home, LayoutGrid, ShoppingCart, LayoutDashboard, LogIn } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useMarketplace } from '../context/MarketplaceContext'

const DASHBOARD_PATH = {
  customer: '/dashboard/customer',
  seller: '/dashboard/seller',
  admin: '/dashboard/admin',
}

export default function MobileBottomNav() {
  const { role, authToken, cartCount } = useMarketplace()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-gray-200 bg-white p-2 lg:hidden" aria-label="Mobile bottom navigation">
      <NavLink to="/" className="flex flex-col items-center gap-1 rounded-md py-1 text-[11px] text-gray-600 [&.active]:text-blue-600">
        <Home size={18} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/browse" className="flex flex-col items-center gap-1 rounded-md py-1 text-[11px] text-gray-600 [&.active]:text-blue-600">
        <LayoutGrid size={18} />
        <span>Browse</span>
      </NavLink>
      <NavLink to="/checkout" className="flex flex-col items-center gap-1 rounded-md py-1 text-[11px] text-gray-600 [&.active]:text-blue-600">
        <ShoppingCart size={18} />
        <span>Cart ({cartCount})</span>
      </NavLink>
      <NavLink
        to={authToken ? DASHBOARD_PATH[role] || '/' : '/login'}
        className="flex flex-col items-center gap-1 rounded-md py-1 text-[11px] text-gray-600 [&.active]:text-blue-600"
      >
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to={authToken ? '/' : '/login'} className="flex flex-col items-center gap-1 rounded-md py-1 text-[11px] text-gray-600 [&.active]:text-blue-600">
        <LogIn size={18} />
        <span>{authToken ? 'Account' : 'Login'}</span>
      </NavLink>
    </nav>
  )
}
