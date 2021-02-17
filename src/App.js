import './App.css';
import React, {useState, useEffect} from "react"
import Axios from "axios"


function App() {
  const [mov_name, set_mov_name] = useState('')
  const [review, set_review] = useState('')
  const [movieRevList, setMovList] = useState([])

  useEffect(() => {
    Axios.get('http://localhost:3001/api/get').then((response) => {
      setMovList(response.data)
    })
  }, [])

  const submit_review = () => {
    Axios.post('http://localhost:3001/api/insert', {
      movie_name: mov_name,
      movie_review: review
    }).then(() => {
      alert('successfuly')
    })
  }

  return (
    <div className="App">
      <h1>CRUD App</h1>
      <div className="form">
        <p>Film</p>
        <input type="text" name="film" onChange={(e) => {
          set_mov_name(e.target.value)
        }}/>
        <p>Review</p>
        <input type="text" name="review" onChange={(e) => {
          set_review(e.target.value)
        }}/>
        <p></p>
        <button onClick={submit_review}>Submit</button>

        {movieRevList.map((val) => {
          return <ul key={val.id}>Movie name: {val.movie_name} | Movie review: {val.movie_review}</ul>
        })}
      </div>
    </div>

    
  );
}

export default App;
