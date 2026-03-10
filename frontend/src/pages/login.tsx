import bcrypt from "bcryptjs"
import { useState } from "react"
import { db } from "../lib/db"
import { useNavigate } from "react-router-dom"
export function Login(){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const navigate = useNavigate()

    async function handleLogin(){
        if(!username || !password){
            alert("input fields are not valid")
            return
        }
        const value = await db.get('seed',username)
        if(value===null){
            alert("username is not correct")
            return
        }
        const compare = await bcrypt.compare(password,value.hashPassword)
        if(compare===false){
            alert('incorrect password')
            return
        }
        navigate('/dashboard',{
        state : {
          username,
          password
        }
      })
    }

    return(
        <div>
            <input type="text" placeholder="username" onChange={(e)=>setUsername(e.target.value)}/>
            <input type="text" placeholder="password" onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}