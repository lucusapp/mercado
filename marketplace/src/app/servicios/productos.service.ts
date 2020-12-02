import { Injectable } from '@angular/core';
import {FormGroup,FormControl,FormBuilder,FormArray, Validators} from '@angular/forms';
import{AngularFireDatabase,AngularFireList}  from 'angularfire2/database';
import { AngularFirestore } from '@angular/fire/firestore';
import{ScraperService} from '../servicios/scraper.service';
import * as Filesaver from "file-saver";
import * as XLSX from "xlsx";
import { HttpClient } from '@angular/common/http';
import {producto} from '../models/producto.model'
import { map } from 'rxjs/operators';
import { FileItem } from '../models/file-item';
import * as firebase from 'firebase/app';


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
imaArray:[];
prodScraper:any;
loading:boolean;
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
              }

    
 guardarImagen(imagen: {url:string}){
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
      RelationshipDetails:['']
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
      Marca:'',
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
      RelationshipDetails:''
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
      RelationshipDetails:producto.Relationship
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
        "RelationshipDetails":""
      })
    }
    deleteProducto($key:string){
       this.productos.remove($key)
      console.log($key)
    }
  
   async cargarProducto(producto){
      // llega el producto desde el component a traves del elemento row
      console.log(producto.PicURL) 
      // se carga la data de row al formulario
      this.forma.patchValue(producto)
      //creamos una constante donde observamos que solamente carga el primer valor del array
      const pictures = this.forma.get("PicURL") as FormArray
      console.log(pictures.value)
      // eliminamos la data de la constante
    while (pictures.length) {
      pictures.removeAt(0);
    }
        producto.PicURL.forEach(cadaImagen=>
        // console.log(cadaImagen)
        pictures.push(new FormControl(cadaImagen))
        )
        
       this.imaArray= producto.PicURL
        console.log(this.imaArray)
      }

      async cargarScraper(){ 
          this.loading=true;
          setTimeout(() => {
            this.loading=false;
            return  this.http.get<producto>(this.UrlApi)
             .pipe(map(data=>{
               return data['producScrape']
             }))
             .subscribe((resp)=>{
               console.log(resp)
               this.forma.patchValue(resp)
               const pictures = this.forma.get("PicURL") as FormArray
               while (pictures.length) {
                pictures.removeAt(0);
              }
              resp.PicURL.forEach(img=>
                pictures.push(new FormControl(img))
              )
              this.imaArray= resp.PicURL
              console.log(this.imaArray)     
            })     
          }, 8000);

          //   await this.forma.reset({
            //   'Action(SiteID=Spain|Country=ES|Currency=EUR|Version=745)': 'add',
            //   ItemID:this.prodScraper.ItemID    
            // })     
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



