import {Component, Injectable, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataManagerService, MovieModel, ReviewModel} from "../data-manager.service";


@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})

export class ReviewsComponent implements OnInit {
  movie_id: any;
  new_review = new ReviewModel();

  star_select = [1, 2, 3, 4, 5];
  selected_movie: MovieModel = new MovieModel();

  backend_errors: any;

  constructor(private _http: DataManagerService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.movie_id = params['movie_id'];
      // console.log(`got the id: `, this.movie_id);
    });

  }

  ngOnInit() {
    this.new_review.stars = 1;
    let observable = this._http.getMovieById(this.movie_id);
    observable.subscribe(data => {
      // console.log(`Query for specific movie returned: `, data);
      // this.movie_data = data['movie'][0];
      this.selected_movie = data['movie'][0];
      console.log(`selected movie::`,this.selected_movie);
      // this.selected_movie.description = data['movie'][0].description;
    })


  }



  validateForm() {
    console.log(`checking form for valid inputs`,);
    if (this.new_review.user_name.length < 3 ||
      this.new_review.review_text.length < 3 ){
      // console.log(`invalid form data`,);
      return true;
    } else {
      // console.log(`enough data to send`,);
      return false;
    }
  }

  navHome() {
    this.router.navigateByUrl('/home');
  }

  navBackToReviews(id) {
    this.router.navigateByUrl('/reviews/' + id);
  }


  logChange(change_item: HTMLInputElement) {
    // console.log(`Item changed: `,change_item);
    // console.log(`ViewModel: `,change_item['viewModel']);
  }


  createNewReview() {
    this.backend_errors = null;
    let router = this.router;
    if (!this.validateForm()) {
      console.log(`trying to update movie`,);
      let observable = this._http.createMovieReview(this.movie_id, this.new_review);
      observable.subscribe(response => {
        console.log(`response from server for UPDATE review: `, response);
        if (!response['errs'].has_errors) {
          router.navigateByUrl('/home');
        } else if (response['errs'].has_errors) {
          this.backend_errors = response['errs'].error_list;
          console.log(``,this.backend_errors);
        }
      });
      //this means it's valid
    } else {
      //this means something was wrong with the form
      alert('you must complete the form before you can submit it')
    }
  }

}
