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
            "An account with this email already exists.",
          "Password should be at least 6 characters":
            "Password must be at least 6 characters long.",
        };

        setAuthError(
          messages[error.message] ||
          "An error occurred during registration."
        );

        return;
      }

      setSuccessMessage("Registration completed successfully!");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setAuthError("An error occurred.");
    }
  };

  return (
    <div className="hero flex-1 font-electro">
      <div className="card bg-base-200 w-full max-w-md shadow-xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center">
            Sign Up
          </h1>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="input input-bordered w-full"
              placeholder="First Name"
              {...register("first_name", {
                required: "First name is required",
              })}
            />

            {errors.first_name && (
              <span className="text-error text-sm">
                {errors.first_name.message}
              </span>
            )}

            <input
              className="input input-bordered w-full"
              placeholder="Last Name"
              {...register("last_name", {
                required: "Last name is required",
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
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters",
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
                required: "Email is required",
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
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
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
              Sign Up
            </button>

            <div className="text-center mt-2">
              <p className="text-sm mb-2">
                Already have an account?
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
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}