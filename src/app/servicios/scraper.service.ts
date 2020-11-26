import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators'
import {  Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ScraperService {
  readonly UrlApi = "http://localhost:3000/";

producto;

  constructor(private http:HttpClient) {
    
  }
  //  getProducto(){  
  //       setTimeout(() => {
  //          this.http.get(this.UrlApi).subscribe(data=>{console.log})
  //       }, 8000);
  //     }


      // this.http.get(this.UrlApi)
      // .subscribe(data=>{     
      //   console.log(data)
      // })
  
  
    postId(idProducto){
      console.log(idProducto)
        this.http.post(this.UrlApi,idProducto).subscribe()  
    }
  }