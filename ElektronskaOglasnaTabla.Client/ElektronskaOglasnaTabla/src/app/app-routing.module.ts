import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentralPanelComponent } from './components/central-panel/central-panel.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found/page-not-found.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { AnnouncementPageComponent } from './components/announcement-page/announcement-page.component';
import { AuthGuard } from './auth/auth.guard';
import { ListOfUserAnnouncemenetsComponent } from './components/user-profile/list-of-user-announcemenets/list-of-user-announcemenets.component';
import { CategoriesPanelComponent } from './components/categories-panel/categories-panel.component';
import { ListOfAllUsersComponent } from './components/list-of-all-users/list-of-all-users.component';
import { ListOfAllCategoriesComponent } from './components/list-of-all-categories/list-of-all-categories.component';
import { TvDisplayComponent } from './components/tv-display/tv-display.component';
import { ApplicationConfigPanelComponent } from './components/user-profile/application-config-panel/application-config-panel.component';
import { RegistrationFormComponent } from './components/user-profile/registration-form/registration-form/registration-form.component';
import { LoginFormComponent } from './components/user-profile/login-form/login-form/login-form.component';
import { UnauthorizedPageComponent } from './components/unauthorized-page/unauthorized-page.component';
import { ResetPasswordComponent } from './components/user-profile/reset-password/reset-password.component';
import { TheLatestComponent } from './components/the-latest/the-latest.component';
import { ListOfAnnouncementsComponent } from './components/list-of-announcements/list-of-announcements.component';
import { TheMostImportantAnnouncementComponent } from './components/the-most-important-announcement/the-most-important-announcement.component';
import { UserStatisticComponent } from './components/user-profile/user-statistic/user-statistic.component';
import { GgggComponent } from './components/gggg/gggg.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: CentralPanelComponent },
    { path: 'search-results', component: SearchResultsComponent},
    { path: 'announcement/:id', component: AnnouncementPageComponent },
    { path: 'list-of-user-announcements', canActivate: [AuthGuard], component: ListOfAnnouncementsComponent },
    { path: 'list-of-all-announcements', canActivate: [AuthGuard], component: ListOfUserAnnouncemenetsComponent, data: { roles: ["Administrator"]} },
    //{ path: 'categories/:id', component: CategoriesPanelComponent },
    { path: 'categories',
      children: [
          { path: '', component: CategoriesPanelComponent },
          { path: ':id', component: CategoriesPanelComponent }
      ]
    },
    //{ path: 'categories', component: CategoriesPanelComponent }, //Promjene annPage, centralPanel, categoryPanel
    { path: 'show-all-users', canActivate: [AuthGuard], component: ListOfAllUsersComponent, data: { roles: ["Administrator"]} },
    { path: 'list-of-all-categories', canActivate: [AuthGuard], component: ListOfAllCategoriesComponent, data: { roles: ["Administrator"]} },
    { path: 'tv', component: TvDisplayComponent },
    { path: 'sign-in', component: LoginFormComponent },
    { path: 'sign-up', component: RegistrationFormComponent },
    { path: 'page-settings', canActivate: [AuthGuard], component: ApplicationConfigPanelComponent, data: { roles: ["Administrator"]} },
    { path: 'access-denied', component: UnauthorizedPageComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'the-latest', component: TheLatestComponent },
    { path: 'the-most-important', component: TheMostImportantAnnouncementComponent },
    { path: 'users-statistic', component: UserStatisticComponent, canActivate: [AuthGuard], data: { roles: ["Administrator"] } },
    { path: 'user-profile', canActivate: [AuthGuard], loadChildren: () => import ('./components/user-profile/user-profile.module').then(m => m.UserProfileModule) },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            { 
                enableTracing: true
            })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
