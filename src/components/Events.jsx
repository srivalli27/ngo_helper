import { useState } from 'react';
import EventRow from './EventRow';
function Events(){
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
    
    const events = [
    {
        id: 1,
        title: "Beach Cleanup Drive",
        ngo: "Green Earth Foundation",
        location: "Hyderabad",
        date: "2026-09-05",
        category: "Environment",
        spots: 25
    },
    {
        id: 2,
        title: "Food Distribution Camp",
        ngo: "Helping Hands",
        location: "Chennai",
        date: "2026-09-07",
        category: "Food",
        spots: 40
    },
    {
        id: 3,
        title: "Tree Plantation Drive",
        ngo: "Eco Warriors",
        location: "Bangalore",
        date: "2026-09-10",
        category: "Environment",
        spots: 30
    },
    {
        id: 4,
        title: "Teaching for Underprivileged Children",
        ngo: "Bright Futures",
        location: "Hyderabad",
        date: "2026-09-12",
        category: "Education",
        spots: 15
    },
    {
        id: 5,
        title: "Clothes Donation Camp",
        ngo: "Care & Share",
        location: "Mumbai",
        date: "2026-09-14",
        category: "Community",
        spots: 20
    },
    {
        id: 6,
        title: "Animal Shelter Assistance",
        ngo: "Paws & Care",
        location: "Pune",
        date: "2026-09-15",
        category: "Animals",
        spots: 12
    },
    {
        id: 7,
        title: "Blood Donation Camp",
        ngo: "Life Savers Trust",
        location: "Hyderabad",
        date: "2026-09-18",
        category: "Healthcare",
        spots: 50
    },
    {
        id: 8,
        title: "River Cleanup Initiative",
        ngo: "Green Earth Foundation",
        location: "Bangalore",
        date: "2026-09-20",
        category: "Environment",
        spots: 35
    },
    {
        id: 9,
        title: "Digital Literacy Workshop",
        ngo: "Tech For All",
        location: "Chennai",
        date: "2026-09-21",
        category: "Education",
        spots: 18
    },
    {
        id: 10,
        title: "Community Kitchen",
        ngo: "Helping Hands",
        location: "Mumbai",
        date: "2026-09-23",
        category: "Food",
        spots: 30
    },
    {
        id: 11,
        title: "Old Age Home Visit",
        ngo: "Care & Share",
        location: "Pune",
        date: "2026-09-25",
        category: "Community",
        spots: 10
    },
    {
        id: 12,
        title: "School Supplies Collection",
        ngo: "Bright Futures",
        location: "Hyderabad",
        date: "2026-09-26",
        category: "Education",
        spots: 22
    },
    {
        id: 13,
        title: "Street Animal Vaccination Camp",
        ngo: "Paws & Care",
        location: "Chennai",
        date: "2026-09-28",
        category: "Animals",
        spots: 16
    },
    {
        id: 14,
        title: "Health Awareness Camp",
        ngo: "Life Savers Trust",
        location: "Bangalore",
        date: "2026-09-29",
        category: "Healthcare",
        spots: 28
    },
    {
        id: 15,
        title: "Park Restoration Project",
        ngo: "Eco Warriors",
        location: "Mumbai",
        date: "2026-10-01",
        category: "Environment",
        spots: 24
    },
    {
        id: 16,
        title: "Meal Distribution for Homeless",
        ngo: "Helping Hands",
        location: "Pune",
        date: "2026-10-03",
        category: "Food",
        spots: 45
    },
    {
        id: 17,
        title: "Career Guidance Session",
        ngo: "Bright Futures",
        location: "Chennai",
        date: "2026-10-05",
        category: "Education",
        spots: 20
    },
    {
        id: 18,
        title: "Animal Rescue Support",
        ngo: "Paws & Care",
        location: "Hyderabad",
        date: "2026-10-07",
        category: "Animals",
        spots: 14
    }
    ];
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