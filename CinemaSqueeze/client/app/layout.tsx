import type React from "react"
import "./globals.css"
import "./slider.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MovieProvider } from "@/context/MovieContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Movie Slider",
  description: "Browse movies in a slider format",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <MovieProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
        </ThemeProvider>
          </MovieProvider>
      </body>
    </html>
  )
}
