export type CustomerLogo = {
  /** Filename inside `public/customer-logos/` */
  file: string;
  /** Accessible name, e.g. company name */
  alt: string;
};

/**
 * Customer logos for the home page carousel.
 * 1. Add PNG, SVG, JPEG, or WebP files to `public/customer-logos/`
 * 2. List each file here with a short alt label
 */
export const customerLogos: CustomerLogo[] = [
  { file: 'b2k.png', alt: 'B2K' },
  { file: 'JMSPA.png', alt: 'JMSPA' },
  { file: 'Jotcham.png', alt: 'Jotcham' },
  { file: 'KAYO.png', alt: 'KAYO' },
  { file: 'Kilua.png', alt: 'Kilua' },
  { file: 'Labora.png', alt: 'Labora' },
  { file: 'Luhya Vision Group.png', alt: 'Luhya Vision Group' },
  { file: 'MAASAI_MSA_page.png', alt: 'Maasai MSA' },
  { file: 'Reef.png', alt: 'Reef' },
  { file: 'SAI.png', alt: 'SAI' },
  { file: 'STAR.jpeg', alt: 'STAR' },
];
