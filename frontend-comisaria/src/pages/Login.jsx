import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login } from '../services/api'

function Login(){

const navigate = useNavigate()

const [correo, setCorreo] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')

const handleLogin = async () => {

try{

const res = await login(correo, password)

console.log(res)

// si login es correcto
navigate('/dashboard')

}catch(err){

setError(err.message)

}

}

return(
<div style={{
height:'100vh',
display:'flex',
justifyContent:'center',
alignItems:'center',
background:'#0f172a'
}}>

<div style={{
background:'#1e293b',
padding:'40px',
borderRadius:'15px',
width:'350px',
color:'white'
}}>

<h1>Login Comisaría</h1>

<input
placeholder="Correo"
value={correo}
onChange={(e)=>setCorreo(e.target.value)}
style={{
width:'100%',
padding:'12px',
margin:'15px 0'
}}
/>

<input
type="password"
placeholder="Contraseña"
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={{
width:'100%',
padding:'12px',
margin:'15px 0'
}}
/>

<button
onClick={handleLogin}
style={{
width:'100%',
padding:'12px'
}}
>
Ingresar
</button>

{error && <p style={{color:'red', marginTop:'10px'}}>{error}</p>}

</div>

</div>
)

}

export default Login