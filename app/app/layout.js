import './globals.css';
import { Providers } from './providers';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Budget Hiking Planner',
  description: 'Plan your hiking adventures on a budget',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
