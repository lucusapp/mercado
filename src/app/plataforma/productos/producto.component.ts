import { Component, OnInit, Input } from '@angular/core';
import { ProductosService } from 'src/app/servicios/productos.service';
import {FormArray,FormBuilder} from "@angular/forms";
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { MatDialogRef,MatDialog,MatDialogConfig } from '@angular/material/dialog';


import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';


import { ScraperService } from 'src/app/servicios/scraper.service';
import { CargaComponent } from '../carga/carga.component';
import { VariableAst } from '@angular/compiler';

export interface Item { url: string; }
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styles: []
})

export class ProductoComponent implements OnInit {
  itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;

  constructor(public proService:ProductosService,
              private fb:FormBuilder,
              private notiSer:NotificacionesService,
              private scraper:ScraperService,
              public dialogRef:MatDialogRef<ProductoComponent>,
              public dialog:MatDialog,
              public prodServ:ProductosService,
              private afs: AngularFirestore) {
                this.itemsCollection = afs.collection<Item>('img')
                this.items = this.itemsCollection.valueChanges()
                   
   }


  imagenes;
  variables;
  

   
  ngOnInit() {
     this.proService.getProductos()
     this.proService.forma.valid
    }
     get imagens(){
     this.imagenes=this.proService.forma.get('PicURL').value as FormArray 
    // console.log(this.imagenes);
     
     return this.proService.forma.get('PicURL') as FormArray 
    }

    get variants(){
    this.variables=this.proService.forma.get('Variantes').value as FormArray
     //console.log(this.variables)
      return this.proService.forma.get('Variantes') as FormArray
    }



  onClear(){
    this.proService.forma.reset();
    this.proService.initializeFormGroup()
    this.proService.imaScrap=[]
    
  }
  
  onSubmit(){
    if(this.proService.forma.valid){
      if(!this.proService.forma.get('$key').value)
       this.proService.insertProducto(this.proService.forma.value);
      else
      this.proService.updateProducto(this.proService.forma.value)
      this.proService.forma.reset();
      this.proService.initializeFormGroup()
      this.notiSer.success('Enviado correctamente')
    }
  }
  onClose(){
    this.proService.forma.reset();
    this.proService.initializeFormGroup()
    this.dialogRef.close();
    this.proService.imaScrap=[]
  }
  agregarUrl() {
    // (<FormArray>this.proService.forma.controls["imagenes"]).push(new FormControl(""));
    this.imagens.push(this.fb.control(''))  
  }
  agregarImagen(){
    const CargaConfig = new MatDialogConfig();
    CargaConfig.disableClose = false;
    CargaConfig.autoFocus = false;
    CargaConfig.width = '30%';
    CargaConfig.height = '60%';
    this.dialog.open(CargaComponent,CargaConfig)
  }
  borrarImagen(i: number) {
    (<FormArray>this.proService.forma.controls["PicURL"]).removeAt(i);
  }
}
