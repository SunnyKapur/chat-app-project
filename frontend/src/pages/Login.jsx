import React from "react";
import { useForm } from "react-hook-form";
import api from "../services/api";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addUser } from "../features/authSlice";

const Login = () => {

  let dispatch = useDispatch()

  let navigate = useNavigate()
  const handleLoginSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      dispatch(addUser(response.data.user))
      navigate("/chat");
      console.log(response.data);
      reset();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">Email</label>
            <input
              {...register("email", { required: "email is required" })}
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
              {...register("password", { required: "password is required" })}
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
            onClick={() => navigate("/register")}
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
