import { CheckCircle2 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US')}`
}

export default function OrderConfirmationPage() {
  const location = useLocation()
  const order = location.state?.order

  if (!order) {
    return (
      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">No recent order found.</h2>
          <Link to="/browse" className="mt-4 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto max-w-3xl rounded-xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 size={42} />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Order Placed!</h1>
        <p className="mt-2 text-sm text-gray-600">Your order has been received successfully.</p>

        <div className="mt-5 grid gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left">
          <p className="flex items-center justify-between text-sm text-gray-700">
            <span>Order ID</span>
            <strong>{order.id}</strong>
          </p>
          <p className="flex items-center justify-between text-sm text-gray-700">
            <span>Product</span>
            <strong>{order.productTitle}</strong>
          </p>
          <p className="flex items-center justify-between text-sm text-gray-700">
            <span>Type</span>
            <strong>{order.type}</strong>
          </p>
          <p className="flex items-center justify-between text-sm text-gray-700">
            <span>Total</span>
            <strong>{formatCurrency(order.totalAmount)}</strong>
          </p>
          <p className="flex items-center justify-between text-sm text-gray-700">
            <span>Estimated Handling</span>
            <strong>1-2 business days</strong>
          </p>
        </div>

        <Link to="/dashboard/customer" className="mt-5 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
          Go to My Orders
        </Link>
      </div>
    </section>
  )
}
