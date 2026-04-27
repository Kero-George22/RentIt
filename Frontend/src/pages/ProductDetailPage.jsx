import { useMemo, useState } from 'react'
import { Heart, MessageCircle } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MessageForm from '../components/MessageForm'
import RentalCalculator from '../components/RentalCalculator'
import { useMarketplace } from '../context/MarketplaceContext'

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US')}`
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    products,
    toggleWishlist,
    wishlist,
    prepareCheckout,
    currentUser,
    sendMessage,
  } = useMarketplace()

  const product = products.find((entry) => entry.id === id)

  const [activeImage, setActiveImage] = useState(product?.gallery[0] || '')
  const [activeTab, setActiveTab] = useState('description')
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [showMessageForm, setShowMessageForm] = useState(false)
  const [rentalPricing, setRentalPricing] = useState({ days: 1, baseFee: 0, total: 0 })

  const canBuy = product?.availability === 'SALE' || product?.availability === 'BOTH'
  const canRent = product?.availability === 'RENT' || product?.availability === 'BOTH'

  const isWishlisted = useMemo(() => wishlist.includes(id), [wishlist, id])

  if (!product) {
    return (
      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <p className="mt-2 text-sm text-gray-600">The item you are looking for is unavailable.</p>
          <Link to="/browse" className="mt-4 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            Back to Browse
          </Link>
        </div>
      </section>
    )
  }

  const handleBuyNow = () => {
    prepareCheckout({ productId: product.id, type: 'SALE', days: 1 })
    navigate('/checkout', { state: { paymentMethod } })
  }

  const handleRentNow = () => {
    prepareCheckout({
      productId: product.id,
      type: 'RENT',
      days: rentalPricing.days || 1,
    })

    navigate('/checkout', { state: { paymentMethod } })
  }

  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <img src={activeImage} alt={product.title} className="h-[360px] w-full rounded-lg object-cover" />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {product.gallery.map((imageUrl) => (
              <button
                type="button"
                key={imageUrl}
                onClick={() => setActiveImage(imageUrl)}
                className={`overflow-hidden rounded-md border transition ${activeImage === imageUrl ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <img src={imageUrl} alt={`${product.title} thumbnail`} className="h-16 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{product.category}</p>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{product.title}</h1>
          <p className="text-sm text-gray-600">Seller: {product.seller}</p>

          {canBuy && <p className="text-xl font-extrabold text-gray-900">Sale Price: {formatCurrency(product.salePrice)}</p>}

          {canRent && (
            <div className="space-y-2 rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-700">
                Rental: <strong>${product.rentalPricePerDay}/day</strong>
              </p>
              <p className="text-sm text-gray-700">
                Deposit: <strong>{formatCurrency(product.deposit)}</strong>
              </p>
              <RentalCalculator
                dailyRate={product.rentalPricePerDay}
                deposit={product.deposit}
                onChange={setRentalPricing}
              />
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Payment Method</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setPaymentMethod('COD')}
              >
                Cash on Delivery
              </button>
              <button
                type="button"
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${paymentMethod === 'ONLINE' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setPaymentMethod('ONLINE')}
              >
                Simulated Online
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {canBuy && (
              <button type="button" className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700" onClick={handleBuyNow}>
                Buy Now
              </button>
            )}
            {canRent && (
              <button type="button" className="inline-flex items-center justify-center rounded-md border border-purple-300 bg-purple-100 px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-50" onClick={handleRentNow}>
                Rent Now
              </button>
            )}
            <button
              type="button"
              className={`inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition ${isWishlisted ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'}`}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
              Wishlist
            </button>
          </div>

          <button
            type="button"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            onClick={() => setShowMessageForm((prev) => !prev)}
          >
            <MessageCircle size={16} /> Contact Seller
          </button>

          {showMessageForm && (
            <MessageForm
              submitLabel="Send to Seller"
              onSend={(form) => {
                sendMessage({
                  subject: form.subject,
                  body: form.body,
                  productTitle: product.title,
                  recipientRole: 'seller',
                  sender: currentUser.name,
                })
                setShowMessageForm(false)
              }}
            />
          )}

          <div className="rounded-lg border border-gray-200 p-3">
            <div className="mb-3 inline-flex gap-2">
              <button
                type="button"
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${activeTab === 'description' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                type="button"
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${activeTab === 'shipping' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping
              </button>
            </div>
            {activeTab === 'description' ? (
              <p className="text-sm leading-6 text-gray-600">{product.description}</p>
            ) : (
              <p className="text-sm leading-6 text-gray-600">
                Ships within 24 hours. Rental items require ID verification and refundable
                deposit release after inspection.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
