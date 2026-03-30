import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import { sendContactMessage } from '@/services/contact.service'
import { getErrorMessage } from '@/services/api'
import { QUICK_CONTACT, SERVICE_OFFERINGS, SITE_PROFILE, SOCIAL_LINKS } from '@/constants/siteData'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
}

const ContactPage = () => {
  const [formData, setFormData] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const selectService = (serviceName) => {
    setFormData((previous) => ({
      ...previous,
      service: serviceName,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (formData.name.trim().length < 2) {
      setFormError('Please enter a valid name.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please enter a valid email address.')
      return
    }

    if (formData.phone && !/^[0-9+\-\s]{8,18}$/.test(formData.phone.trim())) {
      setFormError('Please enter a valid phone number.')
      return
    }

    if (formData.message.trim().length < 10) {
      setFormError('Message should be at least 10 characters long.')
      return
    }

    setSubmitting(true)

    try {
      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service.trim(),
        message: formData.message.trim(),
      })
      setFormSuccess('Message sent successfully. I will get back to you soon.')
      setFormData(initialForm)
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not send your message. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact | Nikhil Portfolio</title>
        <meta name="description" content="Contact Nikhil Agrahari for projects, mentorship, portfolio guidance, and collaboration." />
      </Helmet>

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Contact"
          title="Let's build something useful together"
          description="The fastest way to reach me is email, LinkedIn, or WhatsApp. You can also use this form for project or service inquiries."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <form className="card-surface rounded-3xl p-6 lg:col-span-2" onSubmit={handleSubmit}>
            <div className="mb-5 rounded-xl border border-cyan-300/20 bg-slate-900/65 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Project Inquiry Form</p>
              <p className="mt-2 text-sm text-slate-300">
                Share your scope clearly and I will respond with feasible next steps, timeline guidance, and delivery expectation.
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">Typical response time: within 12-24 hours</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-slate-200">
                Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300"
                  placeholder="Your name"
                />
              </label>

              <label className="text-sm text-slate-200">
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300"
                  placeholder="you@example.com"
                />
              </label>

              <label className="text-sm text-slate-200">
                Phone
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300"
                  placeholder="+91 7897972883"
                />
              </label>

              <label className="text-sm text-slate-200">
                Service
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300"
                >
                  <option value="">Select a service (optional)</option>
                  {SERVICE_OFFERINGS.map((item) => (
                    <option key={item.slug} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {SERVICE_OFFERINGS.slice(0, 6).map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => selectService(item.name)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    formData.service === item.name
                      ? 'border-cyan-300 bg-cyan-300/15 text-cyan-100'
                      : 'border-cyan-300/20 text-slate-300 hover:border-cyan-300/55 hover:text-cyan-100'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <label className="mt-4 block text-sm text-slate-200">
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="mt-1 w-full resize-none rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300"
                placeholder="Tell me about your project or opportunity"
              />
            </label>

            {formError ? <p className="mt-3 text-sm text-rose-300">{formError}</p> : null}
            {formSuccess ? <p className="mt-3 text-sm text-emerald-300">{formSuccess}</p> : null}

            <div className="mt-5">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>

          <aside className="card-surface rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-cyan-100">Quick Contact</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <p>
                <span className="text-slate-500">Email:</span> {QUICK_CONTACT.email}
              </p>
              <p>
                <span className="text-slate-500">Phone:</span> {QUICK_CONTACT.phone}
              </p>
              <p>
                <span className="text-slate-500">Location:</span> {SITE_PROFILE.location}
              </p>
            </div>

            <div className="mt-5 rounded-xl border border-cyan-300/20 bg-slate-900/65 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Working Modes</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Freelance development modules
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Student mentorship and portfolio guidance
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Basic authorized security review scope
                </li>
              </ul>
            </div>

            <h4 className="mt-5 text-xs uppercase tracking-[0.16em] text-slate-500">Social and Profiles</h4>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg border border-cyan-300/20 px-3 py-2 hover:border-cyan-300/60 hover:text-cyan-100"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-5">
              <Button href={QUICK_CONTACT.resume} target="_blank" rel="noreferrer" variant="ghost" className="w-full">
                View Resume
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

export default ContactPage
