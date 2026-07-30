import SalaryDashboard from './components/SalaryDashboard';

export const metadata = {
  title: 'UK Salary Benchmarks 2026 | Liberty Towers Intelligence',
  description: 'Interactive UK salary surveys, lowest, average, and highest compensation benchmarks across Insurance, Quant, Tech, Investment Banking, and Legal.',
};

export default function Home() {
  return <SalaryDashboard />;
}
