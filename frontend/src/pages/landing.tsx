import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [mnemonic, setMnemonic] = useState([])
  const [state, setState] = useState(0)
  const navigate = useNavigate()

  async function generateWallet() {
    if (!password || !confirmPassword || password != confirmPassword) {
      alert('password is missing or not matching')
      return
    }
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/generate`, {
      password
    })
    localStorage.setItem('seed', res.data.encrypt)
    setMnemonic((res.data.mnemonic).split(' '))
    setState(1)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-sm border border-gray-200 space-y-8">

        <div className="text-center space-y-3">
          <div className="w-35 h-12 mx-auto border rounded-lg border-gray-300 flex items-center justify-center text-xl font-bold">
            CryptWallet
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Wallet
          </h1>
          <p className="text-sm text-gray-500">
            Secure self-custody access
          </p>
        </div>

        {state === 0 && <>
          <div className="space-y-6">

            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Password
              </label>
              <input
                type="text"
                placeholder="Enter password"
                defaultValue={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                defaultValue={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
              />
            </div>

            <button onClick={generateWallet} className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition">
              Generate Wallet
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button className="w-full border border-gray-300 py-3 rounded-lg text-sm hover:bg-gray-50 transition">
              Import Existing Wallet
            </button>

          </div>

          <p className="text-xs text-gray-400 text-center">
            Your keys. Your responsibility.
          </p>
        </>}
        {state === 1 && <>
          <div className="border rounded-lg border-red-500 p-4">
            <h2 className="text-lg font-bold text-red-800 text-center">Do not share your Recovery Phrase</h2>
            <p className="text-md text-red-500 text-center">If someone has your Recovery Phrase they will have full control of your wallet.</p>
          </div>
          <div className="grid grid-cols-3">
            {mnemonic.map((word, index) => (
              <div className="border rounded-lg p-1 text-center m-2" key={index + 1}>
                <p>{index + 1}. {word}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <button onClick={nextfn} className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition">
              Next
            </button>

            <button onClick={()=> setState(0)} className="w-full border text-black py-3 rounded-lg border-black text-sm font-medium">
              Back
            </button>
          </div>

        </>}
      </div>
    </div>
  );
}