import { useLoaderData, useNavigate } from "react-router";
import Header from "../components/layouts/DetailComponents/Header";
import { FaCircleArrowLeft } from "react-icons/fa6";
import BodySection from "../components/layouts/DetailComponents/BodySection";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function DetailPage() {
  const game = useLoaderData();
  const navigate = useNavigate();
  const { profile } = useContext(UserContext);

  return (
    <main
      className="relative min-h-screen bg-center bg-cover bg-fixed"    
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),url(${game.background_image})`,       
      }}
    >

      <FaCircleArrowLeft
        className="absolute top-6 left-[2%] text-4xl text-white cursor-pointer z-50"
        onClick={() => navigate(-1)}
      />

      <Header game={game} />

      {profile && <BodySection game={game} profile_id={profile.id} />}
    </main>
  );
}