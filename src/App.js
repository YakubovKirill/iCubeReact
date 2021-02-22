import './App.css';
import React, {useState, useEffect} from "react"
import Axios from "axios"


function App() {
  const [mov_name, set_mov_name] = useState('')
  const [review, set_review] = useState('')
  const [movieRevList, setMovList] = useState([])
  const [userNameReg, setUserNameReg] = useState('')
  const [passwordReg, setPasswordReg] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [loginStatus, setLoginStatus] = useState('')

  Axios.defaults.withCredentials = true

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

  const register = () => {
    Axios.post('http://localhost:3001/register', {
      userName: userNameReg,
      password: passwordReg
    }).then((response) => {
      alert(response)
    })
  }

  const login = () => {
    Axios.post('http://localhost:3001/login', {
      userName: userName,
      password: password
    }).then((response) => {
      if (response.data.length > 0) setLoginStatus(response.data[0].username)
      else {
        setLoginStatus(response.data.message)
      }
    })
  }

  useEffect(() => {
    Axios.get('http://localhost:3001/login').then((response) => {
      if (response.data.loggedIn)
        setLoginStatus(response.data.user[0].username)
      else setLoginStatus('')
      //console.log(response)
    })
  }, [])

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
        <h2>Register</h2>
      <div className="form">
        <p>Nickname</p>
        <input type="text" name="nickname" onChange={(e) => {
          setUserNameReg(e.target.value)
        }}/>
        <p>Password</p>
        <input type="password" name="password" onChange={(e) => {
          setPasswordReg(e.target.value)
        }}/>
        <p></p>
        <button onClick={register}>Register</button>
      </div>

      <h2>Login</h2>
      <div className="form">
        <p>Nickname</p>
        <input type="text" name="login_nickname" onChange={(e) => {
          setUserName(e.target.value)
        }}/>
        <p>Password</p>
        <input type="password" name="login_password" onChange={(e) => {
          setPassword(e.target.value)
        }}/>
        <p></p>
        <button onClick={login}>Login</button>
      </div>
      <h2>{loginStatus}</h2>
    </div>
  );
}

export default App;
