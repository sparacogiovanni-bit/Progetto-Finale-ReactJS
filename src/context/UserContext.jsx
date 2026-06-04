import { createContext, useEffect, useState } from "react";
import { supabase } from "../database/supabase";

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        setProfile(null);
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      console.log("USER ID:", currentUser.id);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      console.log("PROFILE:", profileData);
      console.log("ERROR:", error);

      if (error) {
        console.error("Errore caricamento profilo:", error);
        setProfile(null);
        return;
      }

      setProfile(profileData);
    } catch (err) {
      console.error("Errore getUser:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    setUser(null);
    setProfile(null);
  };

  const signUp = async ({ email, password, metadata }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    return { data, error };
  };

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  };

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        login,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}