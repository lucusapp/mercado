import { Component} from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductosService } from 'src/app/servicios/productos.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styles: []
})
export class CategoriasComponent {

  constructor(
    public fb:FormBuilder,
    public CategoryRef:MatDialogRef<CategoriasComponent>,
    public proServ: ProductosService
  
  ) { }



  onClose(){
    // this.proService.forma.reset();
    // this.proService.initializeFormGroup()
    this.CategoryRef.close();
  } 
  
  onSubmit(){
        this.proServ.insertCategoria(this.proServ.categoria.value)
        console.log(this.proServ.categoria.value)  
  }

}


