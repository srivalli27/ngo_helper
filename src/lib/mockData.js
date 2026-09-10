export const SAMPLE_EVENTS = [
    {
        id: 101,
        ngo_id: "sample-ngo-1",
        title: "Hussain Sagar Lake Cleanliness & Eco Drive",
        location: "Hyderabad",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        category: "Environment",
        spots: 25,
        remaining: 18,
        description: "Join us to restore lake bund greenery and clear plastic waste along the promenade. Gloves, tools & refreshments provided.",
        ngo_profiles: {
            organization_name: "Green Earth Foundation",
            location: "Hyderabad",
            contact_person: "Aarav Sharma"
        },
        applications: [
            { id: 1, status: "accepted", volunteer_id: "sample-vol-1" }
        ]
    },
    {
        id: 102,
        ngo_id: "sample-ngo-2",
        title: "Free Eye Screening & Diabetic Wellness Camp",
        location: "Bangalore",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        category: "Healthcare",
        spots: 15,
        remaining: 9,
        description: "Assisting doctors with patient registration, queue management, and basic eye test chart distribution in Whitefield area.",
        ngo_profiles: {
            organization_name: "Hope Healthcare Trust",
            location: "Bangalore",
            contact_person: "Dr. Sunita Rao"
        },
        applications: []
    },
    {
        id: 103,
        ngo_id: "sample-ngo-3",
        title: "Weekend English & Coding Workshop for Kids",
        location: "Chennai",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        category: "Education",
        spots: 12,
        remaining: 4,
        description: "Conducting interactive story sessions and basic Scratch coding tutorials for primary school students in T. Nagar.",
        ngo_profiles: {
            organization_name: "Bright Future Literacy",
            location: "Chennai",
            contact_person: "Ramesh Kumar"
        },
        applications: []
    },
    {
        id: 104,
        ngo_id: "sample-ngo-1",
        title: "Urban Sapling Plantation & Tree Drive",
        location: "Hyderabad",
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        category: "Environment",
        spots: 40,
        remaining: 32,
        description: "Planting 500 native saplings in Gachibowli park area. Need enthusiastic volunteers for digging, planting, and tagging.",
        ngo_profiles: {
            organization_name: "Green Earth Foundation",
            location: "Hyderabad",
            contact_person: "Aarav Sharma"
        },
        applications: []
    },
    {
        id: 105,
        ngo_id: "sample-ngo-4",
        title: "Stray Animal Shelter Care & Adoption Fair",
        location: "Hyderabad",
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        category: "Animals",
        spots: 20,
        remaining: 11,
        description: "Help groom, feed, and manage adoption booths for rescued dogs and cats at Jubilee Hills shelter grounds.",
        ngo_profiles: {
            organization_name: "Hyderabad Animal Rescue",
            location: "Hyderabad",
            contact_person: "Priya Nair"
        },
        applications: []
    },
    {
        id: 106,
        ngo_id: "sample-ngo-2",
        title: "Community Meal Distribution & Food Rescue",
        location: "Mumbai",
        date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        category: "Food",
        spots: 30,
        remaining: 22,
        description: "Distributing freshly cooked nutritious meals to daily wage worker shelters in Andheri East.",
        ngo_profiles: {
            organization_name: "Hope Healthcare Trust",
            location: "Mumbai",
            contact_person: "Dr. Sunita Rao"
        },
        applications: []
    }
];

export const SAMPLE_NGO_PROFILE = {
    organization_name: "Green Earth Foundation",
    contact_person: "Aarav Sharma",
    phone: "+91 98765 43210",
    location: "Hyderabad",
    organization_type: "Nonprofit",
    causes: ["Environment", "Community"],
    website: "https://greenearth.org",
    description: "Dedicated to urban afforestation, lake cleanup, and environmental awareness across Telangana."
};

export const SAMPLE_VOLUNTEER_PROFILE = {
    full_name: "Ananya Verma",
    phone: "+91 99887 76655",
    location: "Hyderabad",
    bio: "Passionate environmentalist and computer science student keen to contribute to community welfare and education.",
    skills: ["Teaching", "Public Speaking", "Event Planning", "First Aid"],
    interests: ["Environment", "Education", "Healthcare"],
    availability: "Weekends"
};
