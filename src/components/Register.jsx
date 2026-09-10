import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { User, Building2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

function toArray(value) {
    if (Array.isArray(value)) return value;
    return (value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "volunteer",
        phone: "",
        location: "",
        bio: "",
        skills: "",
        interests: "",
        availability: "",
        description: "",
        causes: "",
        organization_type: "",
        website: "",
        contact_person: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    function handleNext(e) {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.role
        ) {
            setError("Please fill in all basic information fields");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Password and Confirm Password must match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password should be at least 6 characters long");
            return;
        }

        setError("");
        setStep(2);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formData.location) {
            setError("Location is required");
            return;
        }

        if (formData.role === "volunteer" && !formData.availability) {
            setError("Availability is required for volunteers");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        role: formData.role,
                        name: formData.name
                    }
                }
            });

            if (signUpError) {
                throw signUpError;
            }

            const user = data.user;

            if (!user) {
                throw new Error("User registration failed");
            }

            // Insert into user_roles
            const { error: roleError } = await supabase
                .from("user_roles")
                .insert({
                    id: user.id,
                    role: formData.role
                });

            if (roleError && !roleError.message.includes("duplicate key")) {
                console.error("USER ROLE ERROR:", roleError);
            }

            if (formData.role === "volunteer") {
                const { error: volunteerError } = await supabase
                    .from("volunteer_profiles")
                    .insert({
                        id: user.id,
                        full_name: formData.name,
                        phone: formData.phone,
                        location: formData.location,
                        bio: formData.bio,
                        skills: toArray(formData.skills),
                        interests: toArray(formData.interests),
                        availability: formData.availability
                    });

                if (volunteerError && !volunteerError.message.includes("duplicate key")) {
                    console.error("VOLUNTEER PROFILE ERROR:", volunteerError);
                }

                navigate("/volunteer-dashboard");
            } else {
                const { error: ngoError } = await supabase
                    .from("ngo_profiles")
                    .insert({
                        id: user.id,
                        organization_name: formData.name,
                        phone: formData.phone,
                        location: formData.location,
                        description: formData.description,
                        causes: toArray(formData.causes),
                        organization_type: formData.organization_type || "Nonprofit",
                        website: formData.website,
                        contact_person: formData.contact_person
                    });

                if (ngoError && !ngoError.message.includes("duplicate key")) {
                    console.error("NGO PROFILE ERROR:", ngoError);
                }

                navigate("/ngo-dashboard");
            }
        } catch (err) {
            console.error("REGISTRATION ERROR:", err);
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create your <em>account.</em></h1>
                    <p>Join the community to post drives or apply to local opportunities</p>
                </div>

                {/* Step indicator */}
                <div className="step-indicator">
                    <div className={`step-dot ${step === 1 ? "active" : "completed"}`}>1</div>
                    <div style={{ width: "40px", height: "2px", background: "var(--border-medium)" }} />
                    <div className={`step-dot ${step === 2 ? "active" : ""}`}>2</div>
                </div>

                {error && <div className="form-error">{error}</div>}

                {step === 1 && (
                    <form onSubmit={handleNext}>
                        <div className="form-group">
                            <label>I am registering as</label>
                            <div className="role-selector-grid">
                                <div
                                    className={`role-radio-card ${formData.role === "volunteer" ? "selected" : ""}`}
                                    onClick={() => setFormData({ ...formData, role: "volunteer" })}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="volunteer"
                                        checked={formData.role === "volunteer"}
                                        onChange={handleChange}
                                    />
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <User size={18} color="var(--color-primary)" />
                                        <span className="role-title">Volunteer</span>
                                    </div>
                                    <span className="role-subtitle">I want to discover and apply to local NGO drives.</span>
                                </div>

                                <div
                                    className={`role-radio-card ${formData.role === "ngo" ? "selected" : ""}`}
                                    onClick={() => setFormData({ ...formData, role: "ngo" })}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="ngo"
                                        checked={formData.role === "ngo"}
                                        onChange={handleChange}
                                    />
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <Building2 size={18} color="var(--color-primary)" />
                                        <span className="role-title">NGO / Trust</span>
                                    </div>
                                    <span className="role-subtitle">I represent an organization hosting community drives.</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{formData.role === "volunteer" ? "Full Name" : "Organization Name"}</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={formData.role === "volunteer" ? "e.g. Ananya Verma" : "e.g. Green Earth Foundation"}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "12px" }}>
                            Continue to Details <ArrowRight size={16} />
                        </button>
                    </form>
                )}

                {step === 2 && formData.role === "volunteer" && (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border-subtle)" }}>
                            <h3 style={{ fontSize: "1.25rem" }}>Volunteer Profile Details</h3>
                            <p style={{ fontSize: "0.825rem", color: "var(--color-text-muted)" }}>This info helps match you with events in your city.</p>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <div className="form-group">
                            <label>City / Location *</label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Location</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Pune">Pune</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Availability *</label>
                            <select
                                name="availability"
                                value={formData.availability}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Availability</option>
                                <option value="Weekdays">Weekdays</option>
                                <option value="Weekends">Weekends</option>
                                <option value="Flexible">Flexible</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Interests (comma separated)</label>
                            <input
                                type="text"
                                name="interests"
                                value={formData.interests}
                                onChange={handleChange}
                                placeholder="Environment, Education, Healthcare, Animals"
                            />
                        </div>

                        <div className="form-group">
                            <label>Skills (comma separated)</label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="Teaching, First Aid, Photography, Logistics"
                            />
                        </div>

                        <div className="form-group">
                            <label>Short Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Tell NGOs a little about yourself and why you like volunteering..."
                            />
                        </div>

                        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                            <button type="button" className="btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
                                <ArrowLeft size={16} /> Back
                            </button>
                            <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={loading}>
                                {loading ? "Creating Profile..." : "Complete Registration"}
                            </button>
                        </div>
                    </form>
                )}

                {step === 2 && formData.role === "ngo" && (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border-subtle)" }}>
                            <h3 style={{ fontSize: "1.25rem" }}>Organization Details</h3>
                            <p style={{ fontSize: "0.825rem", color: "var(--color-text-muted)" }}>Provide organization information for volunteer transparency.</p>
                        </div>

                        <div className="form-group">
                            <label>Contact Person</label>
                            <input
                                type="text"
                                name="contact_person"
                                value={formData.contact_person}
                                onChange={handleChange}
                                placeholder="e.g. Dr. Sunita Rao"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98123 45678"
                            />
                        </div>

                        <div className="form-group">
                            <label>Primary City / Location *</label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Location</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Pune">Pune</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Organization Type</label>
                            <select
                                name="organization_type"
                                value={formData.organization_type}
                                onChange={handleChange}
                            >
                                <option value="">Select Type</option>
                                <option value="Nonprofit">Nonprofit</option>
                                <option value="Trust">Trust</option>
                                <option value="Foundation">Foundation</option>
                                <option value="Community Group">Community Group</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Causes / Focus Areas (comma separated)</label>
                            <input
                                type="text"
                                name="causes"
                                value={formData.causes}
                                onChange={handleChange}
                                placeholder="Education, Healthcare, Environment"
                            />
                        </div>

                        <div className="form-group">
                            <label>Website URL</label>
                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://organization.org"
                            />
                        </div>

                        <div className="form-group">
                            <label>Organization Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Briefly describe your mission and community activities..."
                            />
                        </div>

                        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                            <button type="button" className="btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
                                <ArrowLeft size={16} /> Back
                            </button>
                            <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={loading}>
                                {loading ? "Registering NGO..." : "Complete Registration"}
                            </button>
                        </div>
                    </form>
                )}

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in here</Link>
                </div>
            </div>
        </div>
    );
}
