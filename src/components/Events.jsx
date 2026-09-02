import { useState } from 'react';
import EventRow from './EventRow';
function Events({ events}){
    const [search,setSearch]=useState("")
    const [location,setLocation]=useState("all")
    const [category,setCategory]=useState("all")
    const [sort,setSort]=useState("none")
    const [appliedEvents,setAppliedEvents]=useState([])
  
    
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
                <EventRow key={event.id} event={event} onApply={handleApply} isApplied={appliedEvents.includes(event.id)} />
                
                ))}
            </tbody>
        </table>
        )};
        </>
    )
}
export default Events