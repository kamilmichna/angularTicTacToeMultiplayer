import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // R - means event returned from backend
  onUserAction$ = new Subject();
  roomId: string = '';
  constructor(private socket: Socket) {
    this.socket.on('userAction', (boardState: any) => {
      this.onUserAction$.next(boardState);
    })
  }
  
  sendUserAction(id: number) {
    this.socket.emit('userAction', id, this.roomId)
  }

  createNewRoom(){
    this.socket.emit('createRoom');
    this.socket.on('returnedRoomId', (roomId: any) => {
      this.roomId = roomId;
      Swal.fire(`Created to room with id: ${roomId}`)
    })
  }

  joinRoom(roomId: string) {
    this.socket.emit('joinRoom',roomId);
    this.socket.on('returnedRoomId', (roomId: any) => {
      this.roomId = roomId;
      Swal.fire(`Connected to room with id: ${roomId}`)
    })
  }

  async promptForGameData(){
    Swal.fire({
      title: 'Do you want to create or join online game?',
      showDenyButton: true,
      confirmButtonText: 'Join',
      denyButtonText: `Create`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: roomId } = await Swal.fire({
          title: 'Enter room number',
          input: 'text',
          inputLabel: 'For example: #123456',
          showCancelButton: false,
          backdrop: false,
          inputValidator: async (value) => {
            if (!value) {
              return 'You need to write something!'
            }
            if (!value) {
              return 'You need to write something!'
            }
            return null;
          }
        })
        this.joinRoom(roomId);
      } else if (result.isDenied) {
        this.createNewRoom();
      }
    })
  }
}
