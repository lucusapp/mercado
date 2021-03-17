import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators'
import {  Observable } from 'rxjs';
import {io} from 'socket.io-client'



@Injectable({
  providedIn: 'root'
})
export class ScraperService {
  socket:any;
  readonly UrlApi = "http://localhost:3000/";

producto;

  constructor(private http:HttpClient) {
    this.socket = io(this.UrlApi)
  }

  listen(eventName:string){
    return new Observable((subscriber)=>{
      this.socket.on('enviarId',(data)=>{
        console.log('conectado')
        subscriber.next(data)
      })
    })
  }
  emit(enviarId:string, data:any){
    this.socket.emit('enviarId',data,(prodScrape)=>{
      console.log('Desde el server', prodScrape)

    })
    console.log('la data es ',data)
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