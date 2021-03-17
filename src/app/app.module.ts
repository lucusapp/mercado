import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlataformaComponent } from './plataforma/plataforma.component';
import { ProductosComponent } from './plataforma/productos/productos.component';
import { ProductoComponent } from './plataforma/productos/producto.component';
import {CargaComponent} from './plataforma/carga/carga.component'


import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from 'src/environments/environment';
import { MaterialModule } from './material/material.module';
import {ScrollingModule} from '@angular/cdk/scrolling';
import{NgDroFilesDirective} from './directives/ng-dro-files.directive';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductosService } from './servicios/productos.service';
import { ScraperService } from './servicios/scraper.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';




@NgModule({
  declarations: [
    AppComponent,
    PlataformaComponent,
    ProductosComponent,
    ProductoComponent,
    CargaComponent,
    NgDroFilesDirective
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    FormsModule,
    HttpClientModule,
    ScrollingModule,
    BrowserAnimationsModule,

  ],
  providers: [
    ProductosService,
    ScraperService,

    ],
  bootstrap: [AppComponent],
  entryComponents:[ProductoComponent,CargaComponent]
})
export class AppModule { }
