import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    announcementRecieved = new EventEmitter<AnnouncementDetails>();
    updatedAnnouncementRecieved = new EventEmitter<AnnouncementDetails>();
    deletedAnnouncementIdRecieved = new EventEmitter<number>();

    connectionEstablished = new EventEmitter<Boolean>();

    private connectionIsEstablished = false;
    private _hubConnection: HubConnection;

    constructor() { 
        this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();
    }

    sendAnnouncement(announcement: AnnouncementDetails) {
        this._hubConnection.invoke('NewAnnouncement', announcement);
    }

    sendUpdatedAnnouncement(announcement: AnnouncementDetails) {
        this._hubConnection.invoke('SendUpdatedAnnouncement', announcement);
    }

    sendDeletedAnnouncement(announcement: AnnouncementDetails) {
        this._hubConnection.invoke('SendDeletedAnnouncementId', announcement);
    }

    private createConnection() {
        this._hubConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/AnnouncementHub')
            .build();
    }

    private startConnection(): void {
        this._hubConnection
            .start()
            .then(() => {
                this.connectionIsEstablished = true;
                console.log('AnnonucementHub connection started');
                this.connectionEstablished.emit(true);
            })
            .catch(err => {
                console.log('Error while establishing connection AnnonucementHub, retrying...');
                setTimeout(() => {
                    this.startConnection();
                }, 5000);
        });
    }

    private registerOnServerEvents(): void {
        this._hubConnection.on('AddedAnnouncementReceived', (newAnnouncement: AnnouncementDetails) => {
            this.announcementRecieved.emit(newAnnouncement);
        });
        
        this._hubConnection.on('UpdatedAnnouncementReceived', (updatedAnnouncement: AnnouncementDetails) => {
            this.updatedAnnouncementRecieved.emit(updatedAnnouncement);
        });

        this._hubConnection.on('DeletedAnnouncementIdReceived', (deletedAnnouncementId: number) => {
            this.deletedAnnouncementIdRecieved.emit(deletedAnnouncementId);
        });
    }
}
