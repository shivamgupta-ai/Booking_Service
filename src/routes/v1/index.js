const express = require('express');
const router = express.Router();

const { BookingController } = require('../../controllers/index');
const bookingController = new BookingController();

router.get('/info', (req, res) => {
    return res.json({
        message: 'Response from routes'
    });
});

router.post('/bookings', bookingController.createBooking);
router.get('/bookings/:id', bookingController.getBooking);
router.post('/publish', bookingController.sendMessageToQueue);

module.exports = router;
