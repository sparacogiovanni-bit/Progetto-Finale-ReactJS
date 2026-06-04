import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import defaultAvatar from "../../assets/spider.webp";

export default function ProfilePage() {
  const { user, profile, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-electro">
          Devi effettuare il login per vedere il profilo.
        </p>
      </div>
    );
  }

  if (!profile) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <p className="text-lg">
        Profilo non trovato.
      </p>
    </div>
  );
}

  const avatarSrc = profile?.avatar_url || defaultAvatar;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto bg-base-200 rounded-xl shadow-xl p-8">

        <div className="flex flex-col items-center gap-4">
          <img
            src={avatarSrc}
            alt="Avatar utente"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
          />

          <h1 className="text-3xl font-electro">
            {profile?.username || "Profilo Utente"}
          </h1>
        </div>

        <div className="divider"></div>

        <div className="space-y-4">

          <div className="bg-base-100 p-4 rounded-lg">
            <h2 className="font-bold mb-1">Username</h2>
            <p>{profile?.username || "Non disponibile"}</p>
          </div>

          <div className="bg-base-100 p-4 rounded-lg">
            <h2 className="font-bold mb-1">Nome</h2>
            <p>{profile?.first_name || "Non disponibile"}</p>
          </div>

          <div className="bg-base-100 p-4 rounded-lg">
            <h2 className="font-bold mb-1">Cognome</h2>
            <p>{profile?.last_name || "Non disponibile"}</p>
          </div>

          <div className="bg-base-100 p-4 rounded-lg">
            <h2 className="font-bold mb-1">Email</h2>
            <p>{user.email}</p>
          </div>

          <div className="bg-base-100 p-4 rounded-lg">
            <h2 className="font-bold mb-1">ID Utente</h2>
            <p className="break-all">{user.id}</p>
          </div>

        </div>
      </div>
    </div>
  );
}