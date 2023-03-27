const Review = require('../models/Reviews');

module.exports = async (req, res, next) => {
  try {
    const check = await Review.getById(req.params.id);
    if (
      check &&
      (req.user.email === 'admin' || check.user_id === req.user.id)
    ) {
      next();
    } else {
      throw new Error('This page is unavailable.');
    }
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
