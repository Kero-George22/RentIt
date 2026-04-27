import { useState } from 'react'

const EMPTY_FORM = {
  subject: '',
  body: '',
}

export default function MessageForm({ onSend, submitLabel = 'Send Message' }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.subject.trim() || !form.body.trim()) {
      setError('Subject and message body are required.')
      return
    }

    onSend(form)
    setForm(EMPTY_FORM)
    setError('')
  }

  return (
    <form className="space-y-3 rounded-xl border border-gray-200 bg-white p-4" onSubmit={handleSubmit}>
      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
      <input
        className="w-full rounded-md border border-gray-200 px-3 py-2"
        id="subject"
        type="text"
        value={form.subject}
        onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
        placeholder="Enter subject"
      />

      <label htmlFor="body" className="block text-sm font-medium text-gray-700">Message</label>
      <textarea
        className="w-full rounded-md border border-gray-200 px-3 py-2"
        id="body"
        rows="5"
        value={form.body}
        onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
        placeholder="Write your message"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </form>
  )
}
