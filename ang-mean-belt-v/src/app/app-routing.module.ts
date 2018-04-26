import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from "./app.component";
import {HomeComponent} from "./home/home.component";
import {DetailsComponent} from "./details/details.component";
import {CreateComponent} from "./create/create.component";
import {EditComponent} from "./edit/edit.component";
import {ReviewsComponent} from "./reviews/reviews.component";

const routes: Routes = [
  {path: 'edit', component: EditComponent},
  {path: 'edit/:movie_id', component: EditComponent},
  {path: 'reviews/:movie_id', component: ReviewsComponent},
  {path: 'create', component: CreateComponent},
  {path: 'details', component: DetailsComponent },
  {path: 'details/:movie_id', component: DetailsComponent },
  {path: 'home', component: HomeComponent},
  {path: 'movies', component: HomeComponent},
  {path: '', component: HomeComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
