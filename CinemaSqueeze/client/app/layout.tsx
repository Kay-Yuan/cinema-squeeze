import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Next.js Movie App",
  description: "A simple movie app built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <header className="bg-primary text-white py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">Cinema Squeeze App</h1>
          </div>
        </header>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            
            {children}
          </ThemeProvider>
        <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Cinema Squeeze App. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
