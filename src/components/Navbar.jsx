export function Navbar(){
    return(
        <>
        <nav className = "navbar">
            <div className="navbar-logo">NGO Helper</div>
            <ul className = "navbar-links">
                <li><a href="/">Login</a></li>
                <li><a href="/">Register</a></li>
            </ul>
        </nav>
        </>
    );
}