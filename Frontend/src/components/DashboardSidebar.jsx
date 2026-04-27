export default function DashboardSidebar({ title, items, active, onSelect }) {
  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <nav className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${active === item.value ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            onClick={() => onSelect(item.value)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
