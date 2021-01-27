import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { AddAnnouncementFormComponent } from './add-announcement-form/add-announcement-form.component';
//import { UserStatisticComponent } from './user-statistic/user-statistic.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ListOfUserAnnouncemenetsComponent } from './list-of-user-announcemenets/list-of-user-announcemenets.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { FilterPipe } from './list-of-user-announcemenets/filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApplicationConfigPanelComponent } from './application-config-panel/application-config-panel.component';
import { CustomKendoEditorToolbarDirective } from './list-of-user-announcemenets/custom-kendo-editor-toolbar.directive';
import { UploadComponentComponent } from './upload-component/upload-component.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileDownloadComponent } from './file-download/file-download.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { ImageUploadComponent } from './image-upload/image-upload/image-upload.component';
import { ImageManagerComponent } from './image-manager/image-manager/image-manager.component';
import { ImageDownloadComponent } from './image-download/image-download/image-download.component';


@NgModule({
    declarations: [
        //UserStatisticComponent,
        EditProfileComponent,
        FilterPipe,
        ApplicationConfigPanelComponent,
        CustomKendoEditorToolbarDirective,
        UploadComponentComponent,
        FileUploadComponent,
        FileDownloadComponent,
        FileManagerComponent,
        ImageManagerComponent,
        ImageUploadComponent,
        ImageDownloadComponent
    ],
    imports: [
        CommonModule,
        UserProfileRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        DropDownsModule,
        EditorModule,
        LayoutModule,
        GridModule,
        NgxPaginationModule
    ],
    exports: [
        FileManagerComponent,
        FileUploadComponent,
        FileDownloadComponent,
        ImageManagerComponent,
        ImageUploadComponent,
        ImageDownloadComponent
    ]
})
export class UserProfileModule { }
