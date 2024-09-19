const express = require('express');
const bookingCotroller = require('./../controllers/bookingController');

const authController = require('./../controllers/authController');

const router = express.Router();

// /

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingCotroller.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingCotroller.getAllBookings)
  .post(authController.protect, bookingCotroller.createBooking);

router
  .route('/:id')
  .get(bookingCotroller.getBooking)
  .delete(bookingCotroller.deleteBooking)
  .patch(bookingCotroller.updateBooking);

module.exports = router;
