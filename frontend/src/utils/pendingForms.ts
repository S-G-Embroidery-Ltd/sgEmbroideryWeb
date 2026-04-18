/** Drafts for quote / logo flows — survives redirect to login & Google OAuth. */

export const PENDING_QUOTE_KEY = 'sg-pending-quote-v1';
export const PENDING_LOGO_KEY = 'sg-pending-logo-embroidery-v1';
export const AUTH_RETURN_KEY = 'sg-auth-return';

const MAX_DATA_URL_CHARS = 4_000_000;

export function isSafeReturnUrl(url: string | null): url is string {
  return !!url && url.startsWith('/') && !url.startsWith('//');
}

export function rememberAuthReturn(url: string) {
  if (isSafeReturnUrl(url)) {
    sessionStorage.setItem(AUTH_RETURN_KEY, url);
  }
}

export function takeAuthReturn(): string | null {
  const v = sessionStorage.getItem(AUTH_RETURN_KEY);
  if (v && isSafeReturnUrl(v)) {
    sessionStorage.removeItem(AUTH_RETURN_KEY);
    return v;
  }
  return null;
}

export function peekAuthReturn(): string | null {
  const v = sessionStorage.getItem(AUTH_RETURN_KEY);
  return v && isSafeReturnUrl(v) ? v : null;
}

export type PendingQuotePayload = {
  formData: {
    name: string;
    email: string;
    phone: string;
    company: string;
    description: string;
    quantity: string;
    timeline: string;
    specialInstructions: string;
  };
  referenceDataUrl?: string;
  referenceName?: string;
  referenceOmitted?: boolean;
};

export type PendingLogoPayload = {
  formData: {
    name: string;
    email: string;
    phone: string;
    company: string;
    notes: string;
    wantStitchingQuote: '' | 'yes' | 'no';
    quantity: string;
  };
  logoDataUrl?: string;
  logoName?: string;
  logoType?: string;
  logoOmitted?: boolean;
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('read failed'));
    reader.readAsDataURL(file);
  });
}

export async function dataURLToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'application/octet-stream' });
}

export async function savePendingQuote(
  formData: PendingQuotePayload['formData'],
  referenceFile: File | null
): Promise<{ referenceOmitted: boolean }> {
  let referenceDataUrl: string | undefined;
  let referenceName: string | undefined;
  let referenceOmitted = false;

  if (referenceFile) {
    try {
      const dataUrl = await fileToDataUrl(referenceFile);
      if (dataUrl.length > MAX_DATA_URL_CHARS) {
        referenceOmitted = true;
      } else {
        referenceDataUrl = dataUrl;
        referenceName = referenceFile.name;
      }
    } catch {
      referenceOmitted = true;
    }
  }

  const payload: PendingQuotePayload = {
    formData,
    referenceDataUrl,
    referenceName,
    referenceOmitted: referenceOmitted || undefined,
  };
  sessionStorage.setItem(PENDING_QUOTE_KEY, JSON.stringify(payload));
  return { referenceOmitted };
}

export function loadPendingQuote(): PendingQuotePayload | null {
  const raw = sessionStorage.getItem(PENDING_QUOTE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingQuotePayload;
  } catch {
    return null;
  }
}

export function clearPendingQuote() {
  sessionStorage.removeItem(PENDING_QUOTE_KEY);
}

export async function savePendingLogo(
  formData: PendingLogoPayload['formData'],
  logoFile: File
): Promise<{ logoOmitted: boolean }> {
  let logoDataUrl: string;
  try {
    logoDataUrl = await fileToDataUrl(logoFile);
    if (logoDataUrl.length > MAX_DATA_URL_CHARS) {
      sessionStorage.setItem(
        PENDING_LOGO_KEY,
        JSON.stringify({
          formData,
          logoOmitted: true,
        } satisfies Partial<PendingLogoPayload> & { logoOmitted: boolean })
      );
      return { logoOmitted: true };
    }
  } catch {
    sessionStorage.setItem(
      PENDING_LOGO_KEY,
      JSON.stringify({ formData, logoOmitted: true })
    );
    return { logoOmitted: true };
  }

  const payload: PendingLogoPayload = {
    formData,
    logoDataUrl,
    logoName: logoFile.name,
    logoType: logoFile.type,
  };
  sessionStorage.setItem(PENDING_LOGO_KEY, JSON.stringify(payload));
  return { logoOmitted: false };
}

export function loadPendingLogo(): PendingLogoPayload | null {
  const raw = sessionStorage.getItem(PENDING_LOGO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingLogoPayload;
  } catch {
    return null;
  }
}

export function clearPendingLogo() {
  sessionStorage.removeItem(PENDING_LOGO_KEY);
}
