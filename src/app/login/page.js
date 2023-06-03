import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import LoginForm from "./LoginForm"

import styles from "./LoginPage.module.scss"
export async function LoginPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div className={styles["login-page"]}>
      <h2>Welcome</h2>
      <p>Sign in to continue</p>

      <LoginForm session={session} />
    </div>
  )
}
export default LoginPage
