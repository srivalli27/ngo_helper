import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchRole(currentUser) {
        if (!currentUser) {
            setRole(null);
            return;
        }

        try {
            const { data, error } = await supabase
                .from("user_roles")
                .select("role")
                .eq("id", currentUser.id)
                .maybeSingle();

            if (data?.role) {
                setRole(data.role);
                return;
            }

            // Fallback to metadata if set during sign up
            const metaRole = currentUser.user_metadata?.role;
            if (metaRole) {
                setRole(metaRole);
                return;
            }

            setRole(null);
        } catch (err) {
            console.error("ROLE FETCH ERROR:", err);
            setRole(currentUser.user_metadata?.role || null);
        }
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                fetchRole(currentUser).finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                fetchRole(currentUser);
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
        <AuthContext.Provider value={{ user, role, loading, logout, refetchRole: () => user && fetchRole(user) }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
