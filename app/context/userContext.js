import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../_lib/supabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error fetching user:", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    getUser();
    return () => authListener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Error logging out:", err.message);
      throw err; // Rethrow the error to handle it in the calling function
    }
  };

  return (
    <UserContext.Provider value={{ user, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
