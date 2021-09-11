import React, { useState } from 'react';

const Statistics = ({ good, neutral, bad }) => {
  const numberOfRatings = good + neutral + bad;
  const averageScore = () => (good - bad) / (good + neutral + bad);
  const positivePercentage = () => good / (good + neutral + bad) * 100;

  if (numberOfRatings) {
    return (
      <div>
        <h1>statistics</h1>
        good {good}<br />
        neutral {neutral}<br />
        bad {bad}<br />
        all {good + neutral + bad}<br />
        average {averageScore()}<br />
        positive {positivePercentage()}%<br />
      </div>
    );
  }

  return (
    <div>
      <h1>statistics</h1>
      No feedback given
    </div>
  )
}

const App = () => {
  // Save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const incrementGood = () => setGood(good + 1);
  const incrementNeutral = () => setNeutral(neutral + 1);
  const incrementBad = () => setBad(bad + 1);

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={incrementGood}>good</button>
      <button onClick={incrementNeutral}>neutral</button>
      <button onClick={incrementBad}>bad</button>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App;
