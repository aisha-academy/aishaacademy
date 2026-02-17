"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface FooterProps {
  lang?: string;
  dict?: any;
}

const Footer: React.FC<FooterProps> = ({ lang: propLang, dict }) => {
  const pathname = usePathname();
  const lang = propLang || pathname.split("/")[1] || "es";

  const getLocalizedHref = (href: string) => {
    return `/${lang}${href === "/" ? "" : href}`;
  };

  const footerDict = dict?.footer || {
    mission: "Shaping hearts and minds in the light of the Qur'an.",
    programsTitle: "Our Programs",
    quickLinksTitle: "Quick Links",
    stayConnectedTitle: "Stay Connected",
    copyright: "© {year} Aisha Academy. Licensed & Registered.",
    developedBy: "Developed by",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    available: "Available Online & On-Campus",
  };

  return (
    <footer className="relative bg-primary/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-white/10 dark:border-gray-800 pt-24 pb-12 text-white overflow-hidden">
      {/* Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-10 md:px-12 lg:px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 pb-16 border-b border-white/10 dark:border-gray-800">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link
              href={getLocalizedHref("/")}
              className="relative flex items-center"
            >
              <span className="absolute -inset-2 rounded-full bg-accent/20 blur-xl"></span>
              <Image
                src="/images/logo-bg-re.png"
                alt="Logo"
                width={160}
                height={50}
                priority
                className="relative w-40"
                style={{ height: "auto" }}
              />
            </Link>
            <p className="text-gray-300 dark:text-gray-400 max-w-sm font-sans leading-relaxed">
              {footerDict.mission}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={footerDict.social?.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/5 hover:bg-accent hover:text-white transition-all duration-300 border border-white/10 hover:border-accent"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href={footerDict.social?.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/5 hover:bg-accent hover:text-white transition-all duration-300 border border-white/10 hover:border-accent"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white dark:text-white font-serif tracking-wide">
              {footerDict.programsTitle}
            </h4>
            <ul className="space-y-3 text-gray-300 dark:text-gray-400 font-sans">
              <li>
                <Link
                  href={getLocalizedHref("/programs")}
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  {dict?.programsPage?.programs?.[1]?.title ||
                    "Quran with Tajweed"}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref("/programs")}
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  {dict?.programsPage?.programs?.[2]?.title || "Hifz Program"}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref("/programs")}
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  {dict?.programsPage?.programs?.[3]?.title ||
                    "Islamic Studies"}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref("/programs")}
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  {dict?.programsPage?.programs?.[4]?.title ||
                    "Arabic Language"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white dark:text-white font-serif tracking-wide">
              {footerDict.quickLinksTitle}
            </h4>
            <ul className="space-y-3 text-gray-300 dark:text-gray-400 font-sans">
              <li>
                <Link
                  href={getLocalizedHref("/online-classes")}
                  className="hover:text-accent transition-colors"
                >
                  {dict?.navigation?.onlineClasses || "Online Classes"}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref("/physical-classes")}
                  className="hover:text-accent transition-colors"
                >
                  {dict?.navigation?.physicalClasses || "Physical Classes"}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref("/admissions")}
                  className="hover:text-accent transition-colors"
                >
                  {dict?.navigation?.admissions || "Admissions"}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref("/contact")}
                  className="hover:text-accent transition-colors"
                >
                  {dict?.navigation?.contact || "Contact"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white dark:text-white font-serif tracking-wide">
              {footerDict.stayConnectedTitle}
            </h4>
            <ul className="space-y-4 text-gray-300 dark:text-gray-400 font-sans text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>
                  4640 Rue de Salaberry,
                  <br /> Montréal, QC H4J 1H6
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-accent shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>info@aisha-academy.com</span>
              </li>
            </ul>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/20 text-accent text-xs font-semibold">
                {footerDict.available}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
          <p>
            {footerDict.copyright.replace(
              "{year}",
              new Date().getFullYear().toString(),
            )}
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex gap-6">
              <Link
                href={getLocalizedHref("/privacy-policy")}
                className="hover:text-white transition-colors"
              >
                {footerDict.privacyPolicy}
              </Link>
              <Link
                href={getLocalizedHref("/terms-conditions")}
                className="hover:text-white transition-colors"
              >
                {footerDict.termsOfService}
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <span>{footerDict.developedBy}</span>
              <a
                href="https://bshsolutionss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-white font-bold transition-colors"
              >
                BSH Solutions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const MapPin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default Footer;
