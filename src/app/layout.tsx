// app/layout.tsx
import './styles/globals.css'
import Navigation from './Navigation';
import Footer from './Footer';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
