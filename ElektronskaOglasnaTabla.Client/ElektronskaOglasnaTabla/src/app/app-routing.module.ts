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

const routes: Routes = [
  { path: '', redirectTo: '/pocetna', pathMatch: 'full' },
  { path: 'pocetna', component: CentralPanelComponent },
  { path: 'search-results', component: SearchResultsComponent},
  { path: 'one-announcement-page/:id', component: AnnouncementPageComponent },
  { path: 'list-of-user-announcements', component: ListOfUserAnnouncemenetsComponent },
  { path: 'list-of-all-categories', component: ListOfAllCategoriesComponent },
  { path: 'show-all-users', component: ListOfAllUsersComponent },
  { path: 'show-all-categories', component: CategoriesPanelComponent },
  { path: 'user-profile', loadChildren: () => import ('./components/user-profile/user-profile.module').then(m => m.UserProfileModule) },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { 
        enableTracing: true }
      )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
