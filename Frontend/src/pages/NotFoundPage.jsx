import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-2 text-sm text-gray-600">The page you are looking for does not exist.</p>
        <Link to="/" className="mt-4 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
          Return Home
        </Link>
      </div>
    </section>
  )
}
