const statusClassMap = {
  Pending: 'border-amber-200 bg-amber-100 text-amber-700',
  Approved: 'border-blue-200 bg-blue-100 text-blue-700',
  Rejected: 'border-red-200 bg-red-100 text-red-700',
  Completed: 'border-emerald-200 bg-emerald-100 text-emerald-700',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClassMap[status] || 'border-gray-200 bg-gray-100 text-gray-600'}`}
    >
      {status}
    </span>
  )
}
