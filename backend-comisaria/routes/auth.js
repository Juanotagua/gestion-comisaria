const router = require('express').Router();
const pool = require('../db/conexion');

router.post('/login', async (req, res) => {

try{

const { correo, password } = req.body;

const resultado = await pool.query(
'SELECT * FROM usuarios WHERE correo = $1',
[correo]
);

if(resultado.rows.length === 0){
return res.status(401).json({ error: 'Usuario no existe' });
}

const usuario = resultado.rows[0];

// ⚠️ por ahora sin bcrypt (luego lo metemos)
if(usuario.password_hash !== password){
return res.status(401).json({ error: 'Contraseña incorrecta' });
}

res.json({
mensaje:'Login correcto',
usuario
});

}catch(error){
console.error(error);
res.status(500).json({ error:'Error servidor' });
}

});

module.exports = router;