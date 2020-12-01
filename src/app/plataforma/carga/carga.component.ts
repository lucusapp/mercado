import { Component, OnInit } from '@angular/core';
import { FileItem } from 'src/app/models/file-item';
import { ProductosService } from 'src/app/servicios/productos.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { FormArray, FormControl } from '@angular/forms';

export interface Item {url: string; }


@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: []
})
export class CargaComponent implements OnInit {
  estaSobreElemento: boolean = true;
  archivos: FileItem []=[];
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  


  constructor(public prodServ:ProductosService,
              public CargaRef:MatDialogRef<CargaComponent>,
              public afs: AngularFirestore){
                this.itemsCollection = afs.collection<Item>('img');
                console.log(this.itemsCollection)
                this.items = this.itemsCollection.valueChanges();
                console.log(this.items)                
   }
             

  ngOnInit() {
  }

  cargarPictures(){
    this.prodServ.cargarImagenesFire(this.archivos)
  }
  limpiarArchivos(){
    this.archivos = []
  }
  onClose(){
    // this.proService.forma.reset();
    // this.proService.initializeFormGroup()
    this.CargaRef.close();
  } 
  pruebaSobre(event){
    console.log(event)
  }
  enviarImg(archivo){
    console.log(archivo.url)
    const imagenes=this.prodServ.forma.get('PicURL').value as FormArray 
    imagenes.push(archivo.url)
  }

}
