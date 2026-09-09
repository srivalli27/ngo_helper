import { useState } from 'react';
import { supabase } from "../lib/supabaseClient";
export function Register(){
    /*const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [role,setRole] = useState("");*/
    const [error,setError] = useState("")
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:"",
        role:"",
    });
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };
    async function handleSubmit(e) {
    e.preventDefault();

    if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.role
    ) {
        setError("All fields are necessary");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        setError("Password and ConfirmPassword should be same");
        return;
    }

    setError("");

    try {
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password
        });

        if (error) {
            throw error;
        }

        const user = data.user;

        console.log("USER:", user);
console.log("SESSION:", data.session);
        if (!user) {
            throw new Error("User registration failed");
        }

        console.log("Auth user created:", user.id);

        const { error: roleError } = await supabase
            .from("user_roles")
            .insert({
                id: user.id,
                role: formData.role
            });

        if (roleError) {
            console.error("USER ROLE ERROR:", roleError);
            throw roleError;
        }

        console.log("Role inserted successfully");

        if (formData.role === "volunteer") {
            const { error: volunteerError } = await supabase
                .from("volunteer_profiles")
                .insert({
                    id: user.id,
                    full_name: formData.name
                });

            if (volunteerError) {
                console.error("VOLUNTEER PROFILE ERROR:", volunteerError);
                throw volunteerError;
            }

            console.log("Volunteer profile inserted successfully");

        } else {
            const { error: ngoError } = await supabase
                .from("ngo_profiles")
                .insert({
                    id: user.id,
                    organization_name: formData.name
                });

            if (ngoError) {
                console.error("NGO PROFILE ERROR:", ngoError);
                throw ngoError;
            }

            console.log("NGO profile inserted successfully");
        }

        console.log("Registration successful");

    } catch (error) {
        console.error("REGISTRATION ERROR:", error);
        setError(error.message);
    }
}
    return(
        <>
        <h3>Register</h3>
        <form onSubmit={ handleSubmit }>
        {error && <p>{error}</p>}
            <label>Name
                <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                />
            </label>
            <label> Email
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                />
            </label>
            <label>Password
                <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                />
            </label>
            
            <label> Confirm Password
                <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                />
            </label>
            
            <p>Role</p>
            <label>
                <input
                type="radio"
                name="role"
                value="volunteer"
                checked={formData.role === "volunteer"}
                onChange={handleChange}
                />
                Volunteer
            
            
                <input
                type="radio"
                name="role"
                value="ngo"
                checked={formData.role === "ngo"}
                onChange={handleChange}
                />
                NGO
            </label>
            <button type="submit">Register</button>

        </form>
        </>
    )
}