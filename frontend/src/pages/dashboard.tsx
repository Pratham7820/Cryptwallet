import { useState } from "react"
import Home from "./home"

export default function Dashboard() {
    const [state,setState] = useState(0)
    return (
        <div className="grid grid-cols-5 h-screen">
            <div className="rounded-lg bg-gray-200 space-y-10 text-xl font-semibold pt-20">
                <h2 className="hover:bg-blue-300 mx-2 p-3 rounded-lg ">Home</h2>
                <h2 className="hover:bg-blue-300 mx-2 p-3 rounded-lg ">Transfer</h2>
                <h2 className="hover:bg-blue-300 mx-2 p-3 rounded-lg ">Swap</h2>
                <h2 className="hover:bg-blue-300 mx-2 p-3 rounded-lg ">History</h2>
            </div>
            {state===0 && 
                <div className="grid col-span-4">
                    <Home/>
                </div>
            }
        </div>
    )
}