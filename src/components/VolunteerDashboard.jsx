import { NavLink, Outlet } from "react-router-dom";
import { Compass, Clock, Award, User } from "lucide-react";

export default function VolunteerDashboard() {
    return (
        <div className="dashboard-layout">
            <nav className="dashboard-nav">
                <NavLink to="/volunteer-dashboard" end className={({ isActive }) => `dashboard-nav-item ${isActive ? "active" : ""}`}>
                    <Compass size={16} /> Available Events
                </NavLink>
                <NavLink to="/volunteer-dashboard/applied" className={({ isActive }) => `dashboard-nav-item ${isActive ? "active" : ""}`}>
                    <Clock size={16} /> Applied Events
                </NavLink>
                <NavLink to="/volunteer-dashboard/past" className={({ isActive }) => `dashboard-nav-item ${isActive ? "active" : ""}`}>
                    <Award size={16} /> Past Events
                </NavLink>
                <NavLink to="/volunteer-dashboard/profile" className={({ isActive }) => `dashboard-nav-item ${isActive ? "active" : ""}`}>
                    <User size={16} /> Profile
                </NavLink>
            </nav>
            <Outlet />
        </div>
    );
}
