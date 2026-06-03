import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function RegisterPage() {
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const { signUp } = useContext(UserContext);
  const navigate = useNavigate();
  
  const onSubmit = async (user_data) => {
    setAuthError("");
    setSuccessMessage("");
    
    try {
      const { error } = await signUp({
        email: user_data.email,
        password: user_data.password,
        metadata: {
          first_name: user_data.first_name,
          last_name: user_data.last_name,
          username: user_data.username,
        },
      });
      
      if (error) {
        const messages = {
          "User already registered":
          "Esiste già un account con questa email.",
          "Password should be at least 6 characters":
          "La password deve avere almeno 6 caratteri.",
        };
        
        setAuthError(
          messages[error.message] ||
          "Si è verificato un errore durante la registrazione."
        );
        
        return;
      }
      
      setSuccessMessage("Registrazione completata con successo!");
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setAuthError("Si è verificato un errore.");
    }
  };
  
  return (
    <div className="hero flex-1 font-electro">
    <div className="card bg-base-200 w-full max-w-md shadow-xl">
    <div className="card-body">
    <h1 className="text-3xl font-bold text-center">
    Registrati
    </h1>
    
    <form
    className="flex flex-col gap-4"
    onSubmit={handleSubmit(onSubmit)}
    >
    <input
    className="input input-bordered w-full"
    placeholder="Nome"
    {...register("first_name", {
      required: "Nome obbligatorio",
    })}
    />
    
    {errors.first_name && (
      <span className="text-error text-sm">
      {errors.first_name.message}
      </span>
    )}
    
    <input
    className="input input-bordered w-full"
    placeholder="Cognome"
    {...register("last_name", {
      required: "Cognome obbligatorio",
    })}
    />
    
    {errors.last_name && (
      <span className="text-error text-sm">
      {errors.last_name.message}
      </span>
    )}
    
    <input
    className="input input-bordered w-full"
    placeholder="Username"
    {...register("username", {
      required: "Username obbligatorio",
      minLength: {
        value: 3,
        message: "Minimo 3 caratteri",
      },
    })}
    />
    
    {errors.username && (
      <span className="text-error text-sm">
      {errors.username.message}
      </span>
    )}
    
    <input
    className="input input-bordered w-full"
    type="email"
    placeholder="Email"
    {...register("email", {
      required: "Email obbligatoria",
    })}
    />
    
    {errors.email && (
      <span className="text-error text-sm">
      {errors.email.message}
      </span>
    )}
    
    <input
    className="input input-bordered w-full"
    type="password"
    placeholder="Password"
    {...register("password", {
      required: "Password obbligatoria",
      minLength: {
        value: 6,
        message: "Minimo 6 caratteri",
      },
    })}
    />
    
    {errors.password && (
      <span className="text-error text-sm">
      {errors.password.message}
      </span>
    )}
    
    {authError && (
      <div className="alert alert-error">
      <span>{authError}</span>
      </div>
    )}
    
    {successMessage && (
      <div className="alert alert-success">
      <span>{successMessage}</span>
      </div>
    )}
    
    <button type="submit" className="btn btn-primary">
    Registrati
    </button>
    
    <div className="text-center mt-2">
    <p className="text-sm mb-2">
    Hai già un account?
    </p>
    
    <Link
    to="/auth/login"
    className="
                  inline-block
                  px-3
                  py-2
                  rounded-lg
                  hover:bg-gray-700
                  transition
                  text-white
                "
    >
    Accedi
    </Link>
    </div>
    </form>
    </div>
    </div>
    </div>
  );
}