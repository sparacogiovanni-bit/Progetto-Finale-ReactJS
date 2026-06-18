import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { supabase } from "../../../database/supabase";
import { useState, useEffect } from "react";

export default function BodySection({ game, profile_id }) {
  const [isFavourite, setIsFavourite] = useState(false);
  const [description, setDescription] = useState();
  const [gameReviews, setGameReviews] = useState();
  const [checkReview, setCheckReview] = useState(false);

  const handle_description = (e) => {
    setDescription(e.target.value);
  };

  const get_reviews = async () => {
    let { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("game_id", game.id);

    setGameReviews(reviews);
  };

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
    get_reviews();
  }, [checkReview]);

  const add_review = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          profile_id,
          game_id: game.id,
          game_name: game.name,
          description,
        },
      ])
      .select();

    setDescription("");
    setCheckReview(!checkReview);
  };

  const add_game = async () => {
    const { data, error } = await supabase
      .from("favourites")
      .insert([
        {
          profile_id,
          game_id: game.id,
          game_name: game.name,
        },
      ])
      .select();

    setIsFavourite(true);
  };

  const remove_game = async () => {
    const { error } = await supabase
      .from("favourites")
      .delete()
      .eq("profile_id", profile_id)
      .eq("game_id", game.id);

    setIsFavourite(false);
  };

  return (
    <section className="grid font-electro grid-cols-6 mt-10 px-10">
      <div className="col-span-5 flex flex-col items-center">
        <p className="text-white text-xl mb-5">Reviews</p>

        <textarea
          className="textarea w-1/2 mb-3"
          placeholder="Type your review"
          onChange={handle_description}
          value={description}
        ></textarea>

        <button
          className="btn bg-nav-bluegray w-1/2"
          onClick={add_review}
        >
          Send
        </button>

        <div className="border border-white h-[200px] w-2/3 my-3 overflow-auto text-white">
          {gameReviews &&
            gameReviews.map((review) => {
              return (
                <p
                  key={review.id}
                  className="text-end my-3 mx-2 p-2 border border-white"
                >
                  {review.description}
                </p>
              );
            })}
        </div>
      </div>

      <div>
        {(isFavourite && (
          <FaHeart
            className="text-red-500 cursor-pointer text-3xl"
            onClick={remove_game}
          />
        )) || (
          <FaRegHeart
            className="text-red-500 cursor-pointer text-3xl"
            onClick={add_game}
          />
        )}
      </div>
    </section>
  );
}