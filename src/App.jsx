import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Hero from './components/Hero.jsx'
import { Login } from './components/login.jsx'
import { Register } from './components/Register.jsx'
import './App.css'

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
