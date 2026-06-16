import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { supabase } from "../../../database/supabase";
import { useState, useEffect } from "react";

export default function BodySection({ game, profile_id }) {
  const [isFavourite, setIsFavourite] = useState(false);

  const get_favourite = async () => {
    let { data: favourites, error } = await supabase
      .from("favourites")
      .select("*")
      .eq("profile_id", profile_id)
      .eq("game_id", game.id);

    if (favourites.length > 0) setIsFavourite(true);
  };

  useEffect(() => {
    get_favourite();
  }, []);

  const add_game = async () => {
    const { data, error } = await supabase
      .from("favourites")
      .insert({
        profile_id,
        game_id: game.id,
        game_name: game.name,
      })
      .select();

    if (!error) {
      setIsFavourite(true);
    }

    console.log(data, error);
  };

  const remove_game = async () => {
    const { error } = await supabase
      .from("favourites")
      .delete()
      .eq("profile_id", profile_id)
      .eq("game_id", game.id);

    if (!error) {
      setIsFavourite(false);
    }

    console.log(error);
  };

  return (
    <section className="grid grid-cols-6 mt-10 px-10">
      <div className="col-span-5 flex flex-col items-center">
        <p className="text-white text-xl mb-5">Reviews</p>

        <textarea
          className="textarea w-1/2"
          placeholder="Type your review"
        ></textarea>
      </div>

      <div>
        {isFavourite ? (
          <FaHeart
            className="text-red-500 cursor-pointer text-3xl"
            onClick={remove_game}
          />
        ) : (
          <FaRegHeart
            className="text-red-500 cursor-pointer text-3xl"
            onClick={add_game}
          />
        )}
      </div>
    </section>
  );
}