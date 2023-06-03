import React, { useEffect, useRef, useState } from "react"
import dayjs from "dayjs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import cx from "classnames"
import styles from "./Charts.module.scss"

const DataTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className={styles["data-tooltip"]}>
        <h2 className="intro">{dayjs(data.date).format("DD MMM YYYY")}</h2>
        <h3 className="intro">{dayjs(data.date).format("hh:mm A")}</h3>

        <p className={styles["note"]}>{data.note && `"${data.note}"`}</p>
        <p className={styles["mood"]}>Mood: {data.mood}</p>
        <p className={styles["energy"]}>Energy: {data.energy}</p>
        <p className="intro">{data.mental_state}</p>
      </div>
    )
  }

  return null
}
const EditForm = ({ data, dialogRef }) => {
  const [note, setNote] = useState(data.note || "")
  const [mood, setMood] = useState(data.mood)
  const [energy, setEnergy] = useState(data.energy)
  const [mentalState, setMentalState] = useState(data.mental_state)

  useEffect(() => {
    setNote(data.note || "")
    setMood(data.mood)
    setEnergy(data.energy)
    setMentalState(data.mental_state)
  }, [data])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
  }

  return (
    <div className={styles["edit-form"]}>
      <form onSubmit={handleSubmit}>
        <h2 className="intro">{dayjs(data.date).format("DD MMM YYYY")}</h2>

        <label htmlFor="time">Time:</label>
        <h3 className="intro">{dayjs(data.date).format("hh:mm A")}</h3>

        <label htmlFor="note">Note:</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={styles["note"]}
        ></textarea>

        <label htmlFor="mood">Mood:</label>
        <input
          type="number"
          id="mood"
          value={mood}
          onChange={(e) => setMood(parseFloat(e.target.value))}
          step="0.01"
          min="0"
          max="10"
          className={styles["mood"]}
        />

        <label htmlFor="energy">Energy:</label>
        <input
          type="number"
          id="energy"
          value={energy}
          onChange={(e) => setEnergy(parseFloat(e.target.value))}
          step="0.01"
          min="0"
          max="10"
          className={styles["energy"]}
        />

        <label htmlFor="mentalState">Mental State:</label>
        <input
          type="text"
          id="mentalState"
          value={mentalState}
          onChange={(e) => setMentalState(e.target.value)}
          className="intro"
        />
        <div className={styles["button-group"]}>
          <button
            type="button"
            onClick={() => {
              dialogRef.current.close()
            }}
          >
            Cancel
          </button>
          <button className="submit" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
const MoodEnergyChart = ({ entries }) => {
  const [showMood, setShowMood] = useState(true)
  const [showEnergy, setShowEnergy] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editData, setEditData] = useState(null)

  const dialogRef = useRef(null)

  const data = entries.map((entry) => ({
    date: entry.timestamp,
    formattedDate: dayjs(entry.timestamp).format("MMM DD"),
    mood: entry.mood,
    energy: entry.energy,
    mental_state: entry.mental_state,
    note: entry.note,
  }))

  const handleChartClick = (data) => {
    if (!data || !data.activePayload) return
    const activeData = data.activePayload[0].payload
    setShowEditForm(true)
    dialogRef.current.showModal()
    setEditData(activeData)
  }

  return (
    <div className={styles["line-chart-wrapper"]}>
      {/* toggle for energy and mood view */}
      <div className={styles["line-chart__toggle"]}>
        <button
          onClick={() => setShowMood(!showMood)}
          className={cx(styles["line-chart__toggle-btn"], {
            [styles["line-chart__toggle-btn--active"]]: showMood,
          })}
        >
          Mood
        </button>
        <button
          onClick={() => setShowEnergy(!showEnergy)}
          className={cx(styles["line-chart__toggle-btn"], {
            [styles["line-chart__toggle-btn--active"]]: showEnergy,
          })}
        >
          Energy
        </button>
      </div>
      <div className={styles["line-chart-container"]}>
        <div className={styles["line-chart"]}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={data}
              onClick={handleChartClick}
              margin={{
                top: 5,
                right: 30,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" />
              <YAxis domain={[1, 10]} tickCount={10} />
              <Tooltip content={<DataTooltip />} />
              <Legend />

              <Line
                type="monotone"
                dataKey="mood"
                stroke="#8884d8"
                strokeWidth={showMood ? 2 : 0}
                dot={
                  showMood
                    ? {
                        stroke: "#8884d8",
                        strokeWidth: 2,
                        fill: "#fff",
                        r: 3,
                      }
                    : {
                        fill: "rgba(0,0,0,0.1)",
                        r: 2,
                      }
                }
                activeDot={{ r: 5 }}
                name="Mood"
              />

              <Line
                type="monotone"
                dataKey="energy"
                stroke="#82ca9d"
                strokeWidth={showEnergy ? 2 : 0}
                dot={
                  showEnergy
                    ? {
                        stroke: "#82ca9d",
                        strokeWidth: 2,
                        fill: "#fff",
                        r: 3,
                      }
                    : {
                        fill: "rgba(0,0,0,0.1)",
                        r: 2,
                      }
                }
                activeDot={{ r: 5 }}
                name="Energy"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <dialog ref={dialogRef}>
        {showEditForm && <EditForm data={editData} dialogRef={dialogRef} />}
      </dialog>
    </div>
  )
}

export default MoodEnergyChart
