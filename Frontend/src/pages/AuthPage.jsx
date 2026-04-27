import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMarketplace } from '../context/MarketplaceContext'

const DASHBOARD_PATH = {
  customer: '/dashboard/customer',
  seller: '/dashboard/seller',
  admin: '/dashboard/admin',
}

export default function AuthPage() {
  const navigate = useNavigate()
  const { login, register } = useMarketplace()

  const [mode, setMode] = useState('login')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    selectedRole: 'Customer',
  })
  const [errors, setErrors] = useState({})

  const handleLoginSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!loginForm.email.trim()) {
      nextErrors.loginEmail = 'Email is required.'
    }

    if (!loginForm.password.trim()) {
      nextErrors.loginPassword = 'Password is required.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const response = login(loginForm)

    if (!response.ok) {
      setErrors({ loginGlobal: response.error })
      return
    }

    setErrors({})
    navigate(DASHBOARD_PATH[response.role] || '/')
  }

  const handleRegisterSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!registerForm.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    }

    if (!registerForm.email.trim()) {
      nextErrors.registerEmail = 'Email is required.'
    }

    if ((registerForm.password || '').length < 6) {
      nextErrors.registerPassword = 'Password must be at least 6 characters.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const response = register(registerForm)

    if (!response.ok) {
      setErrors({ registerGlobal: response.error })
      return
    }

    setErrors({})
    navigate(DASHBOARD_PATH[response.role] || '/')
  }

  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-xl bg-slate-950 p-6 text-slate-200">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">RentBuy Marketplace</span>
          <h1 className="mt-4 text-3xl font-black leading-tight text-white">Buy or rent your next device in minutes.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Join as a customer to place orders, or as a seller to list products and manage
            rental requests.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>Transparent rental calculator</li>
            <li>Order tracking with live statuses</li>
            <li>Seller and admin dashboards</li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <div className="mb-4 inline-flex gap-2">
            <button
              type="button"
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${mode === 'login' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => {
                setMode('login')
                setErrors({})
              }}
            >
              Login
            </button>
            <button
              type="button"
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${mode === 'register' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => {
                setMode('register')
                setErrors({})
              }}
            >
              Register
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-2">
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2"
                id="login-email"
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="customer@rentbuy.com"
              />
              {errors.loginEmail && <p className="text-sm text-red-600">{errors.loginEmail}</p>}

              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2"
                id="login-password"
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="••••••••"
              />
              {errors.loginPassword && <p className="text-sm text-red-600">{errors.loginPassword}</p>}
              {errors.loginGlobal && <p className="text-sm text-red-600">{errors.loginGlobal}</p>}

              <button type="submit" className="mt-2 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                Login with JWT
              </button>

              <p className="pt-1 text-xs text-gray-500">Use emails containing "seller" or "admin" to test role-based UI.</p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-2">
              <label htmlFor="register-fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2"
                id="register-fullname"
                type="text"
                value={registerForm.fullName}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, fullName: event.target.value }))
                }
                placeholder="Your name"
              />
              {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}

              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2"
                id="register-email"
                type="email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="you@example.com"
              />
              {errors.registerEmail && <p className="text-sm text-red-600">{errors.registerEmail}</p>}

              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2"
                id="register-password"
                type="password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="Minimum 6 characters"
              />
              {errors.registerPassword && (
                <p className="text-sm text-red-600">{errors.registerPassword}</p>
              )}

              <label htmlFor="register-role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                className="w-full rounded-md border border-gray-200 px-3 py-2"
                id="register-role"
                value={registerForm.selectedRole}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, selectedRole: event.target.value }))
                }
              >
                <option>Customer</option>
                <option>Seller</option>
              </select>

              {errors.registerGlobal && <p className="text-sm text-red-600">{errors.registerGlobal}</p>}

              <button type="submit" className="mt-2 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
