import type { Metadata } from 'next';
import HiringCostCalculator from '../components/HiringCostCalculator';

const canonical = 'https://liberty-towers.org/hiring-cost-calculator';
const title = 'Hiring Cost & Vacancy Delay Calculator | Liberty Towers';
const description =
  'Estimate the commercial cost of an unfilled role: lost productivity, management time, and projected costs of further 30, 60, and 90 days delay. Free UK executive hiring calculator.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Liberty Towers Intelligence',
    title,
    description,
    url: canonical,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Liberty Towers Hiring Cost Calculator',
  url: canonical,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  inLanguage: 'en-GB',
  description,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Liberty Towers',
    url: 'https://liberty-towers.org',
  },
};

export default function HiringCostCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <HiringCostCalculator />
    </>
  );
}
