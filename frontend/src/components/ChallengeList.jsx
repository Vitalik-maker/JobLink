import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ChallengeList() {
  const [challenges, setChallenges] = useState([]);
  useEffect(() => {
    axios.get('/api/challenges/').then(res => setChallenges(res.data));
  }, []);
  return (
    <div className="container mt-4">
      <h1>GreenQuest Challenges</h1>
      {challenges.map(c => (
        <div key={c.id} className="card mb-3">
          <div className="card-body">
            <h5>{c.title}</h5>
            <p>{c.description}</p>
            <p><strong>{c.points} pts</strong> | {c.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
