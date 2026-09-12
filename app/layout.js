import './globals.css';

export const metadata = {
  title: 'The avoidable gap — impact portfolio',
  description: 'A transparent portfolio of CO₂e reduction opportunities in S&P 500 companies.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
