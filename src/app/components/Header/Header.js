import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import LoginForm from "./LoginForm"

import styles from "./Header.module.scss"

export async function Login() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return <LoginForm session={session} />
}

const Header = () => {
  return (
    <div className={styles["header"]}>
      <a href="/">
        <h2>Home</h2>
      </a>
      <div>
        <a href="/track">
          <h2>Track</h2>
        </a>
        <a href="/stats">
          <h2>Stats</h2>
        </a>
      </div>
      <Login />
    </div>
  )
}

export default Header
