import React, { useState } from 'react';
import logo from '../../../../../public/assets/logo.svg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="hero w-full bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">

        {/* Login Card */}
        <div className="card bg-base-100 w-[300px] lg:w-[500px] shadow-2xl">
          <div className="card-body">

            {/* Logo and Title */}
            <div className="flex flex-col items-center mb-4">
              <img src={logo} alt="Logo" className="w-40 h-20 mb-2" />
              <h1 className="text-xl font-bold text-center">Dhaka Plastic & Metal</h1>
            </div>

            {/* Login Form */}
            <form className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="Email"
                  required
                />
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pr-10"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <a className="link link-hover text-sm">Forgot password?</a>
              </div>

              <button className="btn btn-neutral w-full mt-2">Login</button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
