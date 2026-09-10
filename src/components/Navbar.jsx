import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HeartHandshake, LogOut, Compass, UserCheck, ShieldCheck } from "lucide-react";

export function Navbar() {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <div className="navbar-logo-icon">
                    <HeartHandshake size={18} />
                </div>
                <Link to="/">NGO Helper</Link>
            </div>

            <ul className="navbar-links">
                {!user && (
                    <>
                        <li>
                            <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" className="btn-primary btn-sm">
                                Get Started
                            </Link>
                        </li>
                    </>
                )}

                {user && role === "volunteer" && (
                    <>
                        <li>
                            <span className="user-role-badge">
                                <span className="user-role-dot"></span>
                                Volunteer
                            </span>
                        </li>
                        <li>
                            <Link to="/volunteer-dashboard" className="btn-secondary btn-sm">
                                <Compass size={15} /> Dashboard
                            </Link>
                        </li>
                    </>
                )}

                {user && role === "ngo" && (
                    <>
                        <li>
                            <span className="user-role-badge">
                                <ShieldCheck size={13} />
                                NGO Partner
                            </span>
                        </li>
                        <li>
                            <Link to="/ngo-dashboard" className="btn-secondary btn-sm">
                                <Compass size={15} /> Dashboard
                            </Link>
                        </li>
                    </>
                )}

                {user && (
                    <li>
                        <button type="button" className="link-button" onClick={handleLogout} title="Log out">
                            <LogOut size={16} /> Logout
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}
