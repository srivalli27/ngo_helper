import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import EventRow from "./EventRow";
import { SAMPLE_EVENTS, SAMPLE_VOLUNTEER_PROFILE } from "../lib/mockData";
import { Search, Filter, Compass, MapPin, Sparkles } from "lucide-react";

function matchesAvailability(eventDate, availability) {
    if (!availability || availability === "Flexible") {
        return true;
    }

    const day = new Date(eventDate).getDay();
    const isWeekend = day === 0 || day === 6;

    if (availability === "Weekends") {
        return isWeekend;
    }

    if (availability === "Weekdays") {
        return !isWeekend;
    }

    return true;
}

function Events() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [profile, setProfile] = useState(null);
    const [appliedEvents, setAppliedEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("all");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("none");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            let currentProfile = SAMPLE_VOLUNTEER_PROFILE;

            if (user) {
                const { data: volunteer, error: profileError } = await supabase
                    .from("volunteer_profiles")
                    .select("*")
                    .eq("id", user.id)
                    .maybeSingle();

                if (volunteer) {
                    currentProfile = volunteer;
                }
            }

            setProfile(currentProfile);

            const today = new Date().toISOString().split("T")[0];

            let fetchedEvents = [];

            if (user) {
                const { data: eventData, error: eventError } = await supabase
                    .from("events")
                    .select("*, ngo_profiles(organization_name), applications(id, status, volunteer_id)")
                    .gte("date", today);

                if (!eventError && eventData && eventData.length > 0) {
                    fetchedEvents = eventData;
                }

                const { data: applicationData } = await supabase
                    .from("applications")
                    .select("event_id")
                    .eq("volunteer_id", user.id)
                    .neq("status", "cancelled");

                if (applicationData) {
                    setAppliedEvents(applicationData.map((a) => a.event_id));
                }
            }

            // Fallback to sample events if database has no events yet
            if (fetchedEvents.length === 0) {
                fetchedEvents = SAMPLE_EVENTS;
            }

            const withRemaining = fetchedEvents.map((event) => {
                const accepted = (event.applications || []).filter(
                    (application) => application.status === "accepted"
                ).length;

                const spots = event.spots || 20;
                const remaining = typeof event.remaining === "number" ? event.remaining : (spots - accepted);

                return {
                    ...event,
                    spots,
                    remaining
                };
            });

            setEvents(withRemaining);
            setLoading(false);
        }

        fetchData();
    }, [user]);

    async function handleApply(event) {
        if (appliedEvents.includes(event.id)) {
            return;
        }

        if (user) {
            const { data: existing } = await supabase
                .from("applications")
                .select("id, status")
                .eq("event_id", event.id)
                .eq("volunteer_id", user.id)
                .maybeSingle();

            if (existing) {
                await supabase
                    .from("applications")
                    .update({ status: "applied" })
                    .eq("id", existing.id);
            } else {
                await supabase
                    .from("applications")
                    .insert({
                        event_id: event.id,
                        volunteer_id: user.id,
                        status: "applied"
                    });
            }
        }

        setAppliedEvents([...appliedEvents, event.id]);

        // Optimistically update spots remaining in state
        setEvents(events.map((e) => e.id === event.id ? { ...e, remaining: Math.max(0, e.remaining - 1) } : e));
    }

    const filteredEvents = events.filter((event) => {
        const ngoName = event.ngo_profiles?.organization_name || "";
        const matchSearch =
            event.title.toLowerCase().includes(search.toLowerCase()) ||
            ngoName.toLowerCase().includes(search.toLowerCase()) ||
            event.location.toLowerCase().includes(search.toLowerCase());

        const matchLocation = location === "all" || event.location.toLowerCase() === location.toLowerCase();
        const matchCategory = category === "all" || event.category === category;
        const matchAvailability = matchesAvailability(event.date, profile?.availability);

        return matchSearch && matchLocation && matchCategory && matchAvailability;
    });

    const sortedEvents = [...filteredEvents];
    if (sort === "date") {
        sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sort === "dateDesc") {
        sortedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === "spots") {
        sortedEvents.sort((a, b) => a.remaining - b.remaining);
    } else if (sort === "spotsDesc") {
        sortedEvents.sort((a, b) => b.remaining - a.remaining);
    }

    return (
        <div className="events-page">
            <div className="page-header">
                <div>
                    <h1>Available <em>Opportunities.</em></h1>
                    <p style={{ color: "var(--color-text-muted)" }}>Explore local NGO drives matching your city and schedule</p>
                </div>
            </div>

            {/* Recommendation banner */}
            <div className="match-notice-banner">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sparkles size={16} />
                    <span>
                        Showing events matched for <strong>{profile?.location || "Hyderabad"}</strong> ({profile?.availability || "Weekends"} availability).
                    </span>
                </div>
                {location !== "all" && (
                    <button type="button" className="btn-secondary btn-sm" onClick={() => setLocation("all")} style={{ background: "#FFFFFF" }}>
                        View All Cities
                    </button>
                )}
            </div>

            {/* Search & Filter Toolbar */}
            <div className="filter-bar">
                <div style={{ position: "relative" }}>
                    <input
                        type="text"
                        placeholder="Search drives, NGOs, or locations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>

                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option value="all">All Locations</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                </select>

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="all">All Categories</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Environment">Environment</option>
                    <option value="Animals">Animals</option>
                    <option value="Food">Food</option>
                    <option value="Community">Community</option>
                </select>

                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="none">Sort Options</option>
                    <option value="date">Date: Earliest First</option>
                    <option value="dateDesc">Date: Latest First</option>
                    <option value="spots">Spots: Fewest Left</option>
                    <option value="spotsDesc">Spots: Most Left</option>
                </select>
            </div>

            {/* Table layout */}
            {sortedEvents.length === 0 ? (
                <div className="table-container" style={{ padding: "48px", textAlign: "center" }}>
                    <Compass size={32} color="var(--color-text-light)" style={{ marginBottom: "12px" }} />
                    <h3>No matching drives found</h3>
                    <p style={{ color: "var(--color-text-muted)", marginTop: "4px" }}>Try clearing search or changing location filter.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Event & Description</th>
                                <th>NGO Partner</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Capacity</th>
                                <th>Spots Left</th>
                                <th style={{ textAlign: "right" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedEvents.map((event) => (
                                <EventRow
                                    key={event.id}
                                    event={event}
                                    onApply={handleApply}
                                    isApplied={appliedEvents.includes(event.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Events;
