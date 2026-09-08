import { useState,useEffect } from 'react';
import EventRow from './EventRow';
function Events({ events,setEvents,ondelete }) {
    const [search,setSearch]=useState("")
    const [location,setLocation]=useState("all")
    const [category,setCategory]=useState("all")
    const [sort,setSort]=useState("none")
    const [appliedEvents,setAppliedEvents]=useState([])
  
    async function handleRemove(event) {
    const confirmDelete = window.confirm(
        `Are you sure you want to delete the event "${event.title}"?`
    );

    if (!confirmDelete) {
        console.log(`Event "${event.title}" deletion canceled.`);
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5000/api/events/${event.id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete event");
        }

        ondelete(event);

        console.log(`Event "${event.title}" has been deleted.`);

    } catch (error) {
        console.error("Error deleting event:", error);
    }
}
    function handleApply(event){
        if(!appliedEvents.includes(event.id)){
            console.log('Applied for '+event.title)
            setAppliedEvents([...appliedEvents, event.id])
        }
        else{
            setAppliedEvents(appliedEvents.filter(id => id !== event.id))
            console.log('Unapplied for '+event.title)
        }
        
    }
    
   

    


    useEffect(() => {
 
    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/events");
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    fetchEvents();
}, []);

    const filteredEvents = events.filter( (event)=> {
        const matchSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.ngo.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase()) ;

        const matchlocation =
        location==="all" || event.location===location;

        const matchCategory =
        category==="all" || event.category===category;

        

        return matchSearch && matchlocation && matchCategory
    });
    const sortedEvents = [...filteredEvents];
        if (sort === "date") {
            sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sort === "dateDesc") {
            sortedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sort === "spots") {
            sortedEvents.sort((a, b) => a.spots - b.spots);
        } else if (sort === "spotsDesc") {
            sortedEvents.sort((a, b) => b.spots - a.spots);
        }
    return(
        <>
        <div className="events-page">

        <h1>Volunteer Events</h1>
        
        <input type="text"
        placeholder="Search events.."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        />
        <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}>
            <option value="all">All Locations</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
        </select>

        <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Education">Education</option>
            <option value="Animals">Animals</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Environment">Environment</option>
            <option value="Community">Community</option>
            <option value="Food">Food</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="none">Sort by</option>
            <option value="date">Date: Earliest to Latest</option>
            <option value="dateDesc">Date: Latest to Earliest</option>
            <option value="spots">Spots: Fewest to Most</option>
            <option value="spotsDesc">Spots: Most to Fewest</option>
        </select>

        {sortedEvents.length===0?(
            <p>No events found</p>
        ):(
        <table>
            <thead>
            <tr>
            <th>Id</th>
            <th>Title</th>
            <th>NGO</th>
            <th>Location</th>
            <th>Date</th>
            <th>Category</th>
            <th>Spots</th>
            <th>Description</th>
            </tr>
            </thead>
            <tbody>
                {sortedEvents.map((event)=>(
                <EventRow key={event.id} event={event} onApply={handleApply} isApplied={appliedEvents.includes(event.id)} onRemove={handleRemove} />
                
                ))}
            </tbody>
        </table>
        )};
        </div>
        </>
    )
}
export default Events