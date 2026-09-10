import { Link } from "react-router-dom";
import { ArrowRight, Info, CheckCircle2, HeartHandshake, Users, Calendar, ShieldCheck } from "lucide-react";

function Hero() {
    return (
        <div className="home-page">
            {/* HERO MAIN BANNER */}
            <div className="hero-section">
                <div className="hero-left">
                    <div className="hero-kicker-badge">
                        <span className="hero-kicker-line"></span>
                        <span>Purpose-Driven Matchmaking</span>
                    </div>

                    <h1 className="hero-title">
                        Connecting volunteers with <em>real impact.</em>
                    </h1>

                    <p className="hero-description">
                        NGO Helper is a calm, direct bridge between passionate volunteers and registered non-profits — replacing chaotic chats with clear, location-matched event coordination.
                    </p>

                    <div className="hero-actions">
                        <Link to="/register" className="btn-primary">
                            Explore Opportunities <ArrowRight size={16} />
                        </Link>
                        <Link to="/login" className="btn-secondary">
                            Sign In
                        </Link>
                    </div>

                    {/* RetinaScreen Alert Pill */}
                    <div className="hero-alert-banner">
                        <Info className="hero-alert-icon" />
                        <div>
                            <strong>Direct matching, not guesswork.</strong> NGO Helper filters opportunities by your exact city and schedule to ensure every hour you give counts.
                        </div>
                    </div>
                </div>

                {/* HERO RIGHT VISUAL */}
                <div className="hero-visual-card">
                    <div className="hero-visual-header">
                        <span className="hero-visual-tag">• Active Community Overview</span>
                        <ShieldCheck size={18} color="var(--color-mint-text)" />
                    </div>

                    <div className="hero-image-wrapper">
                        <img
                            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80"
                            alt="Volunteers planting saplings and collaborating"
                        />
                        <div className="hero-image-overlay" />
                        
                        <div className="hero-floating-pill top-right">
                            <span className="user-role-dot"></span> Verified NGO
                        </div>

                        <div className="hero-floating-pill bottom-left">
                            <CheckCircle2 size={13} color="var(--color-mint-text)" /> Human In The Loop
                        </div>
                    </div>

                    <div className="hero-stats-grid">
                        <div className="hero-stat-box">
                            <div className="hero-stat-num">50+</div>
                            <div className="hero-stat-lbl">Active NGOs</div>
                        </div>
                        <div className="hero-stat-box">
                            <div className="hero-stat-num">1,200+</div>
                            <div className="hero-stat-lbl">Volunteers</div>
                        </div>
                        <div className="hero-stat-box">
                            <div className="hero-stat-num">340+</div>
                            <div className="hero-stat-lbl">Events Completed</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ROLE BREAKDOWN CARDS */}
            <div className="section-grid">
                <div className="info-card">
                    <div className="info-card-header">
                        <div className="info-card-icon">
                            <Users size={20} />
                        </div>
                        <div>
                            <h3>For Volunteers</h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Find meaningful causes near you</p>
                        </div>
                    </div>
                    <ul className="info-card-list">
                        <li>Location & availability matching (Weekdays / Weekends)</li>
                        <li>1-Click application to local NGO initiatives</li>
                        <li>Real-time application status updates</li>
                        <li>Verified volunteer history & impact portfolio</li>
                    </ul>
                </div>

                <div className="info-card">
                    <div className="info-card-header">
                        <div className="info-card-icon">
                            <HeartHandshake size={20} />
                        </div>
                        <div>
                            <h3>For NGOs & Trusts</h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Mobilize dedicated local volunteers</p>
                        </div>
                    </div>
                    <ul className="info-card-list">
                        <li>Create & manage events with precise volunteer capacity</li>
                        <li>Review candidate profiles, skills & past volunteer work</li>
                        <li>Accept or decline applicants with spot validation</li>
                        <li>Track completed events and build a trusted volunteer pool</li>
                    </ul>
                </div>
            </div>

            {/* 3-STEP WORKFLOW */}
            <div className="how-it-works-section">
                <h2>How NGO Helper <em>works.</em></h2>
                <div className="how-it-works-steps">
                    <div className="step-card">
                        <div className="step-number">01</div>
                        <div className="step-title">Register & Profile</div>
                        <div className="step-desc">Sign up as a Volunteer or NGO. Select your city, availability, skills, or organization focus.</div>
                    </div>
                    <div className="step-card">
                        <div className="step-number">02</div>
                        <div className="step-title">Discover & Apply</div>
                        <div className="step-desc">Browse local drives tailored to your schedule. NGOs review applicant profiles and past work.</div>
                    </div>
                    <div className="step-card">
                        <div className="step-number">03</div>
                        <div className="step-title">Participate & Grow</div>
                        <div className="step-desc">Join approved events on ground, make a tangible difference, and build your volunteer history.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
