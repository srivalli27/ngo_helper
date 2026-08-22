import { Navbar } from './Navbar.jsx'
function Hero(){
    return(
        <>
        <Navbar/>
        <div className="hero">
            Connect. Volunteer. Make an Impact.
    
            <h1>Overview</h1>
            <p>This is a platform for coordinating volunteer efforts and creating positive change in our communities.</p>
            <button className="btn">Explore Opportunities</button>
        </div>
        <hr/>
        <div className="roles">
            <h1>What can you do?</h1>
            <div className="role-cards">
                <ul ><strong>Volunteer</strong>
                    <li>Find Events</li>
                    <li>Apply</li>
                    <li>Track Applications</li>
                </ul>
                <ul><strong>NGO</strong>
                    <li>Create Events</li>
                    <li>Manage Events</li>
                    <li>Track Volunteers</li>
                </ul>
            </div>
        </div>
        <hr/>
        
        <h3>NGO helpers in numbers</h3>
        <div className="history">
            <p>NGOs</p>
            <p>Volunteers</p>
            <p>Events</p>
        </div>
        <hr/>
        <h3>How it works?</h3>
        <div className="flow">
            <p>Discover</p>
            <p>Apply</p>
            <p>Participate</p>
        </div>
        <hr/>
        <div className="ready">
            <h4>Ready to help?</h4>
            <button className="btn">
                Register
            </button>
        </div>
        </>
    )

}
export default Hero;