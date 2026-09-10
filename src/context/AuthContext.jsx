import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchRole(userId) {
        const { data, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("ROLE ERROR:", error);
            setRole(null);
            return;
        }

        setRole(data.role);
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                fetchRole(currentUser.id).finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                fetchRole(currentUser.id);
            } else {
                setRole(null);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    async function logout() {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
    }

    return (
        <AuthContext.Provider value={{ user, role, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
