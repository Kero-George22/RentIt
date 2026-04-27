import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar'
import StatusBadge from '../components/StatusBadge'
import { useMarketplace } from '../context/MarketplaceContext'

const TABS = [
  { label: 'My Orders', value: 'orders' },
  { label: 'Wishlist', value: 'wishlist' },
  { label: 'Inbox', value: 'inbox' },
]

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US')}`
}

export default function CustomerDashboardPage() {
  const { role, currentUser, orders, wishlist, products, messages, removeWishlistItem } =
    useMarketplace()
  const [activeTab, setActiveTab] = useState('orders')
  const [activeMessage, setActiveMessage] = useState(null)

  const myOrders = useMemo(
    () => orders.filter((order) => order.customerEmail === currentUser.email),
    [orders, currentUser.email],
  )

  const wishlistProducts = useMemo(
    () => products.filter((product) => wishlist.includes(product.id)),
    [products, wishlist],
  )

  const inboxMessages = useMemo(
    () => messages.filter((message) => message.recipientRole === 'customer'),
    [messages],
  )

  if (role !== 'customer') {
    return (
      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Customer dashboard access only</h2>
          <p className="mt-2 text-sm text-gray-600">Switch role to Customer from the top bar to view this page.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[240px_1fr]">
        <DashboardSidebar
          title="Customer Dashboard"
          items={TABS}
          active={activeTab}
          onSelect={setActiveTab}
        />

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {activeTab === 'orders' && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-3 py-2">Order ID</th>
                    <th className="px-3 py-2">Product</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Total</th>
                    <th className="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myOrders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-3 py-4 text-center text-sm text-gray-500">No orders yet.</td>
                    </tr>
                  )}
                  {myOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-3 py-2">{order.id}</td>
                      <td className="px-3 py-2">{order.productTitle}</td>
                      <td className="px-3 py-2">{order.type}</td>
                      <td className="px-3 py-2">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-3 py-2">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-3 py-2">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="grid gap-3 sm:grid-cols-2">
              {wishlistProducts.length === 0 && <p className="text-sm text-gray-500">Wishlist is empty.</p>}

              {wishlistProducts.map((product) => (
                <article className="rounded-lg border border-gray-200 p-3" key={product.id}>
                  <img src={product.image} alt={product.title} className="h-28 w-full rounded-md object-cover" />
                  <div>
                    <h3 className="mt-2 text-base font-semibold text-gray-900">{product.title}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 transition hover:bg-gray-50"
                      onClick={() => removeWishlistItem(product.id)}
                    >
                      Remove
                    </button>
                    <Link to={`/product/${product.id}`} className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700">
                      Go to Product
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
              <div className="space-y-2">
                {inboxMessages.length === 0 && <p className="text-sm text-gray-500">No messages.</p>}
                {inboxMessages.map((message) => (
                  <button
                    type="button"
                    key={message.id}
                    className={`w-full rounded-lg border p-3 text-left transition ${activeMessage?.id === message.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                    onClick={() => setActiveMessage(message)}
                  >
                    <strong className="block text-sm text-gray-900">{message.sender}</strong>
                    <span className="mt-1 block text-sm text-gray-700">{message.subject}</span>
                    <small className="mt-1 block text-xs text-gray-500">{message.productTitle}</small>
                    <small className="mt-1 block text-xs text-gray-500">{message.date}</small>
                  </button>
                ))}
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4">
                {!activeMessage ? (
                  <p className="text-sm text-gray-500">Select a message to read.</p>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">{activeMessage.subject}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      From {activeMessage.sender} about {activeMessage.productTitle}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-gray-700">{activeMessage.body}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
