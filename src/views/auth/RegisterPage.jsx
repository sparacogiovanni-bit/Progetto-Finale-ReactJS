import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

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
              {...register("name", {
                required: "Nome obbligatorio",
              })}
            />
            {errors.name && (
              <span className="text-error text-sm">
                {errors.name.message}
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
              })}
            />
            {errors.password && (
              <span className="text-error text-sm">
                {errors.password.message}
              </span>
            )}

            <button className="btn btn-primary">
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