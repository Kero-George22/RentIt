import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="text-lg font-semibold text-white">RentBuy Marketplace</h4>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Buy and rent electronics with confidence. Trusted sellers, secure checkout,
            and transparent rental fees.
          </p>
        </div>

        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Company</h5>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/" className="transition hover:text-white">About Us</Link>
            </li>
            <li>
              <Link to="/browse" className="transition hover:text-white">Our Store</Link>
            </li>
            <li>
              <Link to="/browse" className="transition hover:text-white">Careers</Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Support</h5>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/browse" className="transition hover:text-white">Shipping</Link>
            </li>
            <li>
              <Link to="/browse" className="transition hover:text-white">Returns</Link>
            </li>
            <li>
              <Link to="/browse" className="transition hover:text-white">Help Center</Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Quick Links</h5>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/dashboard/customer" className="transition hover:text-white">My Orders</Link>
            </li>
            <li>
              <Link to="/dashboard/seller" className="transition hover:text-white">Seller Desk</Link>
            </li>
            <li>
              <Link to="/dashboard/admin" className="transition hover:text-white">Admin Panel</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        <p>© 2026 RentBuy Marketplace. All rights reserved.</p>
      </div>
    </footer>
  )
}
