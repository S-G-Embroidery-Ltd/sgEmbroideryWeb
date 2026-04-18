/** WhatsApp Channel invite URL (not the same as wa.me direct chat). Set in `.env` as VITE_WHATSAPP_CHANNEL_URL */
export const whatsappChannelUrl = (import.meta.env.VITE_WHATSAPP_CHANNEL_URL ?? '').trim();

export function whatsappChannelHref(): string {
  return whatsappChannelUrl || '/contact';
}
