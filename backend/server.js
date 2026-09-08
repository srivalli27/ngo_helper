import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

let events = [
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
    ]

app.get("/api/events", (req, res) => {
    res.json(events);
});

app.post("/api/events", (req, res) => {
    events.push(req.body);

    res.status(201).json({
        
        message: "Event created successfully",
        event: req.body
    });
});

app.delete("/api/events/:id", (req, res) => {
    const id = Number(req.params.id);

    events = events.filter(event => event.id !== id);

    res.status(204).send();
});

app.listen(5000,()=>{
    console.log("Server is runnig at port 5000")
});