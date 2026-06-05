import { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { supabase } from "../../database/supabase";
import routes from "../../router/routes";
import defaultAvatar from "../../assets/spider.webp";

export default function ProfilePage() {
  const { user, profile, loading } = useContext(UserContext);
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatar);

  useEffect(() => {
    if (!profile?.avatar_url) {
      setAvatarSrc(defaultAvatar);
      return;
    }

    
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(profile.avatar_url);

    setAvatarSrc(data.publicUrl);
  }, [profile]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg font-electro">
          Devi effettuare il login per vedere il profilo.
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg">Profilo non trovato.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex font-electro items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-base-200 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center gap-4">
          <img
            src={avatarSrc}
            alt="Avatar utente"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
          />

          <h1 className="text-3xl text-center">
            {profile?.username || "Profilo Utente"}
          </h1>
        </div>

        <div className="divider my-6"></div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-base-100 p-4 rounded-xl">
            <h2 className="text-sm font-bold opacity-70">Username</h2>
            <p>{profile?.username || "Non disponibile"}</p>
          </div>

          <div className="bg-base-100 p-4 rounded-xl">
            <h2 className="text-sm font-bold opacity-70">Nome</h2>
            <p>{profile?.first_name || "Non disponibile"}</p>
          </div>

          <div className="bg-base-100 p-4 rounded-xl">
            <h2 className="text-sm font-bold opacity-70">Cognome</h2>
            <p>{profile?.last_name || "Non disponibile"}</p>
          </div>

          <div className="bg-base-100 p-4 rounded-xl">
            <h2 className="text-sm font-bold opacity-70">Email</h2>
            <p>{user.email}</p>
          </div>

          <div className="bg-base-100 p-4 rounded-xl md:col-span-2">
            <h2 className="text-sm font-bold opacity-70">ID Utente</h2>
            <p className="break-all text-sm">{user.id}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to={`${routes.profile}/settings`}
            className="btn btn-primary px-8"
          >
            Modifica profilo
          </Link>
        </div>
      </div>

      <Outlet />
    </div>
  );
}