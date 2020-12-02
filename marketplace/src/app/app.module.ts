import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlataformaComponent } from './plataforma/plataforma.component';
import { ClientesComponent } from './plataforma/clientes/clientes.component';
import { PedidosComponent } from './plataforma/pedidos/pedidos.component';
import { PedidoComponent } from './plataforma/pedidos/pedido.component';
import { ProductosComponent } from './plataforma/productos/productos.component';
import { ProductoComponent } from './plataforma/productos/producto.component';
import {CargaComponent} from './plataforma/carga/carga.component'


import { ProductosService } from './servicios/productos.service';
import { ScraperService } from './servicios/scraper.service';

import {ReactiveFormsModule,FormsModule} from "@angular/forms"
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database'
import { AngularFirestoreModule } from 'angularfire2/firestore';
import {HttpClientModule} from "@angular/common/http"
import {ScrollingModule} from '@angular/cdk/scrolling';
import{NgDroFilesDirective} from './directives/ng-dro-files.directive';



import { environment } from 'src/environments/environment';
import { LoadingComponent } from './components/share/loading/loading.component';
import { CategoriasComponent } from './plataforma/categorias/categorias.component';




@NgModule({
  declarations: [
    AppComponent,
    ClientesComponent,
    PedidosComponent,
    PedidoComponent,
    PlataformaComponent,
    ProductosComponent,
    ProductoComponent,
    LoadingComponent,
    CategoriasComponent,
    CargaComponent,
    NgDroFilesDirective
  


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    FormsModule,
    HttpClientModule,
    ScrollingModule,
    AngularFirestoreModule 

  ],
  providers: [ProductosService,
              ScraperService,
              ],
  bootstrap: [AppComponent],
  entryComponents:[ProductoComponent,CargaComponent,CategoriasComponent]
})
export class AppModule { }
