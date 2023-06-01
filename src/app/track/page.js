import React from "react"

import cx from "classnames"
import styles from "./track.module.scss"

const Track = () => {
  return (
    <div>
      <h1>Track</h1>
      <div className={styles["tracker-container"]}>
        <div className={styles["tracker-field"]}>
          <div className={cx(styles["field-label"], styles["low-unhappy"])}>
            Low / Unhappy
          </div>
          <div className={cx(styles["field-label"], styles["high-happy"])}>
            High / Happy
          </div>
          <div className={cx(styles["field-label"], styles["low-happy"])}>
            Low / Happy
          </div>
          <div className={cx(styles["field-label"], styles["high-unhappy"])}>
            High / Unhappy
          </div>
        </div>
        <div className={styles["energy"]}>Energy</div>
        <div className={styles["mood"]}>Mood</div>
      </div>
    </div>
  )
}

export default Track
