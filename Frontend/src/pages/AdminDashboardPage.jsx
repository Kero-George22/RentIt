import { useMemo, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import DashboardSidebar from '../components/DashboardSidebar'
import { useMarketplace } from '../context/MarketplaceContext'

const TABS = [
  { label: 'Users', value: 'users' },
  { label: 'Products', value: 'products' },
  { label: 'Stats', value: 'stats' },
]

const PAGE_SIZE = 8

export default function AdminDashboardPage() {
  const {
    role,
    users,
    products,
    orders,
    suspendUser,
    deleteUser,
    removeProduct,
  } = useMarketplace()

  const [activeTab, setActiveTab] = useState('stats')
  const [userSearch, setUserSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dialogState, setDialogState] = useState({ open: false, productId: '' })

  const filteredUsers = useMemo(() => {
    const query = userSearch.toLowerCase()
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query),
    )
  }, [users, userSearch])

  const filteredProducts = useMemo(() => {
    const query = productSearch.toLowerCase()
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.seller.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query),
    )
  }, [products, productSearch])

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const pagedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = [
    { label: 'Total Users', value: users.length },
    { label: 'Total Products', value: products.length },
    { label: 'Total Orders', value: orders.length },
    {
      label: 'Active Rentals',
      value: orders.filter((order) => order.type === 'RENT' && order.status !== 'Completed')
        .length,
    },
  ]

  if (role !== 'admin') {
    return (
      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Admin dashboard access only</h2>
          <p className="mt-2 text-sm text-gray-600">Switch role to Admin from the top bar to view this page.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[240px_1fr]">
        <DashboardSidebar
          title="Admin Dashboard"
          items={TABS}
          active={activeTab}
          onSelect={setActiveTab}
        />

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {activeTab === 'stats' && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <article className="rounded-lg border border-gray-200 bg-gray-50 p-4" key={item.label}>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                  <h3 className="mt-2 text-2xl font-bold text-gray-900">{item.value}</h3>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900">Users</h2>
                <input
                  className="w-full max-w-xs rounded-md border border-gray-200 px-3 py-2"
                  type="search"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                  placeholder="Search users"
                />
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Role</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-3 py-2">{user.name}</td>
                        <td className="px-3 py-2">{user.email}</td>
                        <td>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === 'Admin' ? 'bg-violet-100 text-violet-700' : user.role === 'Seller' ? 'bg-cyan-100 text-cyan-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-3 py-2">{user.status}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 transition hover:bg-gray-50"
                              onClick={() => suspendUser(user.id)}
                            >
                              {user.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center justify-center rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                              onClick={() => deleteUser(user.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'products' && (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                <input
                  className="w-full max-w-xs rounded-md border border-gray-200 px-3 py-2"
                  type="search"
                  value={productSearch}
                  onChange={(event) => setProductSearch(event.target.value)}
                  placeholder="Search products"
                />
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-3 py-2">Title</th>
                      <th className="px-3 py-2">Seller</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pagedProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-3 py-2">{product.title}</td>
                        <td className="px-3 py-2">{product.seller}</td>
                        <td className="px-3 py-2">{product.category}</td>
                        <td className="px-3 py-2">{product.isActive ? 'Active' : 'Paused'}</td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                            onClick={() => setDialogState({ open: true, productId: product.id })}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
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
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={dialogState.open}
        title="Remove product?"
        message="This will reject all pending orders."
        confirmLabel="Remove product"
        onCancel={() => setDialogState({ open: false, productId: '' })}
        onConfirm={() => {
          removeProduct(dialogState.productId)
          setDialogState({ open: false, productId: '' })
        }}
      />
    </section>
  )
}
