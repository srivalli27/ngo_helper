import { useState } from 'react'
import { Navbar } from './components/Navbar.jsx'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Hero from './components/Hero.jsx'
import { Login } from './components/Login.jsx'
import { Register } from './components/Register.jsx'
import { CreateEvent } from './components/CreateEvent.jsx'
import { ApiPractice } from './components/ApiPractice.jsx'
import Events from './components/Events.jsx'
import VolunteerDashboard from './components/VolunteerDashboard.jsx'
import NgoDashboard from './components/NgoDashboard.jsx'
import './App.css'
 
function App() {
  
   const [events, setEvents] = useState([]);

    function handleDeleteEvent(event) {
    setEvents(events.filter(e => e.id !== event.id));
}
  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Hero/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/events" element={<Events events={events} ondelete={handleDeleteEvent} setEvents={setEvents}/>}/>
        <Route path="/create-event" element={<CreateEvent />}/>
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/ngo-dashboard" element={<NgoDashboard />} />
        <Route path="/api-practice" element={<ApiPractice/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
