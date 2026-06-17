import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import routes from "../../router/routes";
import { supabase } from "../../database/supabase";

export default function ProfileSettingsPage() {
  const { profile, updateProfile, getUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  useEffect(() => {
    if (!file) return;
    
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    
    return () => URL.revokeObjectURL(imageUrl);
  }, [file]);
  
  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert("Select a file before saving the avatar.");
      return;
    }
    
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert(`Avatar upload error: ${uploadError.message}`);
        return;
      }
      
      const { error: updateError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: profile.id,
          avatar_url: fileName,
        },
        { onConflict: "id" }
      );
      
      if (updateError) {
        console.error("Update error:", updateError);
        alert(`Profile update error: ${updateError.message}`);
        return;
      }
      
      if (getUser) {
        await getUser();
      }
      
      setFile(null);
      setPreview(null);
      
      alert("Avatar updated successfully!");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert(`Unexpected error: ${err.message || err}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      username: profile?.username || "",
    },
  });
  
  const onSubmit = async (data) => {
    const result = await updateProfile(data);
    
    if (!result?.error) {
      navigate(routes.profile);
    }
  };
  
  return (
    <div className="w-full h-full font-electro flex flex-col items-center justify-center px-4 space-y-8">
    
    <form
    onSubmit={handleSubmit(onSubmit)}
    className="bg-base-200 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4"
    >
    <h2 className="text-2xl text-center mb-4">Edit Profile</h2>
    
    <input
    type="text"
    placeholder="First Name"
    className="input input-bordered w-full"
    {...register("first_name", { required: true })}
    />
    
    {errors.first_name && (
      <p className="text-red-500">First name is required</p>
    )}
    
    <input
    type="text"
    placeholder="Last Name"
    className="input input-bordered w-full"
    {...register("last_name", { required: true })}
    />
    
    {errors.last_name && (
      <p className="text-red-500">Last name is required</p>
    )}
    
    <input
    type="text"
    placeholder="Username"
    className="input input-bordered w-full"
    {...register("username", {
      required: true,
      minLength: 3,
    })}
    />
    
    {errors.username && (
      <p className="text-red-500">Invalid username</p>
    )}
    
    <button className="btn btn-primary w-full mt-4">
    Save Changes
    </button>
    </form>
    
    <form
    onSubmit={handleAvatarSubmit}
    className="bg-base-200 p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4 flex flex-col items-center"
    >
    <h2 className="text-xl">Update Avatar</h2>
    
    <div className="flex flex-col items-center gap-2">
    <label
    htmlFor="avatar"
    className="btn btn-outline"
    >
    Choose File
    </label>
    
    <input
    id="avatar"
    type="file"
    accept="image/*"
    onChange={handleChange}
    className="hidden"
    disabled={isUploading}
    />
    
    <span className="text-sm">
    {file ? file.name : "No file chosen"}
    </span>
    </div>
    
    {preview && (
      <img
      src={preview}
      className="w-24 h-24 rounded-full object-cover"
      alt="preview"
      />
    )}
    
    <button
    type="submit"
    className="btn btn-primary"
    disabled={!file || isUploading}
    >
    {isUploading ? "Uploading..." : "Save Avatar"}
    </button>
    </form>
    </div>
  );
}