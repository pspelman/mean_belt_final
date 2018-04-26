import { Component, OnInit } from '@angular/core';
import {DataManagerService} from "../data-manager.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MovieModel} from "../data-manager.service";


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  movie_id: any;

  constructor(private _http: DataManagerService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.movie_id = params['movie_id'];
      console.log(`got the id: `, this.movie_id);
    });
  }

  selected_movie: MovieModel = new MovieModel();
  backend_errors: any;
  reviews: any;

  sortOnRatings(a,b) {
    if (a.stars < b.stars)
      return 1;
    if (a.stars > b.stars)
      return -1;
    return 0;
  }

  ngOnInit() {
    //todo: get the selected restaruant

    let observable = this._http.getMovieById(this.movie_id);

    observable.subscribe(data => {
      console.log(`Query for specific movie returned: `,data);

      //FIXME: extract the selected movie from the result
      this.selected_movie = data['movie'][0];
      this.reviews = this.selected_movie.reviews;

      console.log(`MOVIE: `,this.selected_movie);
      //sort the reviews
      this.reviews.sort(this.sortOnRatings);
      console.log(`Reviews: `,this.reviews);
    });

  }


  deleteMovie(id: any) {
    console.log(`clicked delete...`,);
    let deletion = this._http.deleteMovie(id);
    deletion.subscribe(response => {
      console.log(`server responded to delete request: `, response);
      if (!response['errs'].has_errors) {
        console.log(`no errors!`,);
        this.router.navigateByUrl('/home');

      } else if (response['errs'].has_errors) {
        this.backend_errors = response['errs'].error_list;
        console.log(`got errors: `,this.backend_errors);
      }
    });

  }

  deleteReview(movie_id:any, review_id: any) {
    console.log(`trying to delete  review ${review_id} from movie ${movie_id}`,);

    let review_info = {"review_id": review_id}

    let observable = this._http.deleteReview(movie_id, review_info);

    observable.subscribe(response => {
      console.log(`server response from delete review: `, response);
      // this.router.navigateByUrl(`/reviews/${this.movie_id}`);
      let refresh = this._http.getMovieById(this.movie_id);

      refresh.subscribe(data => {
        console.log(`Query for specific movie returned: `,data);
        this.selected_movie = data['movie'][0];
        this.reviews = this.selected_movie.reviews;
        this.reviews.sort(this.sortOnRatings);
        console.log(`Reviews: `,this.reviews);
      });



    });

  }
}




//GET THE CREATION TIME OF THE OBJECT
// var creation_time = this.selected_movie['createdAt'];
// console.log(`Created at: `,creation_time);
//
// let parsed_creation_time = Date.parse(creation_time);
// console.log(`Parsed version: `,parsed_creation_time);
//
// let current_time_as_ISO = new Date().toISOString();
// console.log(`Current time as ISO: `,current_time_as_ISO);
//
// let parsed_current_time_as_ISO = Date.parse(current_time_as_ISO);
// console.log(`Parsed current time as ISO`,parsed_current_time_as_ISO);
//
// console.log(`Difference: `,parsed_current_time_as_ISO - parsed_creation_time);
// console.log(`Difference (seconds): `,(parsed_current_time_as_ISO - parsed_creation_time)/1000);
//
