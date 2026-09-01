import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Hero from './components/Hero.jsx'
import { Login } from './components/login.jsx'
import { Register } from './components/Register.jsx'
import { CreateEvent } from './components/CreateEvent.jsx'
import Events from './components/Events.jsx'
import './App.css'

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/events" element={<Events/>}/>
        <Route path="/create-event" element={<CreateEvent/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
