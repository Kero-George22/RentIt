import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import MobileBottomNav from './components/MobileBottomNav'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import { MarketplaceProvider } from './context/MarketplaceContext'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AuthPage from './pages/AuthPage'
import BrowsePage from './pages/BrowsePage'
import CheckoutPage from './pages/CheckoutPage'
import CustomerDashboardPage from './pages/CustomerDashboardPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import ProductDetailPage from './pages/ProductDetailPage'
import SellerDashboardPage from './pages/SellerDashboardPage'

function SiteLayout() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[60vh] pb-20 lg:pb-0">
        <Outlet />
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/our-store" element={<Navigate to="/browse" replace />} />
        <Route path="/blogs" element={<Navigate to="/browse" replace />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard/customer" element={<CustomerDashboardPage />} />
        <Route path="/dashboard/seller" element={<SellerDashboardPage />} />
        <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <MarketplaceProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </MarketplaceProvider>
  )
}
