import { Component, OnInit } from '@angular/core';
import {DataManagerService, MovieTransferService, MovieModel} from "../data-manager.service";
import {Router, ActivatedRoute} from "@angular/router";



@Component({
  // selector: 'app-home',
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private backend_errors: any;


  constructor(private _http: DataManagerService, private router: Router, private _shareRestaurantData: MovieTransferService) {

  }

  shareRestaurantData(data) {
    this._shareRestaurantData.sendAnything(data);
  }


  public list_of_all_the_things: any;
  movie_id;
  editingInPlace: boolean = false;
  selected_movie = new MovieModel();


  ngOnInit() {

    //TODO: get all the things
    let observable = this._http.getAllRestaurants();
    observable.subscribe(data => {
      console.log(`recieved ALL THINGS DATA: `, data);
      this.list_of_all_the_things = data['movies'];


      //TODO: calculate the average rating based on all the stars
      //might be best to add "average rating" to the model and update that every time a new review is saved?


    });

  }


  getSecondsBetweenDates(starting_timestamp, ending_timestamp = new Date()) {
    var difference_in_seconds;
    //make sure these are able to be understood as date objects
    //format is YYYY-MM-DDTHH:MM:SS.sssZ
    // example: 2018-04-26T00:52:26.299Z

    console.log(`ORIGINAL INPUTS:\nT1: ${starting_timestamp}\nT2: ${ending_timestamp}\n`,);

    let start_time_ISO = new Date(starting_timestamp).toISOString();
    let end_time_ISO = new Date(ending_timestamp).toISOString();

    console.log(`ISO(s): \nT1: ${start_time_ISO}\nT2: ${end_time_ISO}\n`,);

    // console.log(`JSON: `,starting_timestamp.toJSON());
    let start_time_parsed = Date.parse(start_time_ISO);
    let end_time_parsed = Date.parse(end_time_ISO);

    console.log(`parsed ISO(s): \nT1: ${start_time_parsed}\nT2: ${end_time_parsed}\n`,);

    let difference_in_ms = end_time_parsed - start_time_parsed;
    console.log(`Difference in ms: `, difference_in_ms);

    difference_in_seconds = difference_in_ms / 1000;
    console.log(`Difference in seconds: ${difference_in_seconds}\n`,);

    return difference_in_seconds;
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

  editInPlace(id: any) {
    console.log(` movie id set to: `, id);
    let observable = this._http.getMovieById(id);
    observable.subscribe(data => {
      console.log(`Query for specific movie returned: `, data);
      this.selected_movie = data['movie'][0];
      console.log(`selected restau:`, this.selected_movie);
      this.shareRestaurantData(this.selected_movie);
      this.editingInPlace = true;

    });

  }

  getAvgRating(reviews: any) {
    // console.log(`number of reviews: `,reviews.length);
    let rating_sum = 0;
    for (let review of reviews) {
      // console.log(``,);
      rating_sum += review.stars;
      // console.log(`current sum: `,rating_sum);
    }
    // console.log(`total: `,rating_sum);
    let average = rating_sum / reviews.length;
    // console.log(`Average: `,average );
    return average;
  }



}
