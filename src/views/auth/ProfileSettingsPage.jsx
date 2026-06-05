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
      alert("Seleziona un file prima di salvare l'avatar.");
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
        alert(`Errore upload avatar: ${uploadError.message}`);
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
        alert(`Errore aggiornamento profilo: ${updateError.message}`);
        return;
      }

      
      if (getUser) {
        await getUser();
      }

      setFile(null);
      setPreview(null);

      alert("Avatar aggiornato con successo!");
    } catch (err) {
      console.error("Errore imprevisto:", err);
      alert(`Errore imprevisto: ${err.message || err}`);
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
        <h2 className="text-2xl text-center mb-4">Modifica Profilo</h2>

        <input
          type="text"
          placeholder="Nome"
          className="input input-bordered w-full"
          {...register("first_name", { required: true })}
        />
        {errors.first_name && (
          <p className="text-red-500">Nome obbligatorio</p>
        )}

        <input
          type="text"
          placeholder="Cognome"
          className="input input-bordered w-full"
          {...register("last_name", { required: true })}
        />
        {errors.last_name && (
          <p className="text-red-500">Cognome obbligatorio</p>
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
          <p className="text-red-500">Username non valido</p>
        )}

        <button className="btn btn-primary w-full mt-4">
          Salva Modifiche
        </button>
      </form>

      
      <form
        onSubmit={handleAvatarSubmit}
        className="bg-base-200 p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4 flex flex-col items-center"
      >
        <h2 className="text-xl">Aggiorna Avatar</h2>

        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full max-w-xs"
          onChange={handleChange}
          disabled={isUploading}
        />

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
          {isUploading ? "Caricamento..." : "Salva Avatar"}
        </button>
      </form>
    </div>
  );
}