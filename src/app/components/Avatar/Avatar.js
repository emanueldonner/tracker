import React from "react"

import styles from "./Avatar.module.scss"

const Avatar = ({ profile }) => {
  return (
    <div className={styles["avatar"]}>
      <a href={`/profile/${profile.id}`} onClick={(e) => e.preventDefault()}>
        <img src={profile.avatar_url} alt={`Avatar for ${profile.nickname}`} />
        <p>{profile.nickname}</p>
      </a>
    </div>
  )
}

export default Avatar
