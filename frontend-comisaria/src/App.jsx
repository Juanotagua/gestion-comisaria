import { useEffect, useState } from "react";
import axios from "axios";

function App(){

const [casos,setCasos]=useState([]);

useEffect(()=>{
 obtenerCasos();
},[]);

const obtenerCasos = async()=>{

try{

const res = await axios.get(
"http://localhost:3000/api/casos"
);

setCasos(res.data);

}catch(error){
console.error(error);
}

};

return(

<div style={{padding:"30px"}}>

<h1>Listado de Casos</h1>

{casos.map(caso=>(
<div
key={caso.id_caso}
style={{
border:"1px solid gray",
margin:"15px",
padding:"15px",
borderRadius:"10px"
}}
>

<h3>{caso.numero_radicado}</h3>

<p>
Tipo proceso: {caso.id_tipo_proceso}
</p>

<p>
Estado: {caso.id_estado}
</p>

<p>
Prioridad: {caso.id_prioridad}
</p>

<p>
{caso.descripcion_hechos}
</p>

</div>
))}

</div>

)

}

export default App;