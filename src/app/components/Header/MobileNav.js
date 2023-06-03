"use client"

import React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import { User, LineChart, PlusCircleIcon } from "lucide-react"

import cx from "classnames"
import styles from "./Header.module.scss"
const MobileNav = () => {
  const activeSegment = useSelectedLayoutSegment()
  return (
    <div className={styles["mobile-nav"]}>
      <div className={styles["mobile-nav__menu"]}>
        <Link
          href="/track"
          className={cx(
            styles["mobile-nav__menu-item"],

            { [styles["active"]]: activeSegment == "track" }
          )}
        >
          <PlusCircleIcon />
        </Link>
        <Link
          href="/stats"
          className={cx(styles["mobile-nav__menu-item"], {
            [styles["active"]]: activeSegment == "stats",
          })}
        >
          <LineChart />
        </Link>
        <Link
          href="/profile"
          className={cx(styles["mobile-nav__menu-item"], {
            [styles["active"]]: activeSegment == "profile",
          })}
        >
          <User />
        </Link>
      </div>
    </div>
  )
}

export default MobileNav
