import React from "react";
import { useForm } from "react-hook-form";

const Login = ({ setToggle }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  let handFormSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit(handFormSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-200 cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => setToggle((pre) => !pre)}
            className="text-indigo-400 cursor-pointer hover:text-indigo-300"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
