const express = require("express");
const app = express();
const Producto = require ('../models/producto');

const scrape = require('aliexpress-product-scraper');



let producScrape ={}


app.post("/", async (req, res) => {
   const product =  scrape (req.body.id);
   console.log(product);
  
   
  await product
   .then(async (res) => {
     console.log('The JSON: ', res);
     
     // UTILIZANDO EL MODELO DE DATOS DE MONGOOSE
     // producScrape = await  new Producto ({
       //   titulo : res.title 
       // })
       // console.log(producScrape)
       
       // CREANDO UN OBJETO COMPATIBLE CON EL LISTADO DE EXCEL
       producScrape = {
         "Action(SiteID=Spain|Country=ES|Currency=EUR|Version=745)": "add",
         "ItemID": "4",
         "CustomLabel":res.productId,
         "Category": res.categoryId,
         "StoreCategory":'',
         "Title":res.title,
         "ConditionID":'1000',
         "Marca":'',
         "MPN":'No aplicable',
         "Product":'No aplicable',
         "EAN":'',
         "PicURL": res.images,
         "Description":res.description,
         "Format":'Fixed Price',
         "Duration":'GTC',
         "StartPrice":'',
         "Quantity":'',
         "Location": '15179',
         "ShippingProfileName":'Fija:Correos: carta(Gratis),3 días laborables',
         "ReturnProfileName": 'Devoluciones aceptadas,Comprador,14 días#0',
         "PaymentProfileName":'PayPal:Pago inmediato',
         "Relationship":'',
         "RelationshipDetails":''
        }
        
        console.log (producScrape)
        const variantes = res.variants.options.values()
        for (const variante of variantes ){
            console.log(variante);
          
          }
        const precios = res.variants.prices.values()
        for (const precio of precios ){
            console.log(precio);
          
          }
          
        })
        .catch(e=>{
          console.log(e);
        });
     
      })



//RUTAS 

app.get('/', async function (req, res) {
  await res.json({
    producScrape
  })
})

module.exports = app

