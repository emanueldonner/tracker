"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

import Avatar from "../components/Avatar/Avatar"
import LineChart from "../components/Charts/LineChart"

export default function Home() {
  const [profiles, setProfiles] = useState()
  const [entries, setEntries] = useState()
  const supabase = createClientComponentClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("profile").select()

      setProfiles(data)
    }

    getData()
  }, [])

  const handleOnProfileClick = async (profile) => {
    const { data } = await supabase
      .from("entry")
      .select()
      .order("timestamp", { ascending: true })
      .eq("profile_id", profile.id)
    setEntries(data)
  }
  return profiles ? (
    <>
      Profiles
      <div>
        {profiles.map((profile) => (
          <div key={profile.id} onClick={() => handleOnProfileClick(profile)}>
            <Avatar profile={profile} />
          </div>
        ))}
      </div>
      Entries
      {entries && <LineChart entries={entries} />}
    </>
  ) : (
    <p>Loading entries...</p>
  )
}
