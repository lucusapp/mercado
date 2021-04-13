import { Component, OnInit,ViewChild } from '@angular/core';
import { ProductosService } from 'src/app/servicios/productos.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductoComponent } from './producto.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ScraperService } from 'src/app/servicios/scraper.service';
import { Overlay } from '@angular/cdk/overlay'
//import { CategoriasComponent } from '../categorias/categorias.component';





@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styles: []
})
export class ProductosComponent implements OnInit {
  
 
  constructor(public prodServ:ProductosService,
              public dialog:MatDialog,
              public scrape:ScraperService,
              private overlay: Overlay
            ) 


    {this.idProducto= new FormGroup({
        'id': new FormControl(''),
      'origen': new FormControl('')})
      console.log(this.idProducto);
    } 

  listaProductos: MatTableDataSource<any>;
  producto;
  loading:boolean
  // imagenes :[]
  displayedColums: string[]= ['Title','Description','Marca','StartPrice','Category','Quantity','PicURL', 'accion' ];
  @ViewChild(MatSort,{static:true}) sort: MatSort;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  searchKey: string;
  idProducto:FormGroup;
  

  ngOnInit() {
    this.prodServ.getProductos()
                .subscribe(list=>{

                  let array=list.map(item=>{
                    console.log(item)
                    return{
                      $key: item.key,    
                      ...item.payload.val()
                    }
                  })
                  console.log(array);                 
                  this.listaProductos = new MatTableDataSource(array)
                  console.log(this.listaProductos)
                  // this.imagenes=this.listaProductos.data[0].PicURL
                  
                  // console.log(this.listaProductos.data[0].PicURL);

                  // this.listaProductos.data.map(item=>{
                  //   this.imagenes = item.PicURL.array.forEach(cadaimagen => {
                  //     return cadaimagen
                  //   });
                  // })
                  
                  this.listaProductos.sort = this.sort;
                  this.listaProductos.paginator = this.paginator;
                  console.log(this.prodServ.productos)
                })
                
              }
  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
  applyFilter() {
    this.listaProductos.filter = this.searchKey.trim().toLowerCase();
  }

  // onCategory(){
  //   const CategoryConfig = new MatDialogConfig();
  //   CategoryConfig.disableClose = false;
  //   CategoryConfig.autoFocus = false;
  //   CategoryConfig.width = '30%';
  //   this.dialog.open(CategoriasComponent,CategoryConfig)
  // }

  onCreate() {
    this.prodServ.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '60%';
   // dialogConfig.height = '100%';
    this.dialog.open(ProductoComponent, dialogConfig);
   // this.prodServ.imaArray = []
  }
  onEdit(row){
    console.log(row)
    this.prodServ.cargarProducto(row)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    //dialogConfig.height = '100%';
    this.dialog.open(ProductoComponent, dialogConfig);
    //this.prodServ.imaArray=row.imagenes
  }

  onDelete($key){
    this.prodServ.deleteProducto($key)
  }

 async enviarId(){
    this.prodServ.initializeFormGroup();

    if (this.idProducto.value.origen==="3") { 
      this.prodServ.postId(this.idProducto.value)
      this.prodServ.emit('eventName',this.idProducto.value)
    }
  

     
   const dialogConfig = new MatDialogConfig();
   dialogConfig.disableClose = false;
   dialogConfig.autoFocus = false;
   dialogConfig.width = '60%';
   dialogConfig.height = '100%';
   this.dialog.open(ProductoComponent, dialogConfig)
   
  }
      
  
  
  // exportAsXLSX(listaProductos){   
  //   this.prodServ.exportToExcel(this.listaProductos.filteredData,'my_export');  
  // }
    
}
