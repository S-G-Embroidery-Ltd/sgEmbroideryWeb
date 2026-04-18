import type { CustomerLogo } from '../../config/customerLogos';

type Props = {
  logos: CustomerLogo[];
};

const CustomerLogoMarquee = ({ logos }: Props) => {
  if (logos.length === 0) return null;

  const logoCell = (logo: CustomerLogo, key: string) => (
    <div
      key={key}
      className="flex h-16 md:h-[4.5rem] min-w-[7rem] md:min-w-[8.5rem] items-center justify-center px-6"
    >
      <img
        src={`/customer-logos/${encodeURIComponent(logo.file)}`}
        alt={logo.alt}
        className="max-h-12 md:max-h-14 w-auto max-w-[10rem] object-contain opacity-85 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
        loading="lazy"
        decoding="async"
      />
    </div>
  );

  return (
    <div className="mt-12 mb-14">
      <p className="text-center text-sm font-semibold uppercase tracking-wider text-primary-600 mb-6">
        Trusted by teams we&apos;ve worked with
      </p>

      {/* Reduced motion: static wrapped grid */}
      <div className="hidden flex-wrap justify-center gap-x-10 gap-y-8 motion-reduce:flex">
        {logos.map((logo) => logoCell(logo, logo.file))}
      </div>

      {/* Infinite marquee (paused on hover) */}
      <div className="relative overflow-hidden motion-reduce:hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surfaceWarm to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surfaceWarm to-transparent" />
        <div className="flex w-max gap-4 animate-marquee-logos hover:[animation-play-state:paused] md:gap-8">
          {[...logos, ...logos].map((logo, i) => logoCell(logo, `${logo.file}-${i}`))}
        </div>
      </div>
    </div>
  );
};

export default CustomerLogoMarquee;
