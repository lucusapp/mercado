
const express = require('express');
const Producto = require ('../models/producto');
const app = express();



app.get('/', function (req, res) {
   
    Producto.find({})
            .exec((err,productos)=>{
              if(err){
                return res.status(400).json({
                  ok:false,
                  err
                });
              }
              res.json({
                ok:true,
                productos
              })

            })
  });
app.post('/aliscraper:id', function (req, res) {
  
    let body = req.body;

    let producto = new Producto({
      accion: req.accion,
      precio: req.precio,
      categoria: req.categoria,
      marca: req.marca,
      caracteristicas: req.caracteristicas,
      imagenes: req.imagenes
    });
      
      producto.save((err, usuarioDb)=>{
        if(err){
          return res.status(400).json({
            ok:false,
            err
          });
        }
        res.json({
          ok : true,
          usuario: usuarioDb
        });
      });
    });
      
  app.put('/aliscraper:id', function (req, res) {
    let id = req.params.id;
    let body = req.body;
    
    Producto.findByIdAndUpdate (id, body,{new:true},(err,productoDb) =>{
      if(err){
        return res.status(400).json({
          ok:false,
          err
        });
      }
      if(!productoBorrado){
        return res.status(400).json({
          ok:false,
          err: 'el producto fue borrado'
        });
      }
      res.json({
        ok: true,
        producto : productoBorrado
      });
    })
  })
app.delete('/aliscraper:id', function (req, res) {
    
    let id = req.params.id
    Producto.findByIdAndRemove(id,(err,productoBorrado)=>{
      if(err){
        return res.status(400).json({
          ok:false,
          err
        });
      }
    })
  })
  module.exports = app
