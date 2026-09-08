import { Link } from 'react-router-dom';
export function Navbar(){
    return(
        <nav className = "navbar">
            <div className="navbar-logo">
                <Link to="/">NGO Helper</Link></div>
            <ul className = "navbar-links">
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/create-event">Create Event</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        </nav>
    );
}