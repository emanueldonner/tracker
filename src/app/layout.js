import Header from "./components/Header/Header"
import MobileNav from "./components/Header/MobileNav"

import "./globals.css"
import styles from "./layout.module.scss"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Mental Health Tracker",
  description: "This is a tracker app to help you keep track.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className={styles["content"]}>
          <div className={styles["desktop-nav"]}>
            <Header />
          </div>
          {children}
          <div className={styles["mobile-nav"]}>
            <MobileNav />
          </div>
        </div>
      </body>
    </html>
  )
}
