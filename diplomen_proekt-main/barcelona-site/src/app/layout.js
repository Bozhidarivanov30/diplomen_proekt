// layout.js
import { UserContextProvider } from './context/UserContext';
import Header from './components/Header';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <UserContextProvider>
          <Header />
          <main>{children}</main>
        </UserContextProvider>
      </body>
    </html>
  );
}
