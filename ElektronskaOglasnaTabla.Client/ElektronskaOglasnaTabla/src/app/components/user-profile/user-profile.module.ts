import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { AddAnnouncementFormComponent } from './add-announcement-form/add-announcement-form.component';
import { UserStatisticComponent } from './user-statistic/user-statistic.component';
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


@NgModule({
  declarations: [
    AddAnnouncementFormComponent,
    UserStatisticComponent,
    EditProfileComponent,
    ListOfUserAnnouncemenetsComponent,
    FilterPipe
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
  ]
})
export class UserProfileModule { }
