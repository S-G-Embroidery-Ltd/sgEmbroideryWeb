import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, X, Check, ArrowRight, Loader2 } from 'lucide-react';
import { LOGO_ORIGINATION_KES } from '../config/pricing';
import { useAuth } from '../hooks/useAuth';
import { quoteRequestsAPI } from '../services/api';
import {
  savePendingQuote,
  loadPendingQuote,
  clearPendingQuote,
  dataURLToFile,
} from '../utils/pendingForms';

/** General project quote — uniforms, bulk, products, mixed jobs. For logo digitizing only, use /logo-embroidery. */
const Quote = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    description: '',
    quantity: '',
    timeline: '',
    specialInstructions: '',
  });

  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftNotice, setDraftNotice] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('resume') !== '1') return;
    const pending = loadPendingQuote();
    if (pending) {
      setFormData(pending.formData);
      if (pending.referenceDataUrl && pending.referenceName) {
        setReferencePreview(pending.referenceDataUrl);
        dataURLToFile(pending.referenceDataUrl, pending.referenceName).then(setReferenceFile).catch(() => {});
      }
      if (pending.referenceOmitted) {
        setDraftNotice('Your reference file was too large to keep in the browser. Please attach it again if needed.');
      } else {
        setDraftNotice('Welcome back — your draft is restored. Submit when you’re ready.');
      }
    }
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (user) {
      setFormData((f) => ({
        ...f,
        name: user.name || f.name,
        email: user.email || f.email,
      }));
    }
  }, [user]);

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReferenceFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setReferencePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setReferencePreview(null);
    }
  };

  const removeReference = () => {
    setReferenceFile(null);
    setReferencePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setIsSubmitting(true);
      try {
        await savePendingQuote(formData, referenceFile);
        navigate(`/login?returnUrl=${encodeURIComponent('/quote?resume=1')}`);
      } catch {
        setError('Could not save your draft. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('name', formData.name.trim());
      fd.append('email', formData.email.trim());
      fd.append('phone', formData.phone.trim());
      fd.append('company', formData.company.trim());
      fd.append('description', formData.description.trim());
      fd.append('quantity', formData.quantity.trim());
      fd.append('timeline', formData.timeline.trim());
      fd.append('specialInstructions', formData.specialInstructions.trim());
      if (referenceFile) {
        fd.append('reference', referenceFile);
      }

      await quoteRequestsAPI.create(fd);
      clearPendingQuote();
      setIsSubmitted(true);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(message || (err instanceof Error ? err.message : 'Could not submit quote request'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-surface py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-card p-8 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-secondary-700" />
            </div>
            <h1 className="text-3xl font-bold text-primary-900 mb-4 font-display">Estimate request sent</h1>
            <p className="text-lg text-primary-700 mb-8">
              Thank you. Our team will review your project and respond with a cost estimate — typically within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/my-activity?tab=quotes" className="btn-primary text-center">
                View in My activity
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: '',
                    company: '',
                    description: '',
                    quantity: '',
                    timeline: '',
                    specialInstructions: '',
                  });
                  setReferenceFile(null);
                  setReferencePreview(null);
                }}
                className="btn-outline"
              >
                Request another estimate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary-700 mb-2">Projects & bulk orders</p>
          <h1 className="text-4xl font-bold text-primary-900 mb-4 font-display">Request a project estimate</h1>
          <p className="text-lg text-primary-700 max-w-3xl mx-auto">
            Describe your scope — uniforms, quantities, timelines, and budgets. We&apos;ll reply with a tailored cost
            estimate for the job. This is <strong>not</strong> the same as ordering a digitized embroidery file from a logo
            alone (that has a fixed origination fee on{' '}
            <Link to="/logo-embroidery" className="text-secondary-800 font-semibold underline-offset-2 hover:underline">
              logo embroidery
            </Link>
            ).
          </p>
        </div>

        {draftNotice && (
          <div className="mb-8 rounded-2xl border border-secondary-200 bg-secondary-50/90 px-4 py-3 text-sm text-primary-800 text-center">
            {draftNotice}
          </div>
        )}

        <div className="mb-10 rounded-2xl border border-primary-200 bg-white p-6 text-left shadow-card">
          <p className="text-sm font-semibold text-primary-900 mb-1">Only need your PNG/JPEG turned into an embroidery file?</p>
          <p className="text-primary-700 text-sm md:text-base">
            Use{' '}
            <Link to="/logo-embroidery" className="font-semibold text-secondary-800 underline-offset-2 hover:underline">
              Embroidery from your logo
            </Link>{' '}
            — origination <strong>KES {LOGO_ORIGINATION_KES.toLocaleString()}</strong> per design (incl. VAT).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-3xl shadow-card p-8">
            <h2 className="text-2xl font-bold text-primary-900 mb-6 font-display">Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-800 mb-2">Full name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-primary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-800 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-primary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-800 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-primary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+254 700 000 000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-800 mb-2">Company (optional)</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-primary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your Company Ltd"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-card p-8">
            <h2 className="text-2xl font-bold text-primary-900 mb-6 font-display">Project details</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-primary-800 mb-2">Describe what you need *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-primary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g. 200 polos with left-chest logo, school uniforms by size, event merch mix, delivery to Mombasa…"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-primary-800 mb-2">Reference file (optional)</label>
              <p className="text-sm text-primary-600 mb-3">
                Attach a mock-up, brief, or image for context — not required. For a standalone logo digitizing order, use{' '}
                <Link to="/logo-embroidery" className="font-medium text-secondary-800 underline-offset-2 hover:underline">
                  logo embroidery
                </Link>
                .
              </p>
              <div className="border-2 border-dashed border-primary-200 rounded-2xl p-6 text-center hover:border-primary-400 transition-colors">
                {referencePreview ? (
                  <div className="relative">
                    <img src={referencePreview} alt="Reference" className="mx-auto max-h-48 rounded-lg" />
                    <button
                      type="button"
                      onClick={removeReference}
                      className="absolute top-2 right-2 bg-accent-600 text-white rounded-full p-1 hover:bg-accent-700"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : referenceFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-primary-800 text-sm">{referenceFile.name}</span>
                    <button type="button" onClick={removeReference} className="text-accent-600 text-sm font-medium">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-primary-400 mx-auto mb-3" />
                    <input
                      type="file"
                      accept="image/*,.pdf,application/pdf"
                      onChange={handleReferenceUpload}
                      className="hidden"
                      id="reference-upload"
                    />
                    <label htmlFor="reference-upload" className="btn-outline cursor-pointer inline-flex text-sm">
                      Attach file
                    </label>
                    <p className="text-primary-600 text-xs mt-2">Images or PDF</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-800 mb-2">Quantity (if known)</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 border border-primary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g. 200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-800 mb-2">Timeline *</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-primary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select</option>
                  <option value="urgent">Urgent (1–3 days)</option>
                  <option value="standard">Standard (1–2 weeks)</option>
                  <option value="flexible">Flexible (2–4 weeks)</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-primary-800 mb-2">Special instructions (optional)</label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-primary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Sizing splits, packaging, invoicing, etc."
              />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-accent-200 bg-accent-50 text-accent-900 px-4 py-3 text-sm text-center">
              {error}
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin shrink-0" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit estimate request
                  <ArrowRight className="w-5 h-5 ml-2 shrink-0" />
                </>
              )}
            </button>
            <p className="text-primary-600 text-sm mt-4">We typically respond within 24 hours with pricing guidance.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Quote;
