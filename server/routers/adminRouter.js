const express = require('express');
const Show = require('../models/showModel')
const Cinema = require('../models/cinemaModel')
const Movie = require('../models/movieModel')
const Admin = require('../models/adminModel');
const auth = require('../middlewares/auth');

const router = new express.Router();

router.post('/create-admin', async (req, res) => {
    try {
        const admin = new Admin(req.body);
        const token = await admin.generateAuthToken();
        res.send({ admin, token });
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findAdminbyEmailAndPassword(email, password);
        const token = await admin.generateAuthToken();
        res.send({ admin, token })
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: e.message,
        })
    }
})

router.post('/admin/logout', auth, async (req, res) => {
    const admin = req.admin;
    try {
        admin.tokens = admin.tokens.filter((tokenDoc) => tokenDoc.token !== req.token)
        await admin.save()
        res.send(admin)
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: 'something went wrong'
        })
    }
})

router.post('/admin/add-cinema', auth, async (req, res) => {
    try {
        const cinema = new Cinema(req.body)
        await cinema.save()
        res.send(cinema)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/admin/add-show', auth, async (req, res) => {
    try {
        const show = new Show(req.body.show);
        const cinema = await Cinema.findById(req.body.show.cinema._id)
        cinema.shows = cinema.shows.concat({ show });
        await cinema.save();
        await show.save();
        res.send(show)
    } catch (e) {
        res.status(500).send(e);
    }
})

router.post('/admin/add-movie', auth, async (req, res) => {
    try {
        const movie = new Movie(req.body.movie)
        await movie.save();
        res.send(movie)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/admin/edit-movie', auth, async (req, res) => {
    const id = req.query.id;
    const updatedMovie = req.body.updatedMovie;
    try {
        const movie = await Movie.findByIdAndUpdate(id, { ...updatedMovie }, {
            runValidators: true,
            new: true
        });
        // const movie = await Movie.findOne({ title });
        // req.body.forEach(element => {
        //     movie.element=element||movie.element;
        // });
        await movie.save();
        res.send(movie);
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
    }
})
router.patch('/admin/edit-show', auth, async (req, res) => {
    const _id = req.query.id;
    const updatedShow = req.body.updatedShow
    try {
        const show = await Show.findByIdAndUpdate(_id, { ...updatedShow }, {
            runValidators: true,
            new: true
        });
        await show.save();
        res.send(show);
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
    }
})


module.exports = router;