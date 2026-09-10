import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Plus, Trash2, Users, MapPin, Calendar, RefreshCw } from "lucide-react";

export default function NgoEvents() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    async function fetchEvents() {
        if (!user) return;
        setLoading(true);
        setError("");

        try {
            const { data, error: fetchErr } = await supabase
                .from("events")
                .select("*, applications(id, status)")
                .eq("ngo_id", user.id)
                .order("date", { ascending: true });

            if (fetchErr) {
                console.error("Error fetching events:", fetchErr);
                setError(fetchErr.message);
                setLoading(false);
                return;
            }

            setEvents(data || []);
        } catch (err) {
            console.error("NGO EVENTS EXCEPTION:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvents();
    }, [user]);

    async function handleRemove(event) {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the event "${event.title}"?`
        );

        if (!confirmDelete) {
            return;
        }

        if (user) {
            const { error: deleteErr } = await supabase
                .from("events")
                .delete()
                .eq("id", event.id);

            if (deleteErr) {
                setError(deleteErr.message);
                return;
            }
        }

        setEvents((prev) => prev.filter((item) => item.id !== event.id));
    }

    return (
        <div className="events-page">
            <div className="page-header">
                <div>
                    <h1>Hosted <em>Events.</em></h1>
                    <p style={{ color: "var(--color-text-muted)" }}>Manage active community drives and volunteer capacity</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" className="btn-secondary btn-sm" onClick={fetchEvents}>
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <Link to="/ngo-dashboard/create" className="btn-primary">
                        <Plus size={16} /> Post New Event
                    </Link>
                </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            {loading ? (
                <div className="table-container" style={{ padding: "48px", textAlign: "center" }}>
                    <p style={{ color: "var(--color-text-muted)" }}>Loading events...</p>
                </div>
            ) : events.length === 0 ? (
                <div className="table-container" style={{ padding: "48px", textAlign: "center" }}>
                    <h3>No events posted yet</h3>
                    <p style={{ color: "var(--color-text-muted)", marginTop: "4px", marginBottom: "16px" }}>
                        Create your first community drive to start receiving volunteer applications.
                    </p>
                    <Link to="/ngo-dashboard/create" className="btn-primary">
                        <Plus size={16} /> Post New Event
                    </Link>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Needed</th>
                                <th>Accepted</th>
                                <th>Spots Left</th>
                                <th>Applicants</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => {
                                const accepted = (event.applications || []).filter(
                                    (application) => application.status === "accepted"
                                ).length;
                                const applicantsCount = (event.applications || []).filter(
                                    (application) => application.status !== "cancelled"
                                ).length;
                                const spotsLeft = Math.max(0, event.spots - accepted);

                                return (
                                    <tr key={event.id}>
                                        <td style={{ fontWeight: 700, color: "var(--color-primary)" }}>{event.title}</td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <MapPin size={13} color="var(--color-primary)" />
                                                {event.location}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Calendar size={13} />
                                                {event.date}
                                            </div>
                                        </td>
                                        <td><span className="tag-pill">{event.category}</span></td>
                                        <td><span className="spot-badge">{event.spots}</span></td>
                                        <td><span className="spot-badge" style={{ background: "var(--bg-mint)", color: "var(--color-mint-text)" }}>{accepted}</span></td>
                                        <td><span className="spot-badge">{spotsLeft}</span></td>
                                        <td>
                                            <Link to="/ngo-dashboard/applicants" style={{ fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                <Users size={13} /> {applicantsCount} view
                                            </Link>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                type="button"
                                                className="btn-secondary btn-sm"
                                                onClick={() => handleRemove(event)}
                                                style={{ color: "#B91C1C", borderColor: "#FECACA" }}
                                                title="Delete event"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
