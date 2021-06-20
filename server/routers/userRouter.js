const express = require('express');
const Show = require('../models/showModel')
const Cinema = require('../models/cinemaModel');
const Movie = require('../models/movieModel');
const Review = require('../models/reviewModel')

const router = new express.Router();

router.get('/cinema-shows', async (req, res) => {
    const cinemaTitle = req.query.title;
    let moviesInCinema = new Map();
    try {
        const cinema = await Cinema.findOne({ title: cinemaTitle })
        const populatedCinemaByShows = await cinema.populate(`shows.show`).execPopulate();
        const populatedCinemaByShowsAndMovies = await populatedCinemaByShows.populate(`shows.show.movie`).execPopulate();
        populatedCinemaByShowsAndMovies.shows.forEach(show => {
            if (moviesInCinema.has(show.show.movie._id))
                moviesInCinema.set(show.show.movie._id, [...moviesInCinema.get(show.show.movie._id), show.show])
            else
                moviesInCinema.set(show.show.movie._id, [show.show])
        });
        const arrayMap = Array.from(moviesInCinema)
        res.send(arrayMap)
    } catch (e) {
        console.log(e.message)
        res.status(500).send(e)
    }
})

router.get('/movie-schedualedInACinema', async (req, res) => {
    const cinemaTitle = req.query.cinemaTitle;
    const movieTitle = req.query.movieTitle;
    const finalMovieShows = []
    try {
        const cinema = await Cinema.findOne({ title: cinemaTitle })
        const cinemaPopulatedShows = cinema.populate('shows.show').execPopulate();
        const cinemaPopulatedShowsAndMovies = cinemaPopulatedShows.populate('shows.show.movie').execPopulate();
        cinemaPopulatedShowsAndMovies.shows.forEach((show) => {
            if (show.movie.title === movieTitle) {
                finalMovieShows.push(show)
            }
        })
        res.send(finalMovieShows)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/takeSeats', async (req, res) => {
    const seats = req.body.seats;
    const showID = req.body.showID
    try {
        const show = await Show.findById(showID);
        seats.forEach((seat) => {
            show.seats[seat.number].isTaken = true;
        })
        res.send(show.seats)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/get-cinema', async (req, res) => {
    const title = req.query.title;
    try {
        const cinema = await Cinema.findOne({ title });
        if (!cinema)
            throw new Error('No Cinema Data')
        res.send(cinema)
    } catch (e) {
        res.status(400).send({
            status: 400,
            message: e
        })
    }
})
router.get('/get-movie', async (req, res) => {
    const id = req.query.id;
    try {
        const movie = await Movie.findById(id);
        if (!movie)
            throw new Error('No Movie Data')
        const populatedMovie = await movie.populate('reviews.review').execPopulate();
        // console.log(populatedMovie)
        res.send(populatedMovie)
    } catch (e) {
        res.status(400).send({
            status: 400,
            message: e
        })
    }
})
router.get('/get-show', async (req, res) => {
    const id = req.query.id;
    try {
        const show = await Show.findById(id);
        if (!show)
            throw new Error('No Show Data')
        const populatedShow = await show.populate('movie').execPopulate();
        res.send(populatedShow)
    } catch (e) {
        res.status(400).send({
            status: 400,
            message: e
        })
    }
})

router.get('/all-movies', async (req, res) => {
    try {
        const movies = await Movie.find({})
        res.send(movies)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/all-shows', async (req, res) => {
    try {
        const shows = await Show.find({})
        const populatedShows = [];
        for (let i = 0; i < shows.length; i++)
            populatedShows.push(await shows[i].populate('movie').execPopulate());
        res.send(populatedShows)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/all-cinemas', async (req, res) => {
    try {
        const cinemas = await Cinema.find({})
        const populatedCinemas = [];
        for (let i = 0; i < cinemas.length; i++)
            populatedCinemas.push(await cinemas[i].populate('shows.show').execPopulate());
        res.send(populatedCinemas)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/add-review', async (req, res) => {
    const movieID = req.query.movieID;
    try {
        const movie = await Movie.findById(movieID);
        const review = new Review(req.body.review);
        movie.reviews = movie.reviews.concat({ review });
        await review.save();
        await movie.save();
        res.send(review)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;