import { Injectable, EventEmitter } from '@angular/core';
import { Message } from 'src/app/models/Message';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    messageReceived = new EventEmitter<string>();
    connectionEstablished = new EventEmitter<Boolean>();

    private connectionIsEstablished = false;
    private _hubConnection: HubConnection;

    constructor() { 
        this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();
    }

    sendMessage(message: string) {
        this._hubConnection.invoke('NewMessage', message);
    }

    private createConnection() {
        this._hubConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/MessageHub')
            .build();
    }

    private startConnection(): void {
        this._hubConnection
            .start()
            .then(() => {
                this.connectionIsEstablished = true;
                console.log('Hub connection started');
                this.connectionEstablished.emit(true);
            })
            .catch(err => {
                console.log('Error while establishing connection, retrying...');
                setTimeout(() => {
                    this.startConnection();
                }, 5000);
        });
    }

    private registerOnServerEvents(): void {
        this._hubConnection.on('MessageReceived', (data: any) => {
            this.messageReceived.emit(data);
        });
    }
}
