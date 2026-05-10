import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

export const metadata = {
  title: 'UniPlacement AI – Campus Placement Intelligence Platform',
  description: 'AI-driven campus placement platform to match students with roles, analyze resumes, and prepare for technical interviews.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-950 text-dark-100 font-body antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e1e1e',
                color: '#f8f8f8',
                border: '1px solid #2a2a2a',
                fontFamily: 'DM Sans, sans-serif',
              },
              success: { iconTheme: { primary: '#f59e0b', secondary: '#1e1e1e' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#1e1e1e' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}