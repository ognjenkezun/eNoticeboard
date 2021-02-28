import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration-service/configuration.service';
import { AppConfig } from 'src/app/models/AppConfig';
import { ToastrService } from 'ngx-toastr';
import { ChatService } from 'src/app/services/chat-service/chat.service';

@Component({
    selector: 'app-application-config-panel',
    templateUrl: './application-config-panel.component.html',
    styleUrls: ['./application-config-panel.component.css']
})
export class ApplicationConfigPanelComponent implements OnInit {

    private configApp = {} as AppConfig;

    constructor(private fb: FormBuilder,
                private _configService: ConfigurationService,
                private _toastrService: ToastrService,
                private _chatService: ChatService) { }

    configForm = this.fb.group({
        annExpiry: [this.configApp.announcementExpiry, Validators.required],
        autoUpdate: [this.configApp.automaticallyUpdate, Validators.required],
        slideDuration: [this.configApp.slideDurationOnTv, Validators.required],
        numberAnnPerCat: [this.configApp.numberOfLastAnnPerCategory, Validators.required]
    });

    ngOnInit(): void {
        this.loadConfig();
    }

    loadConfig(): void {
        this._configService.getConfigData(1).subscribe(data => {
                this.configApp = data;
                console.log("Config data => ", data);
                this.configForm.controls['annExpiry'].setValue(this.configApp.announcementExpiry);
                this.configForm.controls['autoUpdate'].setValue(this.configApp.automaticallyUpdate);
                this.configForm.controls['slideDuration'].setValue(this.configApp.slideDurationOnTv);
                this.configForm.controls['numberAnnPerCat'].setValue(this.configApp.numberOfLastAnnPerCategory);
            }, err => {console.log("Error => ", err);
        });
    }

    onSubmit(): void {
        this.configApp.announcementExpiry = this.configForm.controls['annExpiry'].value;
        this.configApp.automaticallyUpdate = this.configForm.controls['autoUpdate'].value;
        this.configApp.numberOfLastAnnPerCategory = this.configForm.controls['slideDuration'].value;
        this.configApp.slideDurationOnTv = this.configForm.controls['numberAnnPerCat'].value;
        console.log("Config obj => ", this.configForm);
        
        this._configService.updateConfigData(1, this.configApp).subscribe(data => {
            this._toastrService.success("Uspješno primijenjena podešavanja", "Akcija uspješna");

            let message = "Message sent!";
            this._chatService.sendMessage(message);
        }, err => {
            this._toastrService.success(err, "Akcija neuspješna");
        });
        this.configForm.reset();
        this.loadConfig();
    }
}