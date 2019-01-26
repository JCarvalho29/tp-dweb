var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path');

var Pub = require('./../../controllers/pubs')
var User = require('./../../controllers/users')
var querystring = require('querystring')

router.get('/', (req, res) => {

	Pub.consultarFicheiro(req.query.idPub, req.query.idFich)
	.then(fich =>{

		console.log(JSON.stringify(fich))
		var ficheiro = fich[0].elems.ficheiros.ficheiros
		var parts = ficheiro.nome.split('.')
		var extention = "." + parts[parts.length - 1]
		var data = new Date(req.query.data)
		var dataCalendario = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();

		var filepath = __dirname + "/../../uploaded/" + req.query.username + "/" + dataCalendario + "/" + ficheiro.nomeGuardado + extention
		var resolvedFilepath = path.resolve(filepath)

		fs.stat(resolvedFilepath, (erro, _) =>{
			if(erro){
				console.log("FICHEIRO QUE PRETENDE NÃO SE ENCONTRA DISPONÍVEL: ", erro)
				res.status(500).send("FICHEIRO QUE PRETENDE NÃO SE ENCONTRA DISPONÍVEL: " + erro)
			}
			else
				res.sendFile(resolvedFilepath)
			
		})
	})
	.catch(erro =>{res.status(500).send("ERRO NA CONSULTA DO FICHEIRO NA BASE DE DADOS (files.js)" + erro)})
	
});

router.get('/fotoPerfil', (req,res) => {
	User.getIdAtual(req.query.uid)
	.then(obj =>{
		User.obterFotoPerfil(req.query.uid, obj[0].fotoPerfil.idAtual)
        .then(dados =>{
			var foto = dados[0]
			if (foto.fotoPerfil.fotos.nomeGuardado == "default.jpeg"){
				var filepath = __dirname + "/../../uploaded/" + "default.jpeg"
				var resolvedFilepath = path.resolve(filepath)
			}
			else{
				var parts = foto.fotoPerfil.fotos.nome.split('.')
				var extention = "." + parts[parts.length - 1]
				var filepath = __dirname + "/../../uploaded/" + req.query.username + "/fotos/" + foto.fotoPerfil.fotos.nomeGuardado + extention
				var resolvedFilepath = path.resolve(filepath)
			}


			fs.stat(resolvedFilepath, (erro, _) =>{
				if(erro){
					console.log("FICHEIRO QUE PRETENDE NÃO SE ENCONTRA DISPONÍVEL: ", erro)
					res.status(500).send("FICHEIRO QUE PRETENDE NÃO SE ENCONTRA DISPONÍVEL: " + erro)
				}
				else
					res.sendFile(resolvedFilepath)
				
			})
		})
		.catch(erro => res.status(500).send('ERRO NA CONSULTA DA FOTO DE PERFIL 1' + erro))
	})
	.catch(erro => res.status(500).send('ERRO NA CONSULTA DA FOTO DE PERFIL 2' + erro))
    
})

router.get('/foto', (req,res) => {

	User.obterFotoPerfil(req.query.userId, req.query.fotoId)
	.then(dados =>{
		
		var foto = dados[0]
		if (foto.fotoPerfil.fotos.nomeGuardado == "default.jpeg"){
			var filepath = __dirname + "/../../uploaded/" + "default.jpeg"
			var resolvedFilepath = path.resolve(filepath)
		}
		else{
			var parts = foto.fotoPerfil.fotos.nome.split('.')
			var extention = "." + parts[parts.length - 1]
			var filepath = __dirname + "/../../uploaded/" + req.query.username + "/fotos/" + foto.fotoPerfil.fotos.nomeGuardado + extention
			var resolvedFilepath = path.resolve(filepath)
		}


		fs.stat(resolvedFilepath, (erro, _) =>{
			if(erro){
				console.log("FICHEIRO QUE PRETENDE NÃO SE ENCONTRA DISPONÍVEL: ", erro)
				res.status(500).send("FICHEIRO QUE PRETENDE NÃO SE ENCONTRA DISPONÍVEL: " + erro)
			}
			else
				res.sendFile(resolvedFilepath)
			
		})
	})
	.catch(erro => res.status(500).send('ERRO NA CONSULTA DA FOTO DE PERFIL 1' + erro))
    
})

module.exports = router;