import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { Providers } from "./providers";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";

const ReduxProvider = dynamic(() => import("./store/redux-provider"), {
  ssr: false
});
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dist Craft",
  description: "Distribution management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

        <ReduxProvider>
          <Providers>
            {children}
            <ToastContainer autoClose={1000} theme='dark' />
          </Providers>
        </ReduxProvider>

      </body>
    </html>

  );
}
