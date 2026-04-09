import bcrypt from "bcryptjs";
import { useState } from "react";
import { db } from "../lib/db";
import { Link, useNavigate } from "react-router-dom";
export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    if (!username || !password) {
      alert("input fields are not valid");
      return;
    }
    const value = await db.get("seed", username);
    if (value === null) {
      alert("username is not correct");
      return;
    }
    const compare = await bcrypt.compare(password, value.hashPassword);
    if (compare === false) {
      alert("incorrect password");
      return;
    }
    navigate("/dashboard", {
      state: {
        username,
        password,
      },
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-35 h-12 mx-auto border rounded-lg border-gray-300 flex items-center justify-center text-xl font-bold">
            CryptWallet
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            LogIn to Wallet
          </h1>
          <p className="text-sm text-gray-500">Secure self-custody access</p>
        </div>
        <div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Username</label>
              <input
                type="text"
                placeholder="Enter Username"
                defaultValue={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="text"
                placeholder="Enter password"
                defaultValue={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
            >
              LogIn Wallet
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <Link to="/" className="w-full border border-gray-300 py-3 px-41 rounded-lg text-sm hover:bg-gray-50 transition">
              Signup
            </Link>
          </div>

          <p className="text-xs text-gray-400 text-center mt-5">
            Your keys. Your responsibility.
          </p>
        </div>
      </div>
    </div>
  );
}
