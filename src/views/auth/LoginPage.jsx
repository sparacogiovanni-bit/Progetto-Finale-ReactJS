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
            "Incorrect email or password.",
        };

        setAuthError(
          messages[error.message] ||
          "An error occurred during login."
        );

        return;
      }

      navigate("/");
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
            Sign In
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
              Sign In
            </button>

            <div className="text-center mt-2">
              <p className="text-sm mb-2">
                Don't have an account?
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
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}