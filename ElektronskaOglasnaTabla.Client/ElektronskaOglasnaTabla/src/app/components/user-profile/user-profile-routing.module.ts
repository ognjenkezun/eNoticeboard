import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile.component';
import { ListOfUserAnnouncemenetsComponent } from './list-of-user-announcemenets/list-of-user-announcemenets.component';

const userRoutes: Routes = [
    { path: '', 
    component: UserProfileComponent,
        children: [
            { path: 'list-of-user-announcements', component: ListOfUserAnnouncemenetsComponent },
            //{ path: 'user-statistic', component: UserStatisticComponent }, 
            { path: 'show-all-users', component: ListOfUserAnnouncemenetsComponent }
            //{ path: 'edit-profile', component: EditProfileComponent }
            // { path: 'list-of-user-announcements', canActivate: [AuthGuard], component: ListOfAnnouncementsComponent },
            // { path: 'list-of-all-announcements', canActivate: [AuthGuard], component: ListOfUserAnnouncemenetsComponent, data: { roles: ["Administrator"]} },
            // { path: 'show-all-users', canActivate: [AuthGuard], component: ListOfAllUsersComponent, data: { roles: ["Administrator"]} },
            // { path: 'list-of-all-categories', canActivate: [AuthGuard], component: ListOfAllCategoriesComponent, data: { roles: ["Administrator"]} },
            // { path: 'page-settings', canActivate: [AuthGuard], component: ApplicationConfigPanelComponent, data: { roles: ["Administrator"]} },
            // { path: 'reset-password', component: ResetPasswordComponent },
            // { path: 'users-statistic', component: UserStatisticComponent, canActivate: [AuthGuard], data: { roles: ["Administrator"]} }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(userRoutes)],
    exports: [RouterModule]
})
export class UserProfileRoutingModule { }
