import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {DataManagerService, MovieModel, ReviewModel} from "../data-manager.service";


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  // new_movie: MovieModel;
  // new_review: ReviewModel;
  new_movie = new MovieModel();
  new_review = new ReviewModel();

  star_select = this.new_review.star_select;

  backend_errors: any;

  constructor(private _http: DataManagerService, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.new_movie.review.stars = 1;

  }

  logChange(change_item: HTMLInputElement) {
    console.log(`Item changed: `,change_item);
    console.log(`ViewModel: `,change_item['viewModel']);
  }


  validateForm() {
    console.log(`checking form for valid inputs`,);
    if (this.new_movie.movie_title.length < 3 ||
      (this.new_movie.movie_genre.length < 3  && this.new_movie.movie_genre.length >0) ||
      this.new_movie.review.review_text.length < 3 ||
      this.new_movie.review.user_name.length < 3
      ) {

      console.log(`invalid form data`,);
      return true;
    } else {
      console.log(`enough data to send`,);
      return false;
    }
  }

  navHome() {
    this.router.navigateByUrl('/home');
  }

  createNewMovie() {
    this.backend_errors = null;
    let router = this.router;

    console.log(`trying to create new movie`,);
    //FIXME: validate REVIEW and MOVIE
    console.log(`movie: `,this.new_movie);
    console.log(`review: `,this.new_review);
    if (!this.validateForm()) {
      let observable = this._http.createMovie(this.new_movie);
      observable.subscribe(response => {
        console.log(`response from server for create movie: `, response);
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
      alert('you must complete the form to submit it')
    }
  }

}
