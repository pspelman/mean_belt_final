var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var MovieModel = mongoose.model('MovieModel');
var MovieModels = mongoose.model('MovieModel');

mongoose.Promise = global.Promise;

class errorObject {
    constructor(){
        this.has_errors = false;
        this.error_list = [];
    }
}

router.get('/', function (req, res) {
    console.log(`reached the router`,);
    res.sendFile(path.resolve("./public/dist/index.html"));
});


//get all movies
router.get('/movies', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];
    console.log(`arrived at GET movies...getting all movies`,);

    MovieModels.find({}).
        // sort({stars: 1}).exec(function (err, movies) {
        exec(function (err, movies) {
        if (err) {
            err_holder.push(err.message);
            errs.has_errors = true;
            errs.error_list.push(err.message);
            console.log(`there was an error looking up movies`, err);
            res.json({'message': 'there was an error', 'errors': err.message, 'err_holder': err_holder, 'errs': errs})
        } else {
            res.json({'message': 'successfully retrieved movies', 'movies': movies, 'errs': errs});
        }
    });

});


//COMPLETE: REVIEW router.get('/movies/:id', function(req, res){}
//get a SINGLE author by ID
router.get('/movies/:id', function (req, res) {
    console.log(`reached individual movie lookup`,);
    let errs = new errorObject();
    let err_holder = [];
    console.log(`req.body: `,req.body);

    MovieModels.find({_id: req.params.id}).
    sort({stars: -1}).exec(function (err, movie) {
        if (err) {
            err_holder.push(err.message);
            errs.has_errors = true;
            errs.error_list.push(err.message);
            console.log(`there was an error looking up the movie`, err);
            res.json({'message': 'there was an error', 'errors': err.message, 'err_holder': err_holder, 'errs': errs})
        } else {
            res.json({'message': 'successfully retrieved the movie', 'movie': movie, 'errs': errs});
        }
    });

});



//create a movie
router.post('/movies', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];
    //new data recieved
    console.log(`request.body: `,req.body);

    console.log(`recieved request to make new movie`,);

    let movie = new MovieModel();
    console.log(`initiated model`,);

    //VALIDATIONS
    if (req.body.movie_title.length < 3) {
        errs.has_errors = true;
        errs.error_list.push("title must be at least 3 characters");
    }
    // if (req.body.movie_genre.length < 3 && req.body.movie_genre.length > 0){
    //     errs.has_errors = true;
    //     errs.error_list.push("type must be at least 3 characters");
    // }
    if (req.body.review.user_name.length < 3) {
        errs.has_errors = true;
        errs.error_list.push("reviewer name must be at least 3 characters");
    }
    if (req.body.review.review_text.length < 3) {
        errs.has_errors = true;
        errs.error_list.push("review must be at least 3 characters long");
    }
    if (req.body.review.stars < 1 || req.body.review.stars > 5) {
        errs.has_errors = true;
        errs.error_list.push("rating can only be between 1-5 stars");
    }


    if (errs.has_errors) {
        res.json({"message": "validation errors encountered when trying to save new movie", "errs": errs});
    } else {
        movie.movie_title = req.body.movie_title;
        movie.movie_genre = req.body.movie_genre;
        movie.reviews.push(req.body.review);
        // movie.description = req.body.description;

        movie.save(function (err) {
            if (err) {
                // console.log(`there was an error saving to db`, err);
                errs.has_errors = true;
                errs.error_list.push(err.message);
                console.log(`there were errors saving to db`, err.message );
                res.json({'message': 'unable to save new movie', 'errs': errs})
            } else {
                console.log(`successfully saved!`);
                res.json({'message': 'Saved new movie!', 'errs': errs})
            }
        });
    }
});



//TODO: function for adding a review on a movie
router.put('/reviews/:id', function (req, res) {
    console.log(`request to add new review to movie ${req.params.id }`,);
    console.log(`BODY: `,req.body);

    let errs = new errorObject();
    let err_holder = [];


//     //VALIDATION FOR REVIEWS
    if (req.body.stars < 1 || req.body.stars > 5) {
        errs.has_errors = true;
        errs.error_list.push("Stars may only be between 1 and 5");
    }

    if (req.body.review_text.length < 3) {
        errs.has_errors = true;
        errs.error_list.push("Reviews must be at least 3 characters long");
    }
    // res.json({"message": "working on it", "errs": errs})

    if (req.body.user_name.length < 3) {
        errs.has_errors = true;
        errs.error_list.push("User name must be at least 3 characters long");
    }
    if (errs.has_errors) {
        res.json({"message":"there were errors adding the review", "errs": errs});

    }
    else {

        //TODO: Find movie
        let current_movie;
        MovieModel.find({_id: req.params.id}).exec(function (err, movie) {
            if (err) {
                console.log(`there was an error finding the movie`, err);
                errs.has_errors = true;
                errs.error_list.push("no such movie in DB");
            } else {
                console.log(`found movie`, movie);
                current_movie = movie;

            }
            console.log(`CURRENT MOVIE:`, current_movie);
        });

        var opts = {runValidators: true, context: 'query'};
        MovieModel.findOneAndUpdate({_id: req.params.id}, {
                $push: {
                    reviews: {
                        user_name: req.body.user_name,
                        review_text: req.body.review_text,
                        stars: req.body.stars
                    }
                }
            },
            opts,
            function (err, movie) {
                if (err) {
                    console.log(`errors trying to add review`, err);
                    errs.has_errors = true;
                    errs.error_list.push(err.message);
                    res.json({"message": "error while trying to add review", 'movie': movie, 'errs': errs});

                } else {
                    res.json({"message": "Successfully added review!", 'movie': movie, 'errs': errs});

                }
            });
    }

});




//REMOVE REVIEW
router.put('/reviews/remove/:movie_id', function (req, res) {
    console.log(`reached individual movie lookup`,);
    let errs = new errorObject();
    let err_holder = [];
    console.log(`req.body: `,req.body);

    MovieModel.findByIdAndUpdate(req.params.movie_id, {
        "$pull": {
            'reviews': {'_id': req.body.review_id}

        }
    }, function (err) {
        if (err) {
            console.log(`there was an error`, err.message);
            res.json({"message": 'error removing review', "errs": errs});

        }
        else {
            console.log(`success`,);
            res.json({"message": 'success', "errs": errs});
        }
    });

});






//update an movie's name
router.put('/movies/:id', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];
    console.log(`ID: `,req.params.id);
    console.log(`reached movie updater. Body: `, req.body);


    var opts = {runValidators: true , context: 'query'};
    MovieModels.findOneAndUpdate({_id: req.params.id}, {
        movie_title: req.body.movie_title,
        movie_genre: req.body.movie_genre,
        description: req.body.description,
    }, opts, function (err) {
        if (err) {
            console.log(`there was an error updating`, err.message);
            errs.has_errors = true;
            errs.error_list.push(err.message);
            res.json({'message': 'problem updating movie', 'errs': errs});

        } else {
            res.json({'message': 'successfully updated movie', 'errs': errs});
        }
    });
});



//UPDATE
router.put('/add_belt_test_model/:movie_id', function (req, res) {
    console.log(`got request to update author's quotes auth: `,req.params.movie_id);
    let errors = [];
    let movie_id = req.params.movie_id;
    let text_to_add_as_quote = req.body.quote_text;

    //validate quote length
    if(text_to_add_as_quote.length < 3){
        console.log(`you done messed up`,);
        let err = new Error("quote is not long enough");
        errors.push(err.message);
        res.json({'message':'done with the thing', 'author':movie_id, 'errors': errors});

    } else {
        MovieModels.find({_id: movie_id}, function (err, author) {
            if (err) {
                errors.push(err.message);
                res.json({"message":"error adding quote", "errors":errors})
            } else {
                let author_to_update = author[0];
                console.log(`got the author, continue to ADD a quote:`,author);
                author[0].quotes.push({ quote_text: text_to_add_as_quote });
                author[0].save();
                res.json({'message':'Successfully saved', 'author':movie_id});
            }
        });
    }
});


//DONE: router.delete('/', function(req, res){}
router.delete('/movies/:id', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];

    console.log(`trying to delete the movie`,);
    let movie_id = req.params.id;

    console.log(`movie: ${movie_id}`);
    MovieModels.remove({_id: req.params.id}, function (err) {
        if (err) {
            errs.has_errors = true;
            errs.error_list.push(err);
            res.json({'message': 'Error when deleting movie', 'errs': errs});
        } else {
            res.json({'message': 'successfully deleted movie', 'errs': errs});
        }
    });
});

//forward unresolved routes to Angular
router.all("/*", (req,res,next) => {
    console.log(`reached wildcard route...need to redirect to Angular templates`,);
    res.sendFile(path.resolve("./public/dist/index.html"));
});


//TODO : function for liking movie
router.put('/movies/like/:id', function (req, res) {
    console.log(`like request: `, req.params.id);

    MovieModels.findOneAndUpdate(
        { _id: req.params.id },
        {$inc: {likes: 1}}).exec(function(err, belt_test_model_data) {
        if (err) {
            throw err;
        }
        else {
            console.log(belt_test_model_data);
            res.json({'message': 'did the likes', 'movie':belt_test_model_data})
        }
    })
});

//create one sample thing on load
var createSampleBeltTestModel = function () {
    let errs = new errorObject();
    let err_holder = [];
    console.log(`trying to make a sample MovieModel`,);
    var BeltTestModelInstance = new MovieModel();
    // BeltTestModelInstance.movie_title = 'Barney';
    // BeltTestModelInstance.type = 'cat';
    // BeltTestModelInstance.description = 'fat cat in Washington';
    // BeltTestModelInstance.skills = ['bird watching', 'killing','littering', 'something_else'];
    BeltTestModelInstance.movie_title = 'Blake';
    BeltTestModelInstance.type = 'Dog';
    BeltTestModelInstance.description = 'Likes lasagna';
    BeltTestModelInstance.skills.push({review: 'pooping'});
    var subdoc = BeltTestModelInstance.skills[0];
    console.log(`SKILL SUBDOC: `,subdoc);

    BeltTestModelInstance.save(function (err) {
        if (err) {
            // console.log(`there was an error saving to db`, err);
            errs.has_errors = true;
            errs.error_list.push(err.message);
            console.log(`there were errors saving to db`, err.message );
        } else {
            console.log(`successfully saved!`);
        }
    });
};
// createSampleBeltTestModel();


module.exports = router;










// router.get('/', function (req, res) {
//     console.log(`reached the router`,);
//     res.sendFile(path.resolve("./public/dist/index.html"));
// });
//
//
// //get all movies
// router.get('/movies', function (req, res) {
//     let errs = new errorObject();
//     let err_holder = [];
//     console.log(`arrived at GET movies...getting all movies`,);
//
//     MovieModels.find({}).
//     sort({stars: 1}).exec(function (err, movies) {
//         if (err) {
//             err_holder.push(err.message);
//             errs.has_errors = true;
//             errs.error_list.push(err.message);
//             console.log(`there was an error looking up movies`, err);
//             res.json({'message': 'there was an error', 'errors': err.message, 'err_holder': err_holder, 'errs': errs})
//         } else {
//             res.json({'message': 'successfully retrieved movies', 'movies': movies, 'errs': errs});
//         }
//     });
//
// });
//
//
// //COMPLETE: REVIEW router.get('/movies/:id', function(req, res){}
// //get a SINGLE author by ID
// router.get('/movies/:id', function (req, res) {
//     console.log(`reached individual movie lookup`,);
//     let errs = new errorObject();
//     let err_holder = [];
//     console.log(`req.body: `,req.body);
//
//     MovieModels.find({_id: req.params.id}).
//     sort({stars: -1}).exec(function (err, movie) {
//         if (err) {
//             err_holder.push(err.message);
//             errs.has_errors = true;
//             errs.error_list.push(err.message);
//             console.log(`there was an error looking up the movie`, err);
//             res.json({'message': 'there was an error', 'errors': err.message, 'err_holder': err_holder, 'errs': errs})
//         } else {
//             res.json({'message': 'successfully retrieved the movie', 'movie': movie, 'errs': errs});
//         }
//     });
//
// });
//
//
//
// //FIXME: backside validation errors - standardize the way they are sent back to the front
// //create a movie
// router.post('/movies', function (req, res) {
//     let errs = new errorObject();
//     let err_holder = [];
//     //new data recieved
//     console.log(`request.body: `,req.body);
//
//     console.log(`recieved request to make new movie`,);
//
//     let movie = new MovieModel();
//     console.log(`initiated model`,);
//
//     if (req.body.movie_title.length < 3) {
//         errs.has_errors = true;
//         errs.error_list.push("name must be at least 3 characters");
//     }
//     if (req.body.movie_genre.length < 3){
//         errs.has_errors = true;
//         errs.error_list.push("type must be at least 3 characters");
//     }
//     if (req.body.description.length < 3){
//         errs.has_errors = true;
//         errs.error_list.push("description must be at least 3 characters");
//     }
//
//     if (errs.has_errors) {
//         res.json({"message": "validation errors encountered when trying to save new movie", "errs": errs});
//     } else {
//         movie.movie_title = req.body.movie_title;
//         movie.movie_genre = req.body.movie_genre;
//         movie.description = req.body.description;
//
//         movie.save(function (err) {
//             if (err) {
//                 // console.log(`there was an error saving to db`, err);
//                 errs.has_errors = true;
//                 errs.error_list.push(err.message);
//                 console.log(`there were errors saving to db`, err.message );
//                 res.json({'message': 'unable to save new movie', 'errs': errs})
//             } else {
//                 console.log(`successfully saved!`);
//                 res.json({'message': 'Saved new movie!', 'errs': errs})
//             }
//         });
//     }
// });
//
//
//
// //TODO: function for adding a review on a movie
// router.put('/reviews/:id', function (req, res) {
//     console.log(`request to add new review to movie ${req.params.id }`,);
//     console.log(`BODY: `,req.body);
//
//     let errs = new errorObject();
//     let err_holder = [];
//
//     //VALIDATION FOR REVIEWS
//     if (req.body.stars < 1 || req.body.stars > 5) {
//         errs.has_errors = true;
//         errs.error_list.push("Stars may only be between 1 and 5");
//     }
//     if (req.body.review_text.length < 3) {
//         errs.has_errors = true;
//         errs.error_list.push("Reviews must be at least 3 characters long");
//     }
//     if (req.body.user_name.length < 3) {
//         errs.has_errors = true;
//         errs.error_list.push("User name must be at least 3 characters long");
//     }
//
//
//     if (errs.has_errors) {
//         res.json({"message":"there were errors adding the review", "errs": errs});
//
//     }
//     else {
//
//         //TODO: Find movie
//         let current_movie;
//         MovieModel.find({_id: req.params.id}).exec(function (err, movie) {
//             if (err) {
//                 console.log(`there was an error finding the movie`, err);
//             } else {
//                 console.log(`found movie`, movie);
//                 current_movie = movie;
//
//             }
//             console.log(`CURRENT REST:`, current_movie);
//         });
//
//         var opts = {runValidators: true, context: 'query'};
//         MovieModel.findOneAndUpdate({_id: req.params.id}, {
//                 $push: {
//                     reviews: {
//                         user_name: req.body.user_name,
//                         review_text: req.body.review_text,
//                         stars: req.body.stars
//                     }
//                 }
//             },
//             opts,
//             function (err, movie) {
//                 if (err) {
//                     console.log(`errors trying to add review`, err);
//                     errs.has_errors = true;
//                     errs.error_list.push(err.message);
//                     res.json({"message": "error while trying to add review", 'movie': movie, 'errs': errs});
//
//                 } else {
//                     res.json({"message": "Successfully added review!", 'movie': movie, 'errs': errs});
//
//                 }
//             });
//     }
//
// });
//
// //update an movie's name
// router.put('/movies/:id', function (req, res) {
//     let errs = new errorObject();
//     let err_holder = [];
//     console.log(`ID: `,req.params.id);
//     console.log(`reached movie updater. Body: `, req.body);
//
//
//     var opts = {runValidators: true , context: 'query'};
//     MovieModels.findOneAndUpdate({_id: req.params.id}, {
//         movie_title: req.body.movie_title,
//         movie_genre: req.body.movie_genre,
//         description: req.body.description,
//     }, opts, function (err) {
//         if (err) {
//             console.log(`there was an error updating`, err.message);
//             errs.has_errors = true;
//             errs.error_list.push(err.message);
//             res.json({'message': 'problem updating movie', 'errs': errs});
//
//         } else {
//             res.json({'message': 'successfully updated movie', 'errs': errs});
//         }
//     });
// });
//
//
//
//
// //UPDATE
// router.put('/add_belt_test_model/:movie_id', function (req, res) {
//     console.log(`got request to update author's quotes auth: `,req.params.movie_id);
//     let errors = [];
//     let movie_id = req.params.movie_id;
//     let text_to_add_as_quote = req.body.quote_text;
//
//     //validate quote length
//     if(text_to_add_as_quote.length < 3){
//         console.log(`you done messed up`,);
//         let err = new Error("quote is not long enough");
//         errors.push(err.message);
//         res.json({'message':'done with the thing', 'author':movie_id, 'errors': errors});
//
//     } else {
//         MovieModels.find({_id: movie_id}, function (err, author) {
//             if (err) {
//                 errors.push(err.message);
//                 res.json({"message":"error adding quote", "errors":errors})
//             } else {
//                 let author_to_update = author[0];
//                 console.log(`got the author, continue to ADD a quote:`,author);
//                 author[0].quotes.push({ quote_text: text_to_add_as_quote });
//                 author[0].save();
//                 res.json({'message':'Successfully saved', 'author':movie_id});
//             }
//         });
//     }
// });
//
//
//
// //DONE: router.delete('/', function(req, res){}
// router.delete('/movies/:id', function (req, res) {
//     let errs = new errorObject();
//     let err_holder = [];
//
//     console.log(`trying to delete the movie`,);
//     let movie_id = req.params.id;
//
//     console.log(`movie: ${movie_id}`);
//     MovieModels.remove({_id: req.params.id}, function (err) {
//         if (err) {
//             errs.has_errors = true;
//             errs.error_list.push(err);
//             res.json({'message': 'Error when deleting movie', 'errs': errs});
//         } else {
//             res.json({'message': 'successfully deleted movie', 'errs': errs});
//         }
//     });
// });
//
// //forward unresolved routes to Angular
// router.all("/*", (req,res,next) => {
//     console.log(`reached wildcard route...need to redirect to Angular templates`,);
//     res.sendFile(path.resolve("./public/dist/index.html"));
// });
//
//
// //TODO : function for liking movie
// router.put('/movies/like/:id', function (req, res) {
//     console.log(`like request: `, req.params.id);
//
//     MovieModels.findOneAndUpdate(
//         { _id: req.params.id },
//         {$inc: {likes: 1}}).exec(function(err, belt_test_model_data) {
//         if (err) {
//             throw err;
//         }
//         else {
//             console.log(belt_test_model_data);
//             res.json({'message': 'did the likes', 'movie':belt_test_model_data})
//         }
//     })
// });
//
//
//
//
// function update_by_quote_sub_id(){
//     MovieModels.findOne({'quote._id': quoteId}).then(author => {
//         let quote = author.quote.id(quoteId);
//         quote.votes = 'something';
//         return author.save();
//     });
// }
//
// // Note that sub document array return from mongoose are mongoose
// // array instead of the native array data type. So you can manipulate them using .id .push .pop .remove method
// // http://mongoosejs.com/docs/subdocs.html
//
//
// //create one sample thing on load
// var createSampleBeltTestModel = function () {
//     let errs = new errorObject();
//     let err_holder = [];
//     console.log(`trying to make a sample MovieModel`,);
//     var BeltTestModelInstance = new MovieModel();
//     // BeltTestModelInstance.movie_title = 'Barney';
//     // BeltTestModelInstance.type = 'cat';
//     // BeltTestModelInstance.description = 'fat cat in Washington';
//     // BeltTestModelInstance.skills = ['bird watching', 'killing','littering', 'something_else'];
//     BeltTestModelInstance.movie_title = 'Blake';
//     BeltTestModelInstance.type = 'Dog';
//     BeltTestModelInstance.description = 'Likes lasagna';
//     BeltTestModelInstance.skills.push({review: 'pooping'});
//     var subdoc = BeltTestModelInstance.skills[0];
//     console.log(`SKILL SUBDOC: `,subdoc);
//
//     BeltTestModelInstance.save(function (err) {
//         if (err) {
//             // console.log(`there was an error saving to db`, err);
//             errs.has_errors = true;
//             errs.error_list.push(err.message);
//             console.log(`there were errors saving to db`, err.message );
//         } else {
//             console.log(`successfully saved!`);
//         }
//     });
// };
// // createSampleBeltTestModel();
