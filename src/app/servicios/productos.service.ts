import { Injectable } from '@angular/core';
import {FormGroup,FormControl,FormBuilder,FormArray, Validators} from '@angular/forms';
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase'
import{ScraperService} from '../servicios/scraper.service';
import * as Filesaver from "file-saver";
import * as XLSX from "xlsx";
import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import {producto} from '../models/producto.model'
import { map } from 'rxjs/operators';
import {  Observable } from 'rxjs';
import {io} from 'socket.io-client'

import { FileItem } from '../models/file-item';



const EXCEL_TYPE =
"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXT = ".xlsx";


@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  
readonly UrlApi = "http://localhost:3000/";
productos:AngularFireList <any>;
categorias:AngularFireList <any>;
cateArray = [];
prodScraper:any;
loading:boolean;
imaScrap = [];
imaArray = []
variantes = []
socket:any;

private CARPETA_IMG = 'img'


  constructor(private firebase:AngularFireDatabase, 
              public fb:FormBuilder,
              public scraper:ScraperService,
              public http:HttpClient,
              private db: AngularFirestore
              
              ){
                this.categorias = this.firebase.list('categorias')
                this.categorias.snapshotChanges()
                               .subscribe(
                                 list=>{
                                   this.cateArray = list.map(item=>{
                                     return{
                                       $key: item.key,
                                       ...item.payload.val()
                                     }
                                   })
                                 }
                               )
              this.socket = io(this.UrlApi)
              }

    
 guardarImagen(imagen: {url:string}){
 //  console.log(imagen)
  this.db.collection(`${this.CARPETA_IMG}`)
         .add(imagen)
}

cargarImagenesFire(imagenes: FileItem[]){
  console.log(imagenes)
   const storageRef = firebase.storage().ref()

   console.log(storageRef)
  
  for (const item of imagenes){
    item.estaSubiendo = true;
    if (item.progreso >=100){
      continue;
    }
    const uploadTask:firebase.storage.UploadTask =
      storageRef.child(`${this.CARPETA_IMG}/${item.nombreArchivo}`)
                .put (item.archivo)
      
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot:firebase.storage.UploadTaskSnapshot)=>item.progreso=(snapshot.bytesTransferred/snapshot.totalBytes)*100,
      (error)=>console.error('Error al subir', error),
      ()=>{
        console.log('Imagen cargada correctamente');
        item.url = uploadTask.snapshot.downloadURL
        item.estaSubiendo=false;
        this.guardarImagen({
          url:item.url
        })
      }
    )}

}


  forma:FormGroup =this.fb.group({
      $key: null,
      'Action(SiteID=Spain|Country=ES|Currency=EUR|Version=745)': ['add'],
      ItemID:[''],
      CustomLabel: [''],
      Category:['',Validators.required],
      StoreCategory:[''],
      Title:['',Validators.required],
      ConditionID:['1000',Validators.required],
      Marca:['',Validators.required],
      MPN:['No aplicable',Validators.required],
      Product:['No aplicable',Validators.required],
      EAN:[''],
      PicURL:this.fb.array([''],[Validators.required]),
      Description:['',Validators.required],
      Format:['Fixed Price',Validators.required],
      Duration:['GTC',Validators.required],
      StartPrice:['',Validators.required],
      Quantity:['',Validators.required],
      Location:['33865',Validators.required],
      ShippingProfileName:['Fija:Correos: carta(Gratis),3 días laborables',Validators.required],
      ReturnProfileName:['Devoluciones aceptadas,Comprador,14 días#0',Validators.required],
      PaymentProfileName:['PayPal:Pago inmediato',Validators.required],
      Relationship:[''],
      RelationshipDetails:[''],
      Variantes: this.fb.array([this.fb.group({
        id: [''],
        name: [''],
        image: [''],
        originalPrice:['']
      })]),
      Precios: this.fb.array([this.fb.group({
        availableQuantity:[''],
        displayName: [''],
        id:[''],
        image:[''],
        name: [''],
        optionValueIds: [''],
        originalPrice: [''],
        salePrice: [''],
        skuId: [''],
      })])
   });
   initializeFormGroup(){
     this.forma= this.fb.group({
      $key: null,
      'Action(SiteID=Spain|Country=ES|Currency=EUR|Version=745)': 'add',
      CustomLabel: '',
      ItemID:'',
      Category:'',
      StoreCategory:'',
      Title:['',Validators.required],
      ConditionID:'1000',
      Marca:'predator',
      MPN:'No aplicable',
      Product:'No aplicable',
      EAN:'',
      PicURL: this.fb.array(['']),
      Description:'',
      Format:'Fixed Price',
      Duration:'GTC',
      StartPrice:'',
      Quantity:'',
      Location: '33865',
      ShippingProfileName:'Fija:Correos: carta(Gratis),3 días laborables',
      ReturnProfileName: 'Devoluciones aceptadas,Comprador,14 días#0',
      PaymentProfileName:'PayPal:Pago inmediato',
      Relationship:'',
      RelationshipDetails:'',
      Variantes: this.fb.array([this.fb.group({
        id: [''],
        name: [''],
        image :[''],
        displayName: [''],
      })]),
      Precios: this.fb.array([this.fb.group({
        availableQuantity:[''],
        displayName: [''],
        id:[''],
        image:[''],
        name: [''],
        optionValueIds: [''],
        originalPrice: [''],
        salePrice: [''],
        skuId: [''],
      })]),
    })
  }

  getProductos(){
    this.productos = this.firebase.list('inventario')
    return this.productos.snapshotChanges()
  }
  
  insertProducto(producto){
    this.productos.push({
      'Action(SiteID=Spain|Country=ES|Currency=EUR|Version=745)': 'add',
      ItemID:producto.ItemID,
      CustomLabel:producto.CustomLabel,
      Category:producto.Category,
      StoreCategory:producto.StoreCategory,
      Title: producto.Title,
      ConditionID:producto.ConditionID,
      Marca:producto.Marca,
      MPN:producto.MPN,
      Product:producto.Product,
      EAN:producto.EAN,
      PicURL:producto.PicURL,
      Description:producto.Description,
      Format:producto.Format,
      Duration:producto.Duration,
      StartPrice:producto.StartPrice,
      Quantity:producto.Quantity,
      Location: producto.Location,
      ShippingProfileName:producto.ShippingProfileName,
      ReturnProfileName: producto.ReturnProfileName,
      PaymentProfileName:producto.PaymentProfileName,
      Relationship:producto.Relationship,
      RelationshipDetails:producto.Relationship,
      Variantes: producto.Variantes,
      Precios:producto.Precios
    })
    console.log(producto)
  }
  updateProducto(producto){
    this.productos.update(producto.$key,
      {
        "Action(SiteID=Spain|Country=ES|Currency=EUR|Version=745)": 'add',
        "ItemID":"",
        "CustomLabel":"",
        "Category":producto.Category,
        "StoreCategory":"",
        "Title": producto.Title,
        "ConditionID":'nuevo',
        "Marca":producto.Marca,
        "MPN":"",
        "Product":"",
        "EAN":"",
        "PicURL":producto.PicURL,
        "Description":producto.Description,
        "Format":"",
        "Duration":"",
        "StartPrice":"",
        "Quantity":producto.Quantity,
        "Location": "",
        "ShippingProfileName":"",
        "ReturnProfileName": "",
        "PaymentProfileName":"",
        "Relationship":"",
        "RelationshipDetails":"",
        "Variantes": producto.Variantes,
        "Precios":producto.Precios

      })
    }
    deleteProducto($key:string){
       this.productos.remove($key)
      console.log($key)
    }
  
   async cargarProducto(producto){
      // llega el producto desde el component a traves del elemento row
     // console.log(producto.PicURL) 
      // se carga la data de row al formulario
       this.forma.patchValue(producto)
      //creamos una constante donde observamos que solamente carga el primer valor del array
      const pictures =  this.forma.get("PicURL") as FormArray
        console.log(pictures.value)
      // eliminamos la data de la constante
            while (pictures.length) {
              pictures.removeAt(0);
            }
            producto.PicURL.forEach(cadaImagen=>
            // console.log(cadaImagen)
            pictures.push(new FormControl(cadaImagen))
            )
            
      const modelos = this.forma.get("Precios") as FormArray
            while (modelos.length){
              modelos.removeAt(0)
            }
            producto.Precios.forEach(cadaPrecio=>
              modelos.push(this.fb.group({
                availableQuantity:[cadaPrecio.availableQuantity],
                displayName: [cadaPrecio.displayName],
                id:[cadaPrecio.id],
                image:[cadaPrecio.image],
                name: [cadaPrecio.name],
                optionValueIds: [cadaPrecio.optionValueIds],
                originalPrice: [cadaPrecio.originalPrice],
                salePrice: [cadaPrecio.salePrice],
                skuId: [cadaPrecio.skuId],
   
              }))
              )}

    listen(eventName:string){
      return new Observable((subscriber)=>{
        this.socket.on('enviarId',(data)=>{
          console.log('conectado')
          subscriber.next(data)
        })
      })
    }
    emit(enviarId:string, data:any){
      this.socket.emit('enviarId',data,(prodScraper)=>{
        this.prodScraper=prodScraper
        console.log(this.prodScraper)
        this.forma.patchValue(prodScraper)
        console.log(this.forma)
        const pictures = this.forma.get("PicURL") as FormArray
        console.log(pictures)
        while (pictures.length) {
         pictures.removeAt(0);
       }
       prodScraper.PicURL.forEach(img=>{
         //console.log(pictures)
         pictures.push(new FormControl(img))
       })
       this.imaArray= prodScraper.PicURL
       console.log(this.imaArray)
    
       
       const variantes = this.forma.get("Variantes") as FormArray
       console.log(variantes)
       const precios = this.forma.get("Precios") as FormArray
       console.log(precios.value)
       
       
       while (variantes.length){
         variantes.removeAt(0)
       }
       
       prodScraper.Variantes.forEach(valor=>
         variantes.push(this.fb.group({
           id:[valor.id],
           image:[valor.image],
           name:[valor.name],
           displayName:[valor.displayName]
         })))    
    
         
         prodScraper.Variantes.forEach(valor=>this.imaScrap.push(valor.image))           
         console.log(this.imaScrap)
         
         while (precios.length){
           precios.removeAt(0)
         }
    
         prodScraper.Precios.forEach(precio=>{
           precios.push(this.fb.group({
               availableQuantity:[precio.availableQuantity],
               displayName: [precio.displayName],
               id:[precio.id],
               image:[precio.image.slice(0,-12)],
               name: [precio.name],
               optionValueIds: [precio.optionValueIds],
               originalPrice: [precio.originalPrice],
               salePrice: [precio.salePrice],
               skuId: [precio.skuId],
    
           }))
          })
          console.log(this.forma.value)
       })
      
  
      //})
      console.log('la data es ',data)
    }


      // async cargarScraper(){ 
      //     this.loading=true;
      //     setTimeout(() => {
      //       this.loading=false;
      //       return  this.http.get<producto>(this.UrlApi)
      //        .pipe(map(data=>{
      //          return data['producScrape']
      //        }))
      //        .subscribe((resp)=>{
      //          console.log(resp)
            //  }, 10000);
              
              //   await this.forma.reset({
                //   'Action(SiteID=Spain|Country=ES|Currency=EUR|Version=745)': 'add',
                //   ItemID:this.prodScraper.ItemID    
                // })     
            //  }
        postId(idProducto){
                console.log(idProducto)
                  this.http.post(this.UrlApi,idProducto).subscribe()  
              }        
              
  // CATEGORIAS

  categoria:FormGroup =this.fb.group({
    $key: null,
		CategoryID: [''],
		CategoryLevel: [''],
		CategoryName: [''],
		CategoryParentID: [''],
		CategoryNamePath: [''],
		CategoryIDPath: [''],
		LeafCategory: ['']
  })
  
  insertCategoria(categoria){
    this.categorias.push({
      CategoryID: categoria.CategoryID,
      CategoryLevel: categoria.CategoryLevel,
      CategoryName: categoria.CategoryName,
      CategoryParentID: categoria.CategoryParentID,
      CategoryNamePath: categoria.CategoryNamePath,
      CategoryIDPath: categoria.CategoryIDPath,
      LeafCategory: categoria.LeafCategory
    })
  }

  getCategorias(){
    this.categorias = this.firebase.list('categorias')
    return this.categorias.snapshotChanges()
  }

  //CARGA DE IMAGENES



 // FILE SAVER EXCEL
 exportToExcel(json: any[], excelFileName: string) {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  const workbook: XLSX.WorkBook = {
    Sheets: { data: worksheet },
    SheetNames: ["data"]
    };
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
    });
  //llamar al método buffer y filename
  this.saveAsExcel(excelBuffer, excelFileName);
  }

private saveAsExcel(buffer: any, filename: string) {
  const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  Filesaver.saveAs(data, filename) +
    "_export" +
    new Date().getTime() +
    EXCEL_EXT;
  }     

}
