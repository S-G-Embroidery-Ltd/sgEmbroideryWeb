import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, X, Loader2, ArrowRight } from 'lucide-react';
import { LOGO_ORIGINATION_KES } from '../config/pricing';
import { useAuth } from '../hooks/useAuth';
import { digitizingRequestsAPI, paymentsAPI } from '../services/api';
import {
  savePendingLogo,
  loadPendingLogo,
  clearPendingLogo,
  dataURLToFile,
} from '../utils/pendingForms';

const TAX_RATE = 0.16;
/** Gross fee shown to customer (inclusive of VAT). */
const DIGITIZING_TOTAL = LOGO_ORIGINATION_KES;
const subtotalExVat = Math.round((DIGITIZING_TOTAL / (1 + TAX_RATE)) * 100) / 100;
const vatIncluded = Math.round((DIGITIZING_TOTAL - subtotalExVat) * 100) / 100;

/** Request embroidery digitizing from a client-supplied PNG or JPEG; payment required before request is queued. */
const LogoEmbroidery = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    wantStitchingQuote: '' as '' | 'yes' | 'no',
    quantity: '',
  });

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftNotice, setDraftNotice] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('resume') !== '1') return;
    const pending = loadPendingLogo();
    if (pending?.formData) {
      setFormData(pending.formData);
      if (pending.logoOmitted) {
        setDraftNotice(
          'Your logo file was too large to keep in this browser after sign-in. Please upload it again, then pay to submit.'
        );
      } else if (pending.logoDataUrl && pending.logoName) {
        setImagePreview(pending.logoDataUrl);
        dataURLToFile(pending.logoDataUrl, pending.logoName).then(setUploadedImage).catch(() => {});
        setDraftNotice('Welcome back — your details are restored. Complete payment to submit your digitizing request.');
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = file.type === 'image/png' || file.type === 'image/jpeg';
    if (!ok) {
      window.alert('Please upload a PNG or JPEG file.');
      e.target.value = '';
      return;
    }
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedImage) {
      setError('Please upload a PNG or JPEG logo.');
      return;
    }
    setError(null);

    if (!user) {
      setIsPaying(true);
      try {
        await savePendingLogo(formData, uploadedImage);
        navigate(`/login?returnUrl=${encodeURIComponent('/logo-embroidery?resume=1')}`);
      } catch {
        setError('Could not save your draft. Please try again.');
      } finally {
        setIsPaying(false);
      }
      return;
    }

    setIsPaying(true);

    try {
      const fd = new FormData();
      fd.append('logo', uploadedImage);
      fd.append('name', formData.name.trim());
      fd.append('email', formData.email.trim());
      fd.append('phone', formData.phone.trim());
      fd.append('company', formData.company.trim());
      fd.append('notes', formData.notes.trim());
      fd.append('wantStitchingQuote', formData.wantStitchingQuote);
      fd.append('quantity', formData.quantity.trim());

      const { data: createRes } = await digitizingRequestsAPI.create(fd);
      const order = createRes.order as { _id: string };
      const orderId = order._id;

      clearPendingLogo();

      const { data: payRes } = await paymentsAPI.initiate({
        orderId,
        email: formData.email.trim(),
      });

      const url = payRes.paymentUrl as string;
      if (!url) {
        throw new Error('No payment URL returned');
      }
      window.location.href = url;
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(message || (err instanceof Error ? err.message : 'Could not start payment'));
      setIsPaying(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary-700 mb-2">Logo → embroidery file</p>
          <h1 className="text-4xl font-bold text-primary-900 mb-4 font-display">Embroidery design from your logo</h1>
          <p className="text-lg text-primary-700 max-w-3xl mx-auto">
            Upload a <strong>PNG</strong> or <strong>JPEG</strong>. We create a digitized embroidery file for your logo. You{' '}
            <strong>pay the origination fee online</strong> (KES {LOGO_ORIGINATION_KES.toLocaleString()}, inclusive of VAT); after payment
            your request is queued. Need uniforms or bulk stitching too?{' '}
            <Link to="/quote" className="text-secondary-700 font-semibold underline-offset-2 hover:underline">
              Request a project quote
            </Link>{' '}
            separately.
          </p>
        </div>

        {draftNotice && (
          <div className="mb-8 rounded-2xl border border-secondary-200 bg-secondary-50/90 px-4 py-3 text-sm text-primary-800 text-center">
            {draftNotice}
          </div>
        )}

        <div className="mb-10 rounded-2xl border border-secondary-200 bg-secondary-50/80 p-6 text-left shadow-sm">
          <h2 className="font-display text-lg font-bold text-primary-900 md:text-xl">How it works</h2>
          <ol className="mt-3 list-decimal list-inside text-sm leading-relaxed text-primary-800 md:text-base space-y-1">
            <li>Fill in your details and upload your logo.</li>
            <li>
              Click <strong>Pay &amp; submit</strong> — you&apos;ll complete payment on Paystack (KES {DIGITIZING_TOTAL.toLocaleString()},{' '}
              inclusive of VAT).
            </li>
            <li>After successful payment, we review your logo and follow up by email with next steps.</li>
          </ol>
        </div>

        <form onSubmit={handlePayAndSubmit} className="space-y-8">
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
            <h2 className="text-2xl font-bold text-primary-900 mb-2 font-display">Your logo (PNG or JPEG) *</h2>
            <p className="mb-6 text-sm text-primary-700">
              Clear, high-resolution images work best. Max ~10MB. This artwork is saved with your order after payment.
            </p>

            <div className="mb-6">
              <div className="border-2 border-dashed border-primary-200 rounded-2xl p-6 text-center hover:border-primary-400 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Uploaded logo" className="mx-auto max-h-64 rounded-lg" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-accent-600 text-white rounded-full p-1 hover:bg-accent-700"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                    <p className="text-primary-700 mb-2">Click to upload</p>
                    <p className="text-primary-600 text-sm">PNG or JPEG, up to 10MB</p>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="mt-4 btn-primary cursor-pointer inline-flex">
                      Choose file
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-primary-800 mb-2">Notes for digitizing (optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-primary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g. max size on chest, colours to match, simplify small text…"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-800 mb-2">
                  Also want a quote for stitching this on garments?
                </label>
                <select
                  name="wantStitchingQuote"
                  value={formData.wantStitchingQuote}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-primary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select</option>
                  <option value="no">No — embroidery file only</option>
                  <option value="yes">Yes — include garment quantity below</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-800 mb-2">
                  Approx. pieces (if requesting stitching quote)
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 border border-primary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g. 50"
                  disabled={formData.wantStitchingQuote !== 'yes'}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card">
            <h3 className="font-display font-bold text-primary-900 mb-3">Payment summary</h3>
            <div className="space-y-2 text-sm text-primary-800">
              <div className="flex justify-between">
                <span>Amount (excl. VAT)</span>
                <span>KES {subtotalExVat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (16%)</span>
                <span>KES {vatIncluded.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-primary-900 pt-2 border-t border-primary-100">
                <span>Total due (incl. VAT)</span>
                <span>KES {DIGITIZING_TOTAL.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-accent-200 bg-accent-50 text-accent-900 px-4 py-3 text-sm">{error}</div>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={isPaying || !uploadedImage}
              className="btn-secondary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center font-bold uppercase tracking-wide"
            >
              {isPaying ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin shrink-0" />
                  Redirecting to Paystack…
                </>
              ) : (
                <>
                  Pay KES {DIGITIZING_TOTAL.toLocaleString()} &amp; submit
                  <ArrowRight className="w-5 h-5 ml-2 shrink-0" />
                </>
              )}
            </button>
            <p className="text-primary-600 text-sm mt-4 max-w-xl mx-auto">
              You will be redirected to Paystack to pay securely. Your digitizing request is recorded only after payment succeeds.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogoEmbroidery;
