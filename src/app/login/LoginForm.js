"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"

import styles from "./LoginPage.module.scss"

export default function LoginForm({ session }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const supabase = createClientComponentClient()

  console.log(session)

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    router.refresh()
  }

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
    router.refresh()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  // for the `session` to be available on first SSR render, it must be
  // fetched in a Server Component and passed down as a prop
  return session ? (
    <div className={styles["user-container"]}>
      <p>{session.user?.email}</p>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  ) : (
    <div className={styles["login-form"]}>
      <input
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <input
        type="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button onClick={handleSignIn}>Sign in</button>
      <hr />
      <button className={styles["sign-up"]} onClick={handleSignUp}>
        Sign up
      </button>
    </div>
  )
}
