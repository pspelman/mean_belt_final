import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Router, ActivatedRoute, RouterModule} from "@angular/router";

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import {DataManagerService, MovieTransferService} from "./data-manager.service";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { HomeComponent } from './home/home.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { DetailsComponent } from './details/details.component';
import { ReviewsComponent } from './reviews/reviews.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateComponent,
    EditComponent,
    DetailsComponent,
    ReviewsComponent,
    ReviewsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [DataManagerService, MovieTransferService],
  bootstrap: [AppComponent]
})
export class AppModule { }
