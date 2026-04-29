const router = require('express').Router();
const db = require('../db/conexion');

router.get('/', async(req,res)=>{

try{

const resultado = await db.query(
'SELECT * FROM casos'
);

res.json(resultado.rows);

}catch(error){

console.error(error);

res.status(500).json({
error:'error servidor'
});

}

});
router.post('/', async(req,res)=>{

try{

const {
numero_radicado,
id_tipo_proceso,
id_estado,
id_prioridad,
descripcion_hechos,
fecha_apertura,
id_usuario_creador
}=req.body;

const resultado = await db.query(`
INSERT INTO casos(
numero_radicado,
id_tipo_proceso,
id_estado,
id_prioridad,
descripcion_hechos,
fecha_apertura,
id_usuario_creador
)
VALUES($1,$2,$3,$4,$5,$6,$7)
RETURNING *;
`,
[
numero_radicado,
id_tipo_proceso,
id_estado,
id_prioridad,
descripcion_hechos,
fecha_apertura,
id_usuario_creador
]
);

res.status(201).json(resultado.rows[0]);

}catch(error){

console.error(error);

res.status(500).json({
error:'Error creando caso'
});

}

});
router.put('/:id', async(req,res)=>{
try{

const {id}=req.params;

const {
id_estado,
id_prioridad,
descripcion_hechos
}=req.body;

const resultado = await db.query(`
UPDATE casos
SET
id_estado=$1,
id_prioridad=$2,
descripcion_hechos=$3
WHERE id_caso=$4
RETURNING *;
`,
[id_estado,id_prioridad,descripcion_hechos,id]
);

res.json(resultado.rows[0]);

}catch(error){
console.error(error);
res.status(500).json({error:'Error actualizando caso'});
}
});
router.put('/:id/reasignar', async(req,res)=>{
try{

const {id}=req.params;
const {id_usuario_asignado}=req.body;

const resultado = await db.query(`
UPDATE casos
SET id_usuario_asignado=$1
WHERE id_caso=$2
RETURNING *;
`,
[
id_usuario_asignado,
id
]
);

res.json({
mensaje:'Caso reasignado correctamente',
caso:resultado.rows[0]
});

}catch(error){

console.error(error);

res.status(500).json({
error:'Error reasignando caso'
});

}

});
module.exports = router;