import { Component, NgZone } from '@angular/core';
import { Message } from './models/Message';
import { ChatService } from './services/chat-service/chat.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'ElektronskaOglasnaTabla';

    onActivate(event){
        window.scroll(0,0);
    }
    
    constructor() {}
}
