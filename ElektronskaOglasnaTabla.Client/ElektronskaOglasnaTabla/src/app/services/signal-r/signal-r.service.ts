import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { Announcements } from 'src/app/models/Announcements';
import { DeleteAnnouncementWS } from 'src/app/models/DeleteAnnouncementWS';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    newAnnouncementRecieved = new EventEmitter<AnnouncementDetails>();
    updatedAnnouncementRecieved = new EventEmitter<AnnouncementDetails>();
    deletedAnnouncementIdReceived = new EventEmitter<number>();
    nextTheLatestAnnouncementRecieved = new EventEmitter<AnnouncementDetails>();
    nextImportantAnnouncementRecieved = new EventEmitter<AnnouncementDetails>();
    nextAnnouncementFromCategoryRecieved = new EventEmitter<AnnouncementDetails>();

    connectionEstablished = new EventEmitter<Boolean>();

    private connectionIsEstablished = false;
    private _hubConnection: HubConnection;

    constructor() { 
        this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();
    }

    sendAnnouncement(announcement: Announcements) {
        this._hubConnection.invoke('NewAnnouncement', announcement);
    }

    sendUpdatedAnnouncement(announcement: AnnouncementDetails) {
        this._hubConnection.invoke('SendUpdatedAnnouncement', announcement);
    }

    sendDeletedImportantAnnouncement(deletedAnnouncementData: DeleteAnnouncementWS) {
        this._hubConnection.invoke('SendNextImportantAnnouncement', deletedAnnouncementData);
    }

    sendDeletedTheLatestAnnouncement(deletedAnnouncement: DeleteAnnouncementWS) {
        this._hubConnection.invoke('SendNextTheLatestAnnouncement', deletedAnnouncement);
    }

    sendDeletedAnnouncementFromCategory(deletedAnnouncement: DeleteAnnouncementWS) {
        this._hubConnection.invoke('SendNextAnnouncementFromCategory', deletedAnnouncement);
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
            this.newAnnouncementRecieved.emit(newAnnouncement);
        });
        
        this._hubConnection.on('UpdatedAnnouncementReceived', (updatedAnnouncement: AnnouncementDetails) => {
            this.updatedAnnouncementRecieved.emit(updatedAnnouncement);
        });

        this._hubConnection.on('DeletedImportantAnnouncementIdReceived', (nextImportantAnnouncement: AnnouncementDetails) => {
            this.nextImportantAnnouncementRecieved.emit(nextImportantAnnouncement);
        });

        this._hubConnection.on('DeletedAnnouncementIdFromCategoryReceived', (nextAnnouncementFromCategory: AnnouncementDetails) => {
            this.nextAnnouncementFromCategoryRecieved.emit(nextAnnouncementFromCategory);
        });

        this._hubConnection.on('DeletedTheLatestAnnouncementIdReceived', (nextTheLatestAnnouncement: AnnouncementDetails, 
                                                                          deletedAnnouncementId: number) => {
            
            console.log("nextTheLatestAnnouncement =======> ", nextTheLatestAnnouncement);
            console.log("deletedAnnouncementId =======> ", deletedAnnouncementId);
            
            this.nextTheLatestAnnouncementRecieved.emit(nextTheLatestAnnouncement);
            this.deletedAnnouncementIdReceived.emit(deletedAnnouncementId);
        });
    }
}