import { Component, ElementRef, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';

import JSConfetti from 'js-confetti'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  socket = io('https://chat-back-voxt.onrender.com');

  data: any = {};

  // 用户发送的信息
  mensajes: any[] = [];

  // 在线人数
  clienteNum: number = 0;

  audioOn: boolean = false;

  @ViewChild('divMensajes') divMensajes!: ElementRef

  ngOnInit() {
    this.socket.on('mensaje_chat', (data) => {
      console.log(data); // data tiene usuario y mensaje
      console.log(data.socket_id, this.socket.id); // 可以获取对方用户的sockey id，也可以拿到自己的


      // cada vez que llegue un nuevo mensaje, lo ponemos en el array y lo pintamos en HTML
      this.mensajes.push(data);


      // 当声音开启时 且 不是自己发的时候没有 会有声音
      if (this.audioOn && (data.socket_id !== this.socket.id)) {
        let audio: HTMLAudioElement = new Audio('https://cdn.videvo.net/videvo_files/audio/premium/audio0303/watermarked/_Soundstorm%206_Tones-AlertDing-Melodic-H-2_B04-08417_preview.mp3');
        audio.play();
      }




      // 让滑动的条自动的滑
      this.divMensajes.nativeElement.scrollTop = this.divMensajes.nativeElement.scrollHeight;


    });

    // 这里的clientes_conectados是根据后端来的，要一致
    this.socket.on('clientes_conectados', num => {
      console.log(num);  // numero de clientes conectados

      // 当有新的用户进来时，放烟花
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti();

      this.clienteNum = num;

    })
  }


  onClick() {
    console.log(this.data);

    this.data.socket_id = this.socket.id; // 信息从这里发出去， 到达back，然后处理，在上面的24行那里返回
    // cuando pulso bonton, emitir este mensaje al servidor
    this.socket.emit('mensaje_chat', this.data);

  }

}
