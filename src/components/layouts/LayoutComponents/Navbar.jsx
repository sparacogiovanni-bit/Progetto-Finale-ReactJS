import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaBars } from "react-icons/fa";
import routes from "../../../router/routes";
import { UserContext } from "../../../context/UserContext";
import { supabase } from "../../../database/supabase";
import defaultAvatar from "../../../assets/spider.webp";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatar);

  const navigate = useNavigate();
  const { user, profile, signOut } = useContext(UserContext);

  
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    const slug = search.toLowerCase().trim().replace(/\s+/g, "-");
    navigate(`/search/${slug}`);
    setSearch("");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    setProfileOpen(false);
    setMenuOpen(false);
  };

  const linkStyle =
    "inline-block px-3 py-2 rounded-lg hover:bg-gray-700 transition text-white font-electro";

  return (
    <nav className="bg-nav-bluegray text-white px-4 py-4 flex items-center justify-between gap-3 relative">
      <Link to="/" className="text-3xl font-electro">
        Reactor
      </Link>

      <div className="flex items-center gap-3 flex-1 justify-end">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              input input-bordered
              rounded-r-none
              w-full max-w-[140px]
              sm:max-w-xs
              bg-nav-bluegray
              text-white
              placeholder-white
              border-gray-700
              focus:outline-none
              font-electro
            "
          />
          <button
            type="submit"
            className="btn btn-square rounded-l-none bg-nav-bluegray border-gray-700 hover:bg-gray-700 text-white"
          >
            <FaSearch />
          </button>
        </form>

        {!user && (
          <ul className="hidden md:flex items-center gap-3 font-electro">
            <li>
              <Link to={routes.register} className={linkStyle}>
                Sign Up
              </Link>
            </li>
            <li>
              <Link to={routes.login} className={linkStyle}>
                Sign In
              </Link>
            </li>
          </ul>
        )}

        {user && (
          <div className="relative">
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="avatar cursor-pointer"
            >
              <div className="w-10 rounded-full">
                <img src={avatarSrc} alt="User Avatar" className="object-cover" />
              </div>
            </div>

            {profileOpen && (
              <div className="absolute right-0 top-12 bg-nav-bluegray border border-gray-700 rounded-lg shadow-lg w-40 z-50 overflow-hidden">
                <Link
                  to={routes.profile}
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-3 text-white font-electro hover:bg-gray-700 transition"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-white font-electro hover:bg-gray-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-nav-bluegray flex flex-col gap-2 p-4 md:hidden z-50 border-t border-gray-700">
          {!user ? (
            <>
              <Link
                to={routes.register}
                className={linkStyle}
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
              <Link
                to={routes.login}
                className={linkStyle}
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              <Link
                to={routes.profile}
                className={linkStyle}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-left px-3 py-2 rounded-lg hover:bg-gray-700 font-electro"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}