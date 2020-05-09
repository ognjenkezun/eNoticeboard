import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CentralPanelComponent } from './components/central-panel/central-panel.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { LoginFormComponent } from './components/user-profile/login-form/login-form/login-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegistrationFormComponent } from './components/user-profile/registration-form/registration-form/registration-form.component';
import { HttpClientModule } from '@angular/common/http';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found/page-not-found.component';
import { UserProfileModule } from './components/user-profile/user-profile.module';
 
import { ToastrModule } from 'ngx-toastr';
import { AnnouncementPageComponent } from './components/announcement-page/announcement-page.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SearchFilterPipe } from './shared/pipes/search-filter.pipe';
import { FooterComponent } from './components/footer/footer/footer.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { LoginRegisterModalComponent } from './components/login-register-modal/login-register-modal.component';
import { LoginRegisterPanelComponent } from './components/login-register-panel/login-register-panel.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesPanelComponent } from './components/categories-panel/categories-panel.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AnnouncementLegendComponent } from './components/announcement-legend/announcement-legend.component';
import { ListOfAllUsersComponent } from './components/list-of-all-users/list-of-all-users.component';
import { ListOfAllCategoriesComponent } from './components/list-of-all-categories/list-of-all-categories.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    CentralPanelComponent,
    AnnouncementComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    UserProfileComponent,
    PageNotFoundComponent,
    AnnouncementPageComponent,
    SearchFilterPipe,
    FooterComponent,
    SearchResultsComponent,
    LoginRegisterModalComponent,
    LoginRegisterPanelComponent,
    AdminPanelComponent,
    UserPanelComponent,
    CategoriesPanelComponent,
    AnnouncementLegendComponent,
    ListOfAllUsersComponent,
    ListOfAllCategoriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DropDownsModule,
    EditorModule,
    LayoutModule,
    UserProfileModule,
    Ng2SearchPipeModule,
    MatTabsModule,
    NgbModule,
    FormsModule,
    NgxPaginationModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
