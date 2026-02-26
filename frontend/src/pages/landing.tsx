import { useState } from "react";

export default function WalletLanding() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div className="h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black text-white flex items-center justify-center px-4">      
      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="py-2 px-4 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-bold shadow-lg">
            CryptWallet
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">
          Create Your Wallet
        </h2>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Secure. Private. Non-custodial.
        </p>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-400">Password</label>
            <input
              type="password"
              placeholder="Enter strong password"
              className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800/70 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800/70 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>

        <button
          className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-semibold shadow-lg"
        >
          Generate Wallet
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-gray-500 text-xs">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-medium border border-white/10">
          Import Existing Wallet
        </button>
      </div>
    </div>
  );
}