import { Heart, ShoppingCart, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMarketplace } from '../context/MarketplaceContext'

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US')}`
}

export default function ProductCard({
  product,
  onBuy,
  onRent,
  showActions = true,
  showGoToProduct = false,
}) {
  const { wishlist, toggleWishlist, addToCart } = useMarketplace()
  const isWishlisted = wishlist.includes(product.id)
  const canBuy = product.availability === 'SALE' || product.availability === 'BOTH'
  const canRent = product.availability === 'RENT' || product.availability === 'BOTH'

  const handleBuy = () => {
    addToCart({ productId: product.id, type: 'SALE' })

    if (onBuy) {
      onBuy(product)
    }
  }

  const handleRent = () => {
    addToCart({ productId: product.id, type: 'RENT', days: 1 })

    if (onRent) {
      onRent(product)
    }
  }

  return (
    <article className="relative rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <button
        type="button"
        className={`absolute right-2.5 top-2.5 w-8 h-8 rounded-full border bg-white text-gray-500 grid place-items-center cursor-pointer ${isWishlisted ? 'text-red-600 border-red-300' : 'border-gray-200'}`}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={() => toggleWishlist(product.id)}
      >
        <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      <Link to={`/product/${product.id}`} className="mb-2.5 block">
        <img src={product.image} alt={product.title} className="w-full h-[180px] object-cover rounded-lg" loading="lazy" />
      </Link>

      <div className="flex gap-1.5 flex-wrap mb-2">
        {product.badges.map((badge) => (
          <span
            key={`${product.id}-${badge}`}
            className={`inline-flex rounded px-2 py-1 text-xs font-bold ${badge === 'RENT AVAILABLE' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}
          >
            {badge}
          </span>
        ))}
      </div>

      <h3 className="text-sm mb-1">
        <Link to={`/product/${product.id}`} className="hover:text-blue-600">
          {product.title}
        </Link>
      </h3>
      <p className="text-xs text-gray-500">{product.category}</p>

      <div className="mt-2.5 flex flex-col gap-1">
        {canBuy && <span className="text-lg font-extrabold">{formatCurrency(product.salePrice)}</span>}
        {canRent && <span className="text-xs text-purple-600">Rent ${product.rentalPricePerDay}/day</span>}
      </div>

      {showActions && (
        <div className="mt-3 flex flex-wrap gap-2">
          {canBuy && (
            <button type="button" className="inline-flex min-w-[124px] flex-1 items-center justify-center gap-2 rounded-lg border border-transparent bg-blue-600 px-3.5 py-2.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700" onClick={handleBuy}>
              <ShoppingCart size={16} /> Add to Cart
            </button>
          )}
          {canRent && (
            <button type="button" className="inline-flex min-w-[124px] flex-1 items-center justify-center gap-2 rounded-lg border border-purple-300 bg-purple-100 px-3.5 py-2.5 font-semibold text-purple-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-purple-50" onClick={handleRent}>
              <CalendarDays size={16} /> Rent
            </button>
          )}
          {showGoToProduct && (
            <Link to={`/product/${product.id}`} className="inline-flex min-w-[124px] flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 font-semibold text-gray-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50">
              Go to Product
            </Link>
          )}
        </div>
      )}
    </article>
  )
}
