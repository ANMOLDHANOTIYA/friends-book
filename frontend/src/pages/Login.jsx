import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import api from "../services/api";

import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Login() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { fetchCurrentUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {

      // Login
      await api.post(
        "/users/login",
        data
      );

      // Get logged-in user
      const currentUser =
        await fetchCurrentUser();

      // Make sure authentication actually worked
      if (!currentUser) {
        console.error(
          "Login succeeded but current user could not be fetched."
        );
        return;
      }

      // Go to feed
      navigate("/feed");

    } catch (error) {

      console.error(
        error.response?.data ||
        error.message
      );

    }
  };

  return (
    <main className="min-h-screen bg-[#0b0d10] px-4 py-8">

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">

        <div className="w-full">

          <div className="mb-8 flex justify-center">
            <Logo />
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#12161c] p-6 shadow-2xl shadow-black/20 sm:p-8">

            <div className="mb-8">

              <h1 className="text-2xl font-bold tracking-tight text-white">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Sign in to continue to FriendsBook.
              </p>

            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                })}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
                error={errors.password?.message}
              />

              <Button
                type="submit"
                className="w-full"
              >
                Sign in
              </Button>

            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <span className="cursor-pointer font-medium text-indigo-400 hover:text-indigo-300">
                Create one
              </span>
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Login;