import React, { useState } from 'react'

const Button = ({ text, onClickHandler }) => (
  <button onClick={onClickHandler}>{text}</button>
)

const StatisticsLine = ({ text, value, percentage }) => (
  <tr>
    <td>{text}</td>
    <td>{value} {percentage ? "%" : ""}</td>
  </tr>
)

StatisticsLine.defaultProps = {
  percentage: false
}

const Statistics = ({ votes }) => {
  const total = votes.good + votes.neutral + votes.bad
  const average = (votes.good - votes.bad) / total
  const positive = votes.good / total * 100

  if (total) {
    return (
      <>
        <h1>statistics</h1>
        <table>
          <tbody>
            <StatisticsLine text="good" value={votes.good} />
            <StatisticsLine text="neutral" value={votes.neutral} />
            <StatisticsLine text="bad" value={votes.bad} />
            <StatisticsLine text="all" value={total} />
            <StatisticsLine text="average" value={average} />
            <StatisticsLine text="positive" value={positive} percentage={true} />
          </tbody>
        </table>
      </>
    )
  }

  return (
    <>
      <h1>statistics</h1>
      <span>No feedback given</span>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const votes = {good, neutral, bad}

  const incrementGood = () => setGood(good + 1);
  const incrementNeutral = () => setNeutral(neutral + 1);
  const incrementBad = () => setBad(bad + 1);

  return (
    <>
      <h1>give feedback</h1>
      <Button text="good" onClickHandler={incrementGood} />
      <Button text="neutral" onClickHandler={incrementNeutral} />
      <Button text="bad" onClickHandler={incrementBad} />
      <Statistics votes={votes} />
    </>
  )
}

export default App
