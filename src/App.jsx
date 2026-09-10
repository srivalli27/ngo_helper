import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import Hero from "./components/Hero.jsx";
import { Login } from "./components/Login.jsx";
import { Register } from "./components/Register.jsx";
import { CreateEvent } from "./components/CreateEvent.jsx";
import Events from "./components/Events.jsx";
import VolunteerDashboard from "./components/VolunteerDashboard.jsx";
import VolunteerProfile from "./components/VolunteerProfile.jsx";
import AppliedEvents from "./components/AppliedEvents.jsx";
import PastEvents from "./components/PastEvents.jsx";
import NgoDashboard from "./components/NgoDashboard.jsx";
import NgoProfile from "./components/NgoProfile.jsx";
import NgoEvents from "./components/NgoEvents.jsx";
import Applicants from "./components/Applicants.jsx";
import "./App.css";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Hero />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/volunteer-dashboard"
                        element={
                            <ProtectedRoute allowedRole="volunteer">
                                <VolunteerDashboard />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Events />} />
                        <Route path="applied" element={<AppliedEvents />} />
                        <Route path="past" element={<PastEvents />} />
                        <Route path="profile" element={<VolunteerProfile />} />
                    </Route>
                    <Route
                        path="/ngo-dashboard"
                        element={
                            <ProtectedRoute allowedRole="ngo">
                                <NgoDashboard />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<NgoEvents />} />
                        <Route path="create" element={<CreateEvent />} />
                        <Route path="applicants" element={<Applicants />} />
                        <Route path="profile" element={<NgoProfile />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
