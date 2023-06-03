import Header from "./components/Header/Header"
import "./globals.css"

export const metadata = {
  title: "Create Next Tracker",
  description: "This is a tracker app to help you keep track.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
