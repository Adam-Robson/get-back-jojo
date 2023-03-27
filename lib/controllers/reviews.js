const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const checkAuth = require('../middleware/checkAuth');
const Review = require('../models/Reviews');

module.exports = Router()
  .get('/:id', async (req, res, next) => {
    try {
      const reviews = await Review.getById(req.params.id);
      if (!reviews) {
        res.status(404);
        res.send();
      }
      res.json(reviews);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', [authenticate, checkAuth], async (req, res, next) => {
    try {
      const review = Review.delete(req.params.id);
      res.json(review);
    } catch (e) {
      next(e);
    }
  });
