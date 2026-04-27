/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import {
  initialMessages,
  initialOrders,
  initialUsers,
  products as mockProducts,
} from '../data/mockData'

const MarketplaceContext = createContext(null)

const ROLE_DEFAULTS = {
  guest: {
    name: 'Guest',
    email: 'guest@rentbuy.com',
    role: 'Guest',
  },
  customer: {
    name: 'Ava Patel',
    email: 'customer@rentbuy.com',
    role: 'Customer',
  },
  seller: {
    name: 'Noah Rivera',
    email: 'seller@rentbuy.com',
    role: 'Seller',
  },
  admin: {
    name: 'Maya Nguyen',
    email: 'admin@rentbuy.com',
    role: 'Admin',
  },
}

function inferRoleFromEmail(email) {
  const lowerEmail = email.toLowerCase()

  if (lowerEmail.includes('admin')) {
    return 'admin'
  }

  if (lowerEmail.includes('seller')) {
    return 'seller'
  }

  return 'customer'
}

function buildOrderFromCheckout(checkoutDraft, paymentMethod, customer) {
  return {
    id: `RB-${Math.floor(10000 + Math.random() * 89999)}`,
    customerName: customer.name,
    customerEmail: customer.email,
    sellerName: checkoutDraft.seller,
    productId: checkoutDraft.productId,
    productTitle: checkoutDraft.title,
    type: checkoutDraft.type,
    status: 'Pending',
    totalAmount: checkoutDraft.total,
    date: new Date().toISOString().slice(0, 10),
    paymentMethod,
  }
}

export function MarketplaceProvider({ children }) {
  const [role, setRole] = useState('customer')
  const [currentUser, setCurrentUser] = useState(ROLE_DEFAULTS.customer)
  const [authToken, setAuthToken] = useState('demo-jwt-token-customer')
  const [products, setProducts] = useState(
    mockProducts.map((product) => ({ ...product, isActive: true })),
  )
  const [wishlist, setWishlist] = useState(['p4', 'p8'])
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState(initialOrders)
  const [messages, setMessages] = useState(initialMessages)
  const [users, setUsers] = useState(initialUsers)
  const [checkoutDraft, setCheckoutDraft] = useState(null)

  const cartCount = cart.length

  const login = ({ email, password }) => {
    if (!email.trim()) {
      return { ok: false, error: 'Email is required.' }
    }

    if (!password || password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' }
    }

    const nextRole = inferRoleFromEmail(email)
    const guessedName = email.split('@')[0].replace(/[._-]/g, ' ')

    setRole(nextRole)
    setCurrentUser({
      name: guessedName
        .split(' ')
        .filter(Boolean)
        .map((chunk) => chunk[0].toUpperCase() + chunk.slice(1))
        .join(' '),
      email,
      role: ROLE_DEFAULTS[nextRole].role,
    })
    setAuthToken(`jwt-${Date.now()}-${btoa(email).slice(0, 8)}`)

    return { ok: true, role: nextRole }
  }

  const register = ({ fullName, email, password, selectedRole }) => {
    if (!fullName.trim()) {
      return { ok: false, error: 'Full Name is required.' }
    }

    if (!email.includes('@')) {
      return { ok: false, error: 'A valid email address is required.' }
    }

    if (!password || password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' }
    }

    const nextRole = selectedRole.toLowerCase()

    setUsers((prev) => [
      {
        id: `u${prev.length + 1}`,
        name: fullName,
        email,
        role: selectedRole,
        status: 'Active',
      },
      ...prev,
    ])

    setRole(nextRole)
    setCurrentUser({
      name: fullName,
      email,
      role: selectedRole,
    })
    setAuthToken(`jwt-${Date.now()}-${btoa(email).slice(0, 8)}`)

    return { ok: true, role: nextRole }
  }

  const logout = () => {
    setRole('guest')
    setCurrentUser(ROLE_DEFAULTS.guest)
    setAuthToken('')
  }

  const switchRole = (nextRole) => {
    setRole(nextRole)
    setCurrentUser(ROLE_DEFAULTS[nextRole])
    setAuthToken(nextRole === 'guest' ? '' : `demo-jwt-token-${nextRole}`)
  }

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((entry) => entry !== productId)
        : [...prev, productId],
    )
  }

  const addToCart = ({ productId, type = 'SALE', days = 1 }) => {
    const product = products.find((entry) => entry.id === productId)

    if (!product) {
      return
    }

    const total =
      type === 'RENT'
        ? (product.rentalPricePerDay || 0) * days + (product.deposit || 0)
        : product.salePrice || 0

    setCart((prev) => [
      ...prev,
      {
        id: `${productId}-${Date.now()}`,
        productId,
        title: product.title,
        type,
        days,
        total,
      },
    ])
  }

  const prepareCheckout = ({ productId, type, days = 1 }) => {
    const product = products.find((entry) => entry.id === productId)

    if (!product) {
      return null
    }

    const baseFee = type === 'RENT' ? (product.rentalPricePerDay || 0) * days : 0
    const total =
      type === 'RENT' ? baseFee + (product.deposit || 0) : product.salePrice || 0

    const draft = {
      productId: product.id,
      title: product.title,
      image: product.image,
      type,
      days,
      dailyRate: product.rentalPricePerDay || 0,
      deposit: product.deposit || 0,
      baseFee,
      total,
      seller: product.seller,
      salePrice: product.salePrice || 0,
    }

    setCheckoutDraft(draft)
    return draft
  }

  const placeOrder = ({ paymentMethod }) => {
    if (!checkoutDraft) {
      return { ok: false, error: 'No checkout draft found.' }
    }

    const newOrder = buildOrderFromCheckout(checkoutDraft, paymentMethod, currentUser)

    setOrders((prev) => [newOrder, ...prev])
    setCheckoutDraft(null)
    setCart((prev) => prev.filter((item) => item.productId !== newOrder.productId))

    return { ok: true, order: newOrder }
  }

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((entry) =>
        entry.id === orderId
          ? {
              ...entry,
              status: nextStatus,
            }
          : entry,
      ),
    )
  }

  const addProduct = (productForm) => {
    const newProduct = {
      id: `p${products.length + 1}`,
      title: productForm.title,
      category: productForm.category,
      seller: currentUser.name,
      salePrice:
        productForm.availability === 'RENT'
          ? null
          : Number(productForm.salePrice) || null,
      rentalPricePerDay:
        productForm.availability === 'SALE'
          ? null
          : Number(productForm.rentalPricePerDay) || null,
      deposit:
        productForm.availability === 'SALE' ? null : Number(productForm.deposit) || null,
      lateFeePerDay:
        productForm.availability === 'SALE'
          ? null
          : Number(productForm.lateFeePerDay) || null,
      availability: productForm.availability,
      rating: 4.1,
      badges:
        productForm.availability === 'BOTH'
          ? ['NEW', 'RENT AVAILABLE']
          : productForm.availability === 'RENT'
            ? ['NEW', 'RENT AVAILABLE']
            : ['NEW'],
      image:
        productForm.previewImage ||
        `https://picsum.photos/seed/product-${Date.now()}/460/320`,
      gallery: [
        productForm.previewImage ||
          `https://picsum.photos/seed/product-${Date.now()}-1/460/320`,
        `https://picsum.photos/seed/product-${Date.now()}-2/460/320`,
        `https://picsum.photos/seed/product-${Date.now()}-3/460/320`,
      ],
      description: productForm.description,
      isActive: true,
    }

    setProducts((prev) => [newProduct, ...prev])
  }

  const toggleProductStatus = (productId) => {
    setProducts((prev) =>
      prev.map((entry) =>
        entry.id === productId
          ? {
              ...entry,
              isActive: !entry.isActive,
            }
          : entry,
      ),
    )
  }

  const removeProduct = (productId) => {
    setProducts((prev) => prev.filter((entry) => entry.id !== productId))
    setOrders((prev) =>
      prev.map((entry) =>
        entry.productId === productId && entry.status === 'Pending'
          ? { ...entry, status: 'Rejected' }
          : entry,
      ),
    )
  }

  const removeWishlistItem = (productId) => {
    setWishlist((prev) => prev.filter((entry) => entry !== productId))
  }

  const sendMessage = ({ subject, body, productTitle, recipientRole, sender }) => {
    setMessages((prev) => [
      {
        id: `m-${Date.now()}`,
        sender,
        recipientRole,
        subject,
        productTitle,
        body,
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ])
  }

  const suspendUser = (userId) => {
    setUsers((prev) =>
      prev.map((entry) =>
        entry.id === userId
          ? {
              ...entry,
              status: entry.status === 'Active' ? 'Suspended' : 'Active',
            }
          : entry,
      ),
    )
  }

  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((entry) => entry.id !== userId))
  }

  const searchSuggestions = (term) => {
    if (!term.trim()) {
      return []
    }

    const query = term.toLowerCase()

    return products
      .filter((product) => product.title.toLowerCase().includes(query))
      .slice(0, 5)
  }

  const value = {
    role,
    currentUser,
    authToken,
    products,
    wishlist,
    cart,
    cartCount,
    orders,
    messages,
    users,
    checkoutDraft,
    login,
    register,
    logout,
    switchRole,
    toggleWishlist,
    addToCart,
    prepareCheckout,
    placeOrder,
    updateOrderStatus,
    addProduct,
    toggleProductStatus,
    removeProduct,
    removeWishlistItem,
    sendMessage,
    suspendUser,
    deleteUser,
    searchSuggestions,
  }

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext)

  if (!context) {
    throw new Error('useMarketplace must be used inside MarketplaceProvider')
  }

  return context
}
