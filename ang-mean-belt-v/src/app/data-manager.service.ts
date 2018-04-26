import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subject} from "rxjs/Subject";




@Injectable()
export class ReviewModel {
  user_name: string;
  review_text: string;
  stars: number;
  star_select: Array<number> = [1, 2, 3, 4, 5];

  constructor(user_name = "", review_text = "", stars = null) {
    this.user_name = user_name;
    this.review_text = review_text;
    this.stars = stars;
  }

}




@Injectable()
export class MovieModel {
  movie_title: string;
  movie_genre: string;
  description: string;
  review: ReviewModel;
  reviews: Array<ReviewModel>;

  // id: any;

  constructor(movie_title: string = "", movie_genre: string = "", description: string = "") {
    this.movie_title = movie_title;
    this.movie_genre = movie_genre;
    this.description = description;
    this.review  = new ReviewModel();
  }

}


@Injectable()
export class MovieTransferService {
  movie = new BehaviorSubject<any>(MovieModel);
  cast = this.movie.asObservable();

  sendAnything(data) {
    this.movie.next(data);
  }

}


@Injectable()
export class DataManagerService {

  constructor(private _http: HttpClient) { }


  //TODO: Create Request
  createDonation(new_donation_offer: any) {
    return this._http.post('/donate', new_donation_offer)
  }



  //TODO: Update Request


  getAllRestaurants(){
    return this._http.get(`/movies`);
  }

  getMovieById(id) {
    return this._http.get(`/movies/${id}`);

  }

  getBeltTestModelById(id: any) {
    return this._http.get(`movies/${id}`);
  }


  deleteMovie(id: any) {
    return this._http.delete(`movies/${id}`);

  }

  createMovie(new_movie: MovieModel) {
    console.log(`trying to create new movie: `,new_movie);
    return this._http.post('/movies', new_movie);
    // return ("working on it");
  }

  createMovieReview(id, review) {

    console.log(`trying to add review for movie ${id}: `, review);
    //TODO: send put request to add review
    return this._http.put(`/reviews/${id}`, review);

  }

  updateMovieInfo(id, movie_info: MovieModel) {
    console.log(`trying to update restau id: `, id);
    return this._http.put(`/movies/${id}`, movie_info);
  }

  deleteReview(movie_id, review_id: any) {
    console.log(`trying to delete review`,);
    return this._http.put(`/reviews/remove/${movie_id}`, review_id );
  }
}
