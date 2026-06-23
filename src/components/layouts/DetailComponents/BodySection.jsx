import { supabase } from "../../../database/supabase";
import { useState, useEffect } from "react";
import defaultAvatar from "../../../assets/spider.webp";

import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { FaComment, FaFlag, FaTrash, FaEdit } from "react-icons/fa";

export default function BodySection({ game, profile_id }) {
  if (!game?.id || !profile_id) {
    return <div className="text-white">Loading...</div>;
  }
  
  const [isFavourite, setIsFavourite] = useState(false);
  const [description, setDescription] = useState("");
  const [gameReviews, setGameReviews] = useState([]);
  const [rating, setRating] = useState(0);
  
  
  const [editReply, setEditReply] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyReview, setReplyReview] = useState(null);
  
  const [reportReview, setReportReview] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportText, setReportText] = useState("");
  
  const [editReview, setEditReview] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  
  const [votesUpdate, setVotesUpdate] = useState(false);
  
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // FETCH REVIEWS
  const get_reviews = async () => {
    const { data } = await supabase
    .from("reviews")
    .select(`
        *,
        profiles (username, avatar_url),
        review_replies (
          id,
          message,
          created_at,
          profile_id,
          profiles (username, avatar_url)
        ),
        review_votes (id, profile_id, vote_type)
      `)
      .eq("game_id", game.id)
      .order("created_at", { ascending: false });
      
      setGameReviews(data || []);
    };
    
    const get_favourite = async () => {
      const { data } = await supabase
      .from("favourites")
      .select("*")
      .eq("profile_id", profile_id)
      .eq("game_id", game.id);
      
      if (data?.length > 0) setIsFavourite(true);
    };
    
    useEffect(() => {
      get_reviews();
      get_favourite();
    }, [game, votesUpdate]);
    
    // ADD REVIEW
    const add_review = async () => {
      if (!description.trim()) return;
      
      const { data } = await supabase
      .from("reviews")
      .insert([
        {
          profile_id,
          game_id: game.id,
          game_name: game.name,
          description,
          rating,
        },
      ])
      .select(`
        *,
        profiles (username, avatar_url),
        review_replies (
          id,
          message,
          created_at,
          profile_id,
          profiles (username, avatar_url)
        ),
        review_votes (*)
      `)
        .single();
        
        if (data) {
          setGameReviews((prev) => [data, ...prev]);
          setDescription("");
          setRating(5);
        }
      };
      
      // DELETE
      const confirm_delete = async () => {
        await supabase.from("reviews").delete().eq("id", deleteTarget);
        setGameReviews((prev) => prev.filter((r) => r.id !== deleteTarget));
        setDeleteTarget(null);
      };
      
      // EDIT
      const update_review = async () => {
        await supabase
        .from("reviews")
        .update({
          description: editText,
          rating: editRating,
        })
        .eq("id", editReview);
        
        setGameReviews((prev) =>
          prev.map((r) =>
            r.id === editReview
        ? { ...r, description: editText, rating: editRating }
        : r
      )
    );
    
    setEditReview(null);
    setEditText("");
    setEditRating(5);
  };
  
  // REPLY
  const add_reply = async () => {
    if (!replyText.trim()) return;
    
    const { data } = await supabase
    .from("review_replies")
    .insert([
      {
        review_id: replyReview,
        profile_id,
        message: replyText,
      },
    ])
    .select(`
        id,
        message,
        created_at,
        profile_id,
        profiles (username, avatar_url)
      `)
      .single();
      
      if (data) {
        setGameReviews((prev) =>
          prev.map((r) =>
            r.id === replyReview
        ? { ...r, review_replies: [...(r.review_replies || []), data] }
        : r
      )
    );
  }
  
  setReplyText("");
  setReplyReview(null);
};


const delete_reply = async (reply_id, review_id) => {
  await supabase
  .from("review_replies")
  .delete()
  .eq("id", reply_id);
  
  
  setGameReviews((prev) =>
    prev.map((r) =>
      r.id === review_id
  ? {
    ...r,
    review_replies: r.review_replies.filter(
      (rep) => rep.id !== reply_id
    ),
  }
  : r
)
);
};


const update_reply = async () => {
  if (!editReplyText.trim()) return;
  
  const { error } = await supabase
  .from("review_replies")
  .update({ message: editReplyText })
  .eq("id", editReply);
  
  if (error) {
    console.log("Supabase error:", error);
    return;
  }
  
  setGameReviews((prev) =>
    prev.map((r) =>
      r.review_replies
  ? {
    ...r,
    review_replies: r.review_replies.map((rep) =>
      rep.id === editReply
    ? { ...rep, message: editReplyText }
    : rep
  ),
}
: r
)
);

setEditReply(null);
setEditReplyText("");
};


// VOTE
const voteReview = async (review_id, type) => {
  const { data: existing } = await supabase
  .from("review_votes")
  .select("*")
  .eq("review_id", review_id)
  .eq("profile_id", profile_id)
  .maybeSingle();
  
  if (existing) {
    if (existing.vote_type === type) {
      await supabase.from("review_votes").delete().eq("id", existing.id);
    } else {
      await supabase
      .from("review_votes")
      .update({ vote_type: type })
      .eq("id", existing.id);
    }
  } else {
    await supabase.from("review_votes").insert([
      { review_id, profile_id, vote_type: type },
    ]);
  }
  
  setVotesUpdate((v) => !v);
};

// REPORT
const send_report = async () => {
  const finalReason =
  reportReason === "other" ? reportText : reportReason;
  
  if (!finalReason.trim()) return;
  
  await supabase.from("review_reports").insert([
    {
      review_id: reportReview,
      profile_id,
      reason: finalReason,
    },
  ]);
  
  setReportReview(null);
  setReportReason("");
  setReportText("");
};

// FAV
const add_game = async () => {
  await supabase.from("favourites").insert([
    { profile_id, game_id: game.id, game_name: game.name },
  ]);
  setIsFavourite(true);
};

const remove_game = async () => {
  await supabase
  .from("favourites")
  .delete()
  .eq("profile_id", profile_id)
  .eq("game_id", game.id);
  
  setIsFavourite(false);
};

return (
  <section className="grid grid-cols-6 mt-10 px-10 font-electro">
  
  <div className="col-span-5 flex flex-col items-center">
  
  <p className="text-white text-xl mb-5">Reviews</p>
  
  
  {/* STARS */}
  <div className="flex gap-1 text-3xl mb-3">
  {[1, 2, 3, 4, 5].map((s) => (
    <button
    key={s}
    type="button"
    onClick={() => setRating(s)}
    className="text-yellow-400"
    >
    {rating >= s ? "★" : "☆"}
    </button>
  ))}
  </div>
  
  <textarea
  className="textarea w-1/2 mb-3"
  placeholder="Type your review"
  value={description}
  onChange={(e)=>setDescription(e.target.value)}
  />
  
  <button className="btn w-1/2 bg-nav-bluegray" onClick={add_review}>
  Send
  </button>
  
  {/* REVIEWS */}
  <div className="border border-white w-full max-w-3xl h-[500px] overflow-y-auto mt-4 p-3 text-white">
  
  {gameReviews.map((review)=>{
    
    const isOwner = review.profile_id === profile_id;
    
    const likes = review.review_votes?.filter(v=>v.vote_type==="like").length || 0;
    const dislikes = review.review_votes?.filter(v=>v.vote_type==="dislike").length || 0;
    
    return (
      <div key={review.id} className="border-b border-white p-4">
      
      <div className="flex justify-between items-center w-full">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
      <img
      className="w-10 h-10 rounded-full"
      src={
        review.profiles?.avatar_url
        ? supabase.storage.from("avatars")
        .getPublicUrl(review.profiles.avatar_url).data.publicUrl
        : defaultAvatar
      }
      />
      
      <span className="font-semibold">
      {review.profiles?.username}
      </span>
      </div>
      
      {/* RIGHT */}
      <span className="text-xs text-gray-400 whitespace-nowrap">
      {new Date(review.created_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
      {" • "}
      {new Date(review.created_at).toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      })}
      </span>
      </div>
      
      <div className="text-yellow-400 text-lg mt-1">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>
        {i < review.rating ? "★" : "☆"}
        </span>
      ))}
      </div>
      
      
      <p className="mt-2 text-gray-200">{review.description}</p>
      
      {/* VOTES */}
      <div className="flex gap-5 mt-2">
      <button onClick={()=>voteReview(review.id,"like")}>
      <FaThumbsUp /> {likes}
      </button>
      
      <button onClick={()=>voteReview(review.id,"dislike")}>
      <FaThumbsDown /> {dislikes}
      </button>
      </div>
      
      {/* ACTIONS */}
      <div className="flex gap-3 mt-2">
      
      {isOwner ? (
        <>
        <button
        onClick={()=>{
          setEditReview(review.id);
          setEditText(review.description);
          setEditRating(review.rating);
        }}
        className="text-yellow-400 flex gap-1"
        >
        <FaEdit /> Edit
        </button>
        
        <button onClick={()=>setDeleteTarget(review.id)} className="text-red-500 flex gap-1">
        <FaTrash /> Delete
        </button>
        </>
      ) : (
        <>
        <button onClick={()=>setReplyReview(review.id)} className="text-blue-400 flex gap-1">
        <FaComment /> Reply
        </button>
        
        <button onClick={()=>setReportReview(review.id)} className="text-red-400 flex gap-1">
        <FaFlag /> Report
        </button>
        </>
      )}
      
      </div>
      
      {/* EDIT BOX */}
      {editReview === review.id && (
        <div className="mt-3">
        <div className="flex gap-1 text-yellow-400 text-xl mb-2">
        {[1,2,3,4,5].map((s) => (
          <button key={s} onClick={() => setEditRating(s)}>
          {s <= editRating ? "★" : "☆"}
          </button>
        ))}
        </div>
        <textarea
        className="textarea w-full"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        />
        <div className="flex gap-3 mt-2">
        <button onClick={update_review} className="btn bg-yellow-500">
        Save
        </button>
        <button onClick={() => setEditReview(null)} className="btn">
        Cancel
        </button>
        </div>
        </div>
      )}
      
      
      {/* REPLY BOX */}
      {replyReview === review.id && (
        <div className="mt-3">
        <textarea
        className="textarea w-full"
        value={replyText}
        onChange={(e)=>setReplyText(e.target.value)}
        />
        <button onClick={add_reply} className="btn mt-2">
        Send
        </button>
        </div>
      )}
      
      {/* REPLIES */}
      {review.review_replies?.length > 0 && (
        <div className="ml-10 mt-3 space-y-3 border-l border-gray-600 pl-4">
        
        {review.review_replies.map((r) => (
          <div
          key={r.id}
          className="flex items-start gap-3 bg-white/5 p-2 rounded-md"
          >
          <img
          className="w-7 h-7 rounded-full mt-1"
          src={
            r.profiles?.avatar_url
            ? supabase.storage.from("avatars")
            .getPublicUrl(r.profiles.avatar_url).data.publicUrl
            : defaultAvatar
          }
          />
          
          <div className="flex flex-col">
          <span className="text-sm font-semibold">
          {r.profiles?.username || "User"}
          </span>
          <span className="text-sm text-gray-300">
          {r.message}
          </span>
          {r.profile_id === profile_id && (
            <div className="flex gap-2 mt-1 text-xs">
            <button
            onClick={() => {
              setEditReply(r.id);
              setEditReplyText(r.message);
            }}
            className="text-yellow-400 flex items-center gap-1"
            >
            <FaEdit /> Edit
            </button>
            <button
            onClick={() => delete_reply(r.id, review.id)}
            className="text-red-400 flex items-center gap-1"
            >
            <FaTrash /> Delete
            </button>
            {editReply === r.id && (
              <div className="mt-2">
              <textarea
              className="textarea w-full"
              value={editReplyText}
              onChange={(e) => setEditReplyText(e.target.value)}
              />
              
              <div className="flex gap-2 mt-2">
              <button onClick={update_reply} className="btn bg-yellow-500">
              Save
              </button>
              
              <button onClick={() => setEditReply(null)} className="btn">
              Cancel
              </button>
              </div>
              </div>
            )}
            </div>
          )}
          </div>
          </div>
        ))}
        </div>
      )}
      </div>
    );
  })}
  </div>
  </div>
  
  
  
  
  
  {/* FAV */}
  <div>
  {isFavourite ? (
    <FaHeart onClick={remove_game} className="text-red-500 text-3xl" />
  ) : (
    <FaRegHeart onClick={add_game} className="text-red-500 text-3xl" />
  )}
  </div>
  
  {/* REPORT MODAL */}
  {reportReview && (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-gray-900 border border-white p-6 rounded-md w-96 flex flex-col gap-3">
    <p className="text-white font-semibold">Report Review</p>
    <select
    value={reportReason}
    onChange={(e) => setReportReason(e.target.value)}
    className="select w-full text-white bg-gray-800"
    >
    <option value="">Select reason</option>
    <option value="spam">Spam</option>
    <option value="offensive">Offensive content</option>
    <option value="harassment">Harassment</option>
    <option value="fake">Fake review</option>
    <option value="other">Other</option>
    </select>
    {reportReason === "other" && (
      <textarea
      className="textarea w-full mt-2"
      placeholder="Write your reason..."
      value={reportText}
      onChange={(e) => setReportText(e.target.value)}
      />
    )}
    <div className="flex gap-3">
    <button className="btn bg-red-600 flex-1" onClick={send_report}>
    Send Report
    </button>
    <button className="btn flex-1" onClick={() => setReportReview(null)}>
    Cancel
    </button>
    </div>
    </div>
    </div>
  )}
  
  {/* DELETE CONFIRM MODAL */}
  {deleteTarget && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-900 p-6 rounded">
    <p className="text-white">Delete this review?</p>
    <div className="flex gap-3 mt-4">
    <button className="btn bg-red-600" onClick={confirm_delete}>
    Delete
    </button>
    <button className="btn" onClick={() => setDeleteTarget(null)}>
    Cancel
    </button>
    </div>
    </div>
    </div>
  )}
  
  </section>
);
}