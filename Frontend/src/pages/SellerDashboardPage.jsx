import { useMemo, useState } from 'react'
import DashboardSidebar from '../components/DashboardSidebar'
import MessageForm from '../components/MessageForm'
import StatusBadge from '../components/StatusBadge'
import { useMarketplace } from '../context/MarketplaceContext'
import { categories } from '../data/mockData'

const TABS = [
  { label: 'My Products', value: 'products' },
  { label: 'Orders', value: 'orders' },
  { label: 'Inbox', value: 'inbox' },
]

const EMPTY_PRODUCT_FORM = {
  title: '',
  description: '',
  category: 'SmartTV',
  salePrice: '',
  rentalPricePerDay: '',
  deposit: '',
  lateFeePerDay: '',
  availability: 'BOTH',
  previewImage: '',
}

function displayPrice(product) {
  if (product.availability === 'SALE') {
    return `$${product.salePrice}`
  }

  if (product.availability === 'RENT') {
    return `$${product.rentalPricePerDay}/day`
  }

  return `$${product.salePrice} | $${product.rentalPricePerDay}/day`
}

export default function SellerDashboardPage() {
  const {
    role,
    currentUser,
    products,
    orders,
    messages,
    addProduct,
    toggleProductStatus,
    updateOrderStatus,
    sendMessage,
  } = useMarketplace()

  const [activeTab, setActiveTab] = useState('products')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM)

  const sellerProducts = useMemo(() => {
    const ownProducts = products.filter((product) => product.seller === currentUser.name)
    return ownProducts.length > 0 ? ownProducts : products.slice(0, 8)
  }, [products, currentUser.name])

  const incomingOrders = useMemo(() => {
    const ownOrders = orders.filter((order) => order.sellerName === currentUser.name)
    return ownOrders.length > 0 ? ownOrders : orders
  }, [orders, currentUser.name])

  const sellerInbox = useMemo(
    () => messages.filter((message) => message.recipientRole === 'seller'),
    [messages],
  )

  if (role !== 'seller') {
    return (
      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Seller dashboard access only</h2>
          <p className="mt-2 text-sm text-gray-600">Switch role to Seller from the top bar to view this page.</p>
        </div>
      </section>
    )
  }

  const handleAddProduct = (event) => {
    event.preventDefault()
    addProduct(productForm)
    setProductForm(EMPTY_PRODUCT_FORM)
    setShowAddForm(false)
  }

  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[240px_1fr]">
        <DashboardSidebar
          title="Seller Dashboard"
          items={TABS}
          active={activeTab}
          onSelect={setActiveTab}
        />

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {activeTab === 'products' && (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900">My Products</h2>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  onClick={() => setShowAddForm((prev) => !prev)}
                >
                  Add New Product
                </button>
              </div>

              {showAddForm && (
                <form className="mb-4 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4" onSubmit={handleAddProduct}>
                  <h3 className="text-lg font-semibold text-gray-900">Add Product</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label>
                      <span className="mb-1 block text-sm font-medium text-gray-700">Title</span>
                      <input
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2"
                        type="text"
                        required
                        value={productForm.title}
                        onChange={(event) =>
                          setProductForm((prev) => ({ ...prev, title: event.target.value }))
                        }
                      />
                    </label>
                    <label>
                      <span className="mb-1 block text-sm font-medium text-gray-700">Category</span>
                      <select
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2"
                        value={productForm.category}
                        onChange={(event) =>
                          setProductForm((prev) => ({ ...prev, category: event.target.value }))
                        }
                      >
                        {categories.map((category) => (
                          <option key={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="sm:col-span-2">
                      <span className="mb-1 block text-sm font-medium text-gray-700">Description</span>
                      <textarea
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2"
                        rows="3"
                        required
                        value={productForm.description}
                        onChange={(event) =>
                          setProductForm((prev) => ({
                            ...prev,
                            description: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span className="mb-1 block text-sm font-medium text-gray-700">Availability</span>
                      <select
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2"
                        value={productForm.availability}
                        onChange={(event) =>
                          setProductForm((prev) => ({
                            ...prev,
                            availability: event.target.value,
                          }))
                        }
                      >
                        <option value="SALE">Sale</option>
                        <option value="RENT">Rent</option>
                        <option value="BOTH">Both</option>
                      </select>
                    </label>
                    <label>
                      <span className="mb-1 block text-sm font-medium text-gray-700">Sale Price</span>
                      <input
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2"
                        type="number"
                        min="0"
                        value={productForm.salePrice}
                        onChange={(event) =>
                          setProductForm((prev) => ({ ...prev, salePrice: event.target.value }))
                        }
                      />
                    </label>
                    <label>
                      <span className="mb-1 block text-sm font-medium text-gray-700">Rental Price/Day</span>
                      <input
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2"
                        type="number"
                        min="0"
                        value={productForm.rentalPricePerDay}
                        onChange={(event) =>
                          setProductForm((prev) => ({
                            ...prev,
                            rentalPricePerDay: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span className="mb-1 block text-sm font-medium text-gray-700">Deposit</span>
                      <input
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2"
                        type="number"
                        min="0"
                        value={productForm.deposit}
                        onChange={(event) =>
                          setProductForm((prev) => ({ ...prev, deposit: event.target.value }))
                        }
                      />
                    </label>
                    <label>
                      <span className="mb-1 block text-sm font-medium text-gray-700">Late Fee/Day</span>
                      <input
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2"
                        type="number"
                        min="0"
                        value={productForm.lateFeePerDay}
                        onChange={(event) =>
                          setProductForm((prev) => ({
                            ...prev,
                            lateFeePerDay: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="sm:col-span-2">
                      <span className="mb-1 block text-sm font-medium text-gray-700">Images Upload</span>
                      <input
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (!file) {
                            return
                          }

                          const previewImage = URL.createObjectURL(file)
                          setProductForm((prev) => ({ ...prev, previewImage }))
                        }}
                      />
                    </label>
                  </div>

                  <button type="submit" className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                    Save Product
                  </button>
                </form>
              )}

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-3 py-2">Title</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Availability</th>
                      <th className="px-3 py-2">Price</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sellerProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-3 py-2">{product.title}</td>
                        <td className="px-3 py-2">{product.category}</td>
                        <td className="px-3 py-2">{product.availability}</td>
                        <td className="px-3 py-2">{displayPrice(product)}</td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.isActive ? 'border border-emerald-300 bg-emerald-100 text-emerald-700' : 'border border-gray-300 bg-gray-100 text-gray-600'}`}
                            onClick={() => toggleProductStatus(product.id)}
                          >
                            {product.isActive ? 'Active' : 'Paused'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3">
              {incomingOrders.map((order) => (
                <article key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 p-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{order.productTitle}</h3>
                    <p className="text-sm text-gray-600">
                      {order.customerName} • {order.type} • ${order.totalAmount}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                  <div className="flex gap-2">
                    {order.status === 'Pending' && (
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                          onClick={() => updateOrderStatus(order.id, 'Approved')}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                          onClick={() => updateOrderStatus(order.id, 'Rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {order.status === 'Approved' && (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 transition hover:bg-gray-50"
                        onClick={() => updateOrderStatus(order.id, 'Completed')}
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
              <div className="space-y-2">
                {sellerInbox.map((message) => (
                  <button
                    type="button"
                    key={message.id}
                    className={`w-full rounded-lg border p-3 text-left transition ${selectedMessage?.id === message.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <strong className="block text-sm text-gray-900">{message.sender}</strong>
                    <span className="mt-1 block text-sm text-gray-700">{message.subject}</span>
                    <small className="mt-1 block text-xs text-gray-500">{message.productTitle}</small>
                    <small className="mt-1 block text-xs text-gray-500">{message.date}</small>
                  </button>
                ))}
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4">
                {!selectedMessage ? (
                  <p className="text-sm text-gray-500">Select a message to read and reply.</p>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedMessage.subject}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-700">{selectedMessage.body}</p>
                    <MessageForm
                      submitLabel="Reply"
                      onSend={(form) => {
                        sendMessage({
                          subject: `RE: ${selectedMessage.subject}`,
                          body: form.body,
                          productTitle: selectedMessage.productTitle,
                          recipientRole: 'customer',
                          sender: currentUser.name,
                        })
                      }}
                    />
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
