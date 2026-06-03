import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";

export default function LoginPage() {
  const [authError, setAuthError] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  
  const onSubmit = async (user_data) => {
    setAuthError("");
    
    try {
      const { error } = await login({
        email: user_data.email,
        password: user_data.password,
      });
      
      if (error) {
        const messages = {
          "Invalid login credentials":
          "Email o password non corretti.",
        };
        
        setAuthError(
          messages[error.message] ||
          "Si è verificato un errore durante l'accesso."
        );
        
        return;
      }
      
      navigate("/");
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
    Accedi
    </h1>
    
    <form
    className="flex flex-col gap-4"
    onSubmit={handleSubmit(onSubmit)}
    >
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
    
    <button type="submit" className="btn btn-primary">
    Accedi
    </button>
    
    <div className="text-center mt-2">
    <p className="text-sm mb-2">
    Non hai un account?
    </p>
    
    <Link
    to="/auth/register"
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
    Registrati
    </Link>
    </div>
    </form>
    </div>
    </div>
    </div>
  );
}