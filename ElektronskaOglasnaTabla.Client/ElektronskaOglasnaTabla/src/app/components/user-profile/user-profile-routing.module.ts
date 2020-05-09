import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserStatisticComponent } from './user-statistic/user-statistic.component';
import { UserProfileComponent } from './user-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ListOfUserAnnouncemenetsComponent } from './list-of-user-announcemenets/list-of-user-announcemenets.component';
import { LoginFormComponent } from './login-form/login-form/login-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form/registration-form.component';


const userRoutes: Routes = [
  { path: '', 
  component: UserProfileComponent,
    children: [
      { path: 'list-of-user-announcements', component: ListOfUserAnnouncemenetsComponent },
      //{ path: 'user-statistic', component: UserStatisticComponent }, 
      { path: 'show-all-users', component: ListOfUserAnnouncemenetsComponent },
      { path: 'sign-in', component: LoginFormComponent },
      { path: 'sign-up', component: RegistrationFormComponent }
      //{ path: 'edit-profile', component: EditProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
