"use client"

import React, { useState, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import cx from "classnames"
import styles from "./track.module.scss"
import dayjs from "dayjs"

const Tracker = () => {
  const supabase = createClientComponentClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const [currentState, setCurrentState] = useState("Neutral")
  const [energy, setEnergy] = useState(0)
  const [mood, setMood] = useState(0)
  const [note, setNote] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  const agitatedRef = useRef()
  const depressedRef = useRef()
  const relaxedRef = useRef()
  const excitedRef = useRef()
  const mainInfoBoxRef = useRef()
  const trackerFieldRef = useRef()
  const dialogRef = useRef()

  const colorDepressed = [0, 0, 85]
  const colorRelaxed = [73, 255, 237]
  const colorAgitated = [249, 11, 118] // Yellow in RGB
  const colorExcited = [255, 255, 106] // Red in RGB

  const canvas = document.createElement("canvas")
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext("2d")

  const updateCursor = (color) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // Draw the larger, white circle
    ctx.beginPath()
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2,
      0,
      Math.PI * 2
    )
    ctx.fillStyle = "white"
    ctx.fill()

    // Draw the smaller, colored circle on top
    ctx.beginPath()
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2 - 1,
      0,
      Math.PI * 2
    )
    ctx.fillStyle = color
    ctx.fill()

    const dataUrl = canvas.toDataURL("image/png")
    trackerFieldRef.current.style.cursor = `url(${dataUrl}) ${
      canvas.width / 2
    } ${canvas.height / 2}, auto`
  }

  const stateMap = {
    Depressed: {
      color: "rgb(0, 0, 85)",
      text: "Depressed: You’re feeling low and unhappy. It’s hard to get moving.",
    },
    Relaxed: {
      color: "rgb(73, 255, 237)",
      text: "Relaxed: You’re feeling low energy, but you’re content. You might not be super productive, but you’re okay with that.",
    },
    Agitated: {
      color: "rgb(249, 11, 118)",
      text: "Agitated: You’re feeling high energy, but not in a good way. You might be feeling stressed or overwhelmed.",
    },
    Excited: {
      color: "rgb(255, 255, 106)",
      text: "Excited: You’re feeling high energy and happy. You’re productive, active, and comfortable engaging with others.",
    },
    Dispirited: {
      text: "Dispirited: You're feeling somewhat low and slightly unhappy. You might be lacking motivation or feeling a bit down.",
      color: "#73FFFF",
    },
    Content: {
      text: "Content: You're feeling calm and content. You might not be super productive, but you're okay with that and enjoying the tranquility.",
      color: "#000055",
    },
    Upset: {
      text: "Upset: You're not at your lowest, but you're not feeling great either. You might be dealing with some stress or discomfort.",
      color: "#FF6900",
    },
    Pleased: {
      text: "Pleased: You're not overly energetic, but you're feeling pretty good. This is a state of general well-being and satisfaction.",
      color: "#F90B76",
    },
    Stressed: {
      text: "Stressed: You're feeling energetic, but not in a positive way. You might be dealing with high stress or anxiety",
      color: "#FF6900",
    },
    Active: {
      text: "Active: You're feeling energetic and reasonably positive. You might be busy, engaged, and productive.",
      color: "#F90B76",
    },
    Balanced: {
      text: "Balanced: You're feeling neither high nor low energy, neither particularly happy nor unhappy. This is a state of equilibrium and emotional stability. You're not too active, but also not lethargic. You're content without being overly excited or joyful.",
      color: "#808080",
    },

    Neutral: {
      color: "gray",
      text: "Neutral: You’re feeling neither high nor low energy. You’re not particularly happy or unhappy.",
    },
  }

  function getColor(xPercent, yPercent) {
    // Define the colors at the four corners

    // Calculate the weighted average of the corner colors
    const color = [
      (1 - xPercent) * yPercent * colorDepressed[0] +
        xPercent * yPercent * colorRelaxed[0] +
        (1 - xPercent) * (1 - yPercent) * colorAgitated[0] +
        xPercent * (1 - yPercent) * colorExcited[0],

      (1 - xPercent) * yPercent * colorDepressed[1] +
        xPercent * yPercent * colorRelaxed[1] +
        (1 - xPercent) * (1 - yPercent) * colorAgitated[1] +
        xPercent * (1 - yPercent) * colorExcited[1],

      (1 - xPercent) * yPercent * colorDepressed[2] +
        xPercent * yPercent * colorRelaxed[2] +
        (1 - xPercent) * (1 - yPercent) * colorAgitated[2] +
        xPercent * (1 - yPercent) * colorExcited[2],
    ]

    // Convert to a CSS color
    const cssColor = "rgb(" + color.map((c) => Math.round(c)).join(",") + ")"

    return cssColor
  }

  function handleMouseMove(event) {
    const fieldRect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - fieldRect.left
    const y = event.clientY - fieldRect.top

    // Calculate percentages
    const xPercent = x / fieldRect.width
    const yPercent = y / fieldRect.height

    // Calculate glow
    const agitatedGlow = (1 - xPercent) * (1 - yPercent) // depressed is now bottom left
    const excitedGlow = xPercent * (1 - yPercent) // relaxed is now bottom right
    const depressedGlow = (1 - xPercent) * yPercent // agitated is now top left
    const relaxedGlow = xPercent * yPercent // excited is now top right

    // Apply glow to info boxes
    depressedRef.current.style.boxShadow = `0 0 ${
      50 * depressedGlow
    }px rgba(${colorDepressed.join(",")})`
    relaxedRef.current.style.boxShadow = `0 0 ${
      50 * relaxedGlow
    }px rgba(${colorRelaxed.join(",")})`
    agitatedRef.current.style.boxShadow = `0 0 ${
      50 * agitatedGlow
    }px rgba(${colorAgitated.join(",")})`
    excitedRef.current.style.boxShadow = `0 0 ${
      50 * excitedGlow
    }px rgba(${colorExcited.join(",")})`

    const glows = [depressedGlow, relaxedGlow, agitatedGlow, excitedGlow]

    let state
    if (xPercent < 0.33) {
      if (yPercent < 0.33) {
        state = "Agitated"
      } else if (yPercent < 0.67) {
        state = "Dispirited"
      } else {
        state = "Depressed"
      }
    } else if (xPercent < 0.67) {
      if (yPercent < 0.33) {
        state = "Active"
      } else if (yPercent < 0.67) {
        state = "Balanced"
      } else {
        state = "Pleased"
      }
    } else {
      if (yPercent < 0.33) {
        state = "Excited"
      } else if (yPercent < 0.67) {
        state = "Stressed"
      } else {
        state = "Relaxed"
      }
    }
    setCurrentState(state)

    const colorUnderCursor = getColor(xPercent, yPercent)
    mainInfoBoxRef.current.style.borderColor = colorUnderCursor

    updateCursor(colorUnderCursor)
  }

  const handleOnDismissClick = () => {
    console.log("dismiss")
    setNote("")
    dialogRef.current.close()
  }

  const handleTrackerFieldClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left // horizontal position within trackerField
    const y = event.clientY - rect.top // vertical position within trackerField

    let energyValue = (((rect.height - y) / rect.height) * 10).toFixed(2)
    let moodValue = ((x / rect.width) * 10).toFixed(2)

    // convert back to number
    energyValue = +energyValue
    moodValue = +moodValue

    setCurrentDate(new Date())
    setEnergy(energyValue)
    setMood(moodValue)
    dialogRef.current.showModal()
  }

  const saveState = () => {
    // Save the current state, mood, energy, and note here
    const saveData = {
      profile_id: "123e4567-e89b-12d3-a456-426614174000",
      timestamp: currentDate,
      mental_state: currentState,
      mood: mood,
      energy: energy,
      note: note,
    }

    supabase
      .from("entry")
      .insert([saveData])
      .then((data) => {
        console.log("success saving!", data)
      })

    dialogRef.current.close()
  }

  return (
    <div className="main-container">
      <h1>Mood and energy tracker</h1>
      <div className={styles["tracker-container"]}>
        <div
          onMouseMove={handleMouseMove}
          onClick={handleTrackerFieldClick}
          className={styles["tracker-field"]}
          ref={trackerFieldRef}
        >
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
      <div className={styles["info-main"]} ref={mainInfoBoxRef}>
        {stateMap[currentState].text}
        <div>Energy: {energy}</div>
        <div>Mood: {mood}</div>
      </div>
      <div className={styles["info-container"]}>
        <div ref={agitatedRef} className={styles["info-box"]}>
          <h2>Agitated</h2>
          <p>
            You're feeling restless or wound up. It's like you're "running on
            adrenaline," but you're not experiencing positive emotions. It might
            feel like you're going in circles without any resolution or
            progress.
          </p>
        </div>
        <div ref={depressedRef} className={styles["info-box"]}>
          <h2>Depressed</h2>
          <p>
            You're feeling down and don't have much energy. It's hard to muster
            the motivation to do things, even activities you usually enjoy. You
            might be feeling a sense of hopelessness or worthlessness.
          </p>
        </div>
        <div ref={relaxedRef} className={styles["info-box"]}>
          <h2>Relaxed</h2>
          <p>
            You're feeling peaceful and at ease. While you don't have a lot of
            physical energy, you're content. It's easy to rest and unwind, and
            you don't feel any pressing need to do anything.
          </p>
        </div>
        <div ref={excitedRef} className={styles["info-box"]}>
          <h2>Excited</h2>
          <p>
            You're full of life and bursting with positive energy. It feels like
            you could take on the world. You might find yourself laughing,
            dancing, or eagerly embarking on new activities.
          </p>
        </div>
      </div>
      <dialog className={styles["dialog"]} ref={dialogRef}>
        <h2>Would you like to save this state?</h2>
        <p>
          Date:{" "}
          <strong>{dayjs(currentDate).format("DD MMM YYYY, HH:mma")}</strong>
        </p>
        <p>
          Your current mood state is <strong>{currentState}</strong>.
        </p>
        <label>
          <small>Add a note if you want:</small>
          <br />
          <textarea onChange={(e) => setNote(e.target.value)} value={note} />
        </label>
        <div className={styles["dialog-buttons"]}>
          <button onClick={handleOnDismissClick}>Dismiss</button>
          <button className="submit" onClick={saveState}>
            Save
          </button>
        </div>
      </dialog>
    </div>
  )
}

export default Tracker
