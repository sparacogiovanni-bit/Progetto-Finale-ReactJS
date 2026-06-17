import { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { supabase } from "../../database/supabase";
import routes from "../../router/routes";
import defaultAvatar from "../../assets/spider.webp";

export default function ProfilePage() {
  const { user, profile, loading } = useContext(UserContext);
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatar);
  const [userFavourites, setUserFavourites] = useState();

  const get_favourites = async () => {
    if (profile) {
      let { data: favourites, error } = await supabase
        .from("favourites")
        .select("*")
        .eq("profile_id", profile.id);

      setUserFavourites(favourites);
    }
  };

  useEffect(() => {
    if (!profile?.avatar_url) {
      setAvatarSrc(defaultAvatar);
    } else {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(profile.avatar_url);

      setAvatarSrc(data.publicUrl);
    }

    get_favourites();
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
          You must be logged in to view your profile.
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex font-electro items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-base-200 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center gap-4">
          <img
            src={avatarSrc}
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
          />

          <h1 className="text-3xl text-center">
            {profile?.username || "User Profile"}
          </h1>
        </div>

        <div className="divider my-6"></div>

        <section className="my-10">
          <h2 className="text-2xl text-center mb-6">Favorite Games</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userFavourites &&
              userFavourites.map((game) => (
                <div className="card bg-base-100 shadow-sm" key={game.id}>
                  <div className="card-body">
                    <h2 className="card-title">{game.game_name}</h2>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <div className="divider my-8"></div>

        <h2 className="text-2xl text-center mb-6">
          Profile Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-base-100 p-4 rounded-xl">
            <h2 className="text-sm font-bold opacity-70">Username</h2>
            <p>{profile?.username || "Not available"}</p>
          </div>

          <div className="bg-base-100 p-4 rounded-xl">
            <h2 className="text-sm font-bold opacity-70">First Name</h2>
            <p>{profile?.first_name || "Not available"}</p>
          </div>

          <div className="bg-base-100 p-4 rounded-xl">
            <h2 className="text-sm font-bold opacity-70">Last Name</h2>
            <p>{profile?.last_name || "Not available"}</p>
          </div>

          <div className="bg-base-100 p-4 rounded-xl">
            <h2 className="text-sm font-bold opacity-70">Email</h2>
            <p>{user.email}</p>
          </div>

          <div className="bg-base-100 p-4 rounded-xl md:col-span-2">
            <h2 className="text-sm font-bold opacity-70">User ID</h2>
            <p className="break-all text-sm">{user.id}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to={`${routes.profile}/settings`}
            className="btn btn-primary px-8"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      <Outlet />
    </div>
  );
}