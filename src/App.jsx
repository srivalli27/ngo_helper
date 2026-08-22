import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Hero from './components/Hero.jsx'
import { Login } from './components/login.jsx'
import './App.css'

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero/>}/>
        <Route path="/login" element={<Login/>} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
