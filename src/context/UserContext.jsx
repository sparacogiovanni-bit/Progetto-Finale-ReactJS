import { createContext, useEffect, useState } from "react";
import { supabase } from "../database/supabase";

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    const currentUser = session.user;
    setUser(currentUser);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    setProfile(profileData || null);

    setLoading(false);
  };

  useEffect(() => {
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
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