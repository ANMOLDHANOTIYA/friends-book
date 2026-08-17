import { useForm } from "react-hook-form";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import api from "../services/api";

function Register() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
        const response = await api.post(
            "/users/register",
            data
        );

        console.log(response.data);
    } catch (error) {
        console.log(
            error.response?.data || error.message
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
                Create your account
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Join FriendsBook and connect with people.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              <Input
                label="Full name"
                type="text"
                placeholder="Enter your full name"
                {...register("fullName", {
                  required: "Full name is required",
                })}
                error={errors.fullName?.message}
              />

              <Input
                label="Username"
                type="text"
                placeholder="Choose a username"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
                error={errors.username?.message}
              />

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
                placeholder="Create a password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password?.message}
              />

              <Button
                type="submit"
                className="w-full"
              >
                Create account
              </Button>

            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <span className="cursor-pointer font-medium text-indigo-400 hover:text-indigo-300">
                Sign in
              </span>
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}

export default Register;