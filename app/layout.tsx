import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/globals.css'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Web Application',
  description: 'A web application with authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body className="h-screen w-screen">
        {/* <div className="max-h-screen overflow-y-auto bg-gray-50 flex flex-col border-4 border-red-300"> */}
        <div className="h-full overflow-y-auto bg-gray-50 flex flex-col ">
          <Navbar />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-1 overflow-y-auto ">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
