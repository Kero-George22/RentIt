import { useEffect, useMemo, useState } from 'react'

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US')}`
}

export default function RentalCalculator({
  dailyRate,
  deposit,
  initialDays = 1,
  onChange,
}) {
  const [days, setDays] = useState(initialDays)

  const pricing = useMemo(() => {
    const safeDays = Math.max(1, Number(days) || 1)
    const baseFee = safeDays * dailyRate
    const total = baseFee + deposit

    return {
      days: safeDays,
      baseFee,
      total,
    }
  }, [dailyRate, deposit, days])

  useEffect(() => {
    if (onChange) {
      onChange(pricing)
    }
  }, [pricing, onChange])

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h4 className="text-base font-semibold text-gray-900">Rental Calculator</h4>
      <label htmlFor="days" className="mt-3 block text-sm font-medium text-gray-700">Number of days</label>
      <input
        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2"
        id="days"
        type="number"
        min="1"
        value={days}
        onChange={(event) => setDays(event.target.value)}
      />

      <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-3">
        <p className="flex items-center justify-between text-sm text-gray-700">
          <span>Daily Rate</span>
          <strong className="text-gray-900">{formatCurrency(dailyRate)}</strong>
        </p>
        <p className="flex items-center justify-between text-sm text-gray-700">
          <span>Base Fee</span>
          <strong className="text-gray-900">{formatCurrency(pricing.baseFee)}</strong>
        </p>
        <p className="flex items-center justify-between text-sm text-gray-700">
          <span>Deposit</span>
          <strong className="text-gray-900">{formatCurrency(deposit)}</strong>
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 text-sm font-semibold text-gray-900">
        <span>Total Due</span>
        <strong>{formatCurrency(pricing.total)}</strong>
      </div>
    </div>
  )
}
