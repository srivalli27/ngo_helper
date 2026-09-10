import { NavLink, Outlet } from "react-router-dom";
import { Calendar, PlusCircle, Users, Building2 } from "lucide-react";

export default function NgoDashboard() {
    return (
        <div className="dashboard-layout">
            <nav className="dashboard-nav">
                <NavLink to="/ngo-dashboard" end className={({ isActive }) => `dashboard-nav-item ${isActive ? "active" : ""}`}>
                    <Calendar size={16} /> Your Events
                </NavLink>
                <NavLink to="/ngo-dashboard/create" className={({ isActive }) => `dashboard-nav-item ${isActive ? "active" : ""}`}>
                    <PlusCircle size={16} /> Create Event
                </NavLink>
                <NavLink to="/ngo-dashboard/applicants" className={({ isActive }) => `dashboard-nav-item ${isActive ? "active" : ""}`}>
                    <Users size={16} /> Applicants & Approvals
                </NavLink>
                <NavLink to="/ngo-dashboard/profile" className={({ isActive }) => `dashboard-nav-item ${isActive ? "active" : ""}`}>
                    <Building2 size={16} /> Organization Profile
                </NavLink>
            </nav>
            <Outlet />
        </div>
    );
}
