import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMarketplace } from '../context/MarketplaceContext'

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US')}`
}

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { checkoutDraft, placeOrder } = useMarketplace()

  const [paymentMethod, setPaymentMethod] = useState(location.state?.paymentMethod || 'COD')

  if (!checkoutDraft) {
    return (
      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Your checkout cart is empty.</h2>
          <p className="mt-2 text-sm text-gray-600">Select a product and choose Buy or Rent to continue.</p>
          <Link to="/browse" className="mt-4 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            Browse Products
          </Link>
        </div>
      </section>
    )
  }

  const handleConfirmOrder = () => {
    const response = placeOrder({ paymentMethod })

    if (response.ok) {
      navigate('/order-confirmation', { state: { order: response.order } })
    }
  }

  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-5 px-4 lg:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
          <div className="mt-4 flex items-center gap-4 rounded-lg border border-gray-200 p-3">
            <img src={checkoutDraft.image} alt={checkoutDraft.title} className="h-24 w-28 rounded-md object-cover" />
            <div>
              <h3 className="text-base font-semibold text-gray-900">{checkoutDraft.title}</h3>
              <p className="text-sm text-gray-600">Type: {checkoutDraft.type}</p>
              {checkoutDraft.type === 'SALE' ? (
                <p className="text-sm text-gray-700">Price: {formatCurrency(checkoutDraft.salePrice)}</p>
              ) : (
                <p className="text-sm text-gray-700">Total: {formatCurrency(checkoutDraft.total)}</p>
              )}
            </div>
          </div>

          {checkoutDraft.type === 'RENT' && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-base font-semibold text-gray-900">Rental Summary</h3>
              <p className="mt-2 flex items-center justify-between text-sm text-gray-700">
                <span>Days</span>
                <strong>{checkoutDraft.days}</strong>
              </p>
              <p className="mt-1 flex items-center justify-between text-sm text-gray-700">
                <span>Daily Rate</span>
                <strong>{formatCurrency(checkoutDraft.dailyRate)}</strong>
              </p>
              <p className="mt-1 flex items-center justify-between text-sm text-gray-700">
                <span>Deposit</span>
                <strong>{formatCurrency(checkoutDraft.deposit)}</strong>
              </p>
              <p className="mt-1 flex items-center justify-between text-sm font-semibold text-gray-900">
                <span>Total</span>
                <strong>{formatCurrency(checkoutDraft.total)}</strong>
              </p>
            </div>
          )}
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              className={`w-full rounded-lg border p-4 text-left transition ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
              onClick={() => setPaymentMethod('COD')}
            >
              <h3 className="text-base font-semibold text-gray-900">Cash on Delivery</h3>
              <p className="mt-1 text-sm text-gray-600">Pay once your item is delivered or picked up.</p>
            </button>

            <button
              type="button"
              className={`w-full rounded-lg border p-4 text-left transition ${paymentMethod === 'ONLINE' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
              onClick={() => setPaymentMethod('ONLINE')}
            >
              <h3 className="text-base font-semibold text-gray-900">Simulated Online</h3>
              <p className="mt-1 text-sm text-gray-600">Complete payment in a secure checkout simulation.</p>
            </button>
          </div>

          <button type="button" className="mt-4 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700" onClick={handleConfirmOrder}>
            Confirm Order
          </button>
        </article>
      </div>
    </section>
  )
}
