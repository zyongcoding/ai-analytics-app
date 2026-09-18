import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [rooms, setRooms] = useState('')
  const [age, setAge] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState('')

  const handlePredict = async (e) => {
    e.preventDefault()
    setError('')
    setPrediction(null)

    try {
      // Send request to your Dockerised backend
      const response = await axios.post('http://localhost:8080/predict', {
        rooms: parseInt(rooms),
        age_years: parseInt(age)
      })
      setPrediction(response.data.predicted_price)
    } catch (err) {
      setError('Failed to fetch prediction. Is the Docker container running?')
    }
  }

  return (
    <div className="card">
      <h2>AI Property Analytics</h2>
      <form onSubmit={handlePredict}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Number of Rooms: </label>
          <input 
            type="number" 
            value={rooms} 
            onChange={(e) => setRooms(e.target.value)} 
            required 
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Property Age (Years): </label>
          <input 
            type="number" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Run Prediction Model</button>
      </form>

      {prediction && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#e0ffe0', color: '#000' }}>
          <h3>Predicted Value: ${prediction.toLocaleString()}</h3>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default App