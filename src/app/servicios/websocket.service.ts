import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {io} from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  socket:any;
  readonly uri:string = "http://localhost:3000";

//   constructor() {
//     this.socket = io(this.uri)
//   }
  
//   listen(eventName:string){
//     return new Observable((subscriber)=>{
//       this.socket.on(eventName,(data)=>{
//         console.log('conectado')
//         subscriber.next(data)
//       })
//     })
//   }

//   emit(eventName:string, data:any){
//     this.socket.emit(eventName,data);
//   }
 }

