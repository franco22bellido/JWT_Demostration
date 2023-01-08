import express from 'express'
import {config} from './config.js';

import jwt from 'jsonwebtoken';

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.post('/jwt', (req, res)=>{
    if(req.body.usuario == 'admin' && req.body.password == "12345"){
        const payload = {
            check : true
        }
        const token = jwt.sign(payload, config.key, {
            expiresIn: '7d'
        });
        const token2 = jwt.sign({nombre: "franco"}, config.key, {
            expiresIn: '1d'
        });
        console.log(token2);

        res.json({
        message: 'autenticacion exitosa',
        tutoken: token
        })
    }else{
        res.status(400).json({
            data: "usuario o contraseña no validos",
            test: "prueba con:",
            usuario : "admin",
            password: 12345
        })
    }
    
});

/*midleware*/
const verificacion = (req, res, next)=>{    
    try {
        const token = req.header("x-access-token");
        jwt.verify(token, config.key);
        
        next();
    } catch (error) {
        res.status(400).json(error.message);
    }
}


app.get("/info", verificacion, (req, res)=>{
    res.status(200).json({
        data : "información importante entregada"
    })
});

app.listen(config.port, ()=>{
    console.log("app en el puerto: "+ config.port);
});