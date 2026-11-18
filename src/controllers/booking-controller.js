const { BookingService } = require('../services/index');
const { StatusCodes } = require('http-status-codes');
const bookingService = new BookingService();

const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');

class BookingController {

    async sendMessageToQueue(req, res) {
        const channel = await createChannel();
        const payload = {
            data: {
                subject: 'This is a notification from queue',
                content: 'Some queue will subscribe this',
                receipientEmail: req.body.email || 'test@gmail.com',
                notificationTime: new Date().toISOString()
            },
            service: 'CREATE_TICKET'
        };
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
        return res.status(200).json({
            message: 'Successfully published the event'
        });
    }

    async getBooking(req, res) {
        try {
            const response = await bookingService.getBooking(req.params.id);
            if (!response) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    data: {},
                    message: 'Booking not found',
                    success: false,
                    err: 'No booking found with the given id'
                });
            }
            return res.status(StatusCodes.OK).json({
                data: response,
                message: 'Successfully fetched the booking',
                success: true,
                err: {}
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                data: {},
                message: error.message,
                success: false,
                err: error.explanation
            });
        }
    }

    async createBooking(req, res) {
        try {
            const response = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                data: response,
                message: 'Successfully completed the booking',
                success: true,
                err: {}
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                data: {},
                message: error.message,
                success: false,
                err: error.explanation
            });
        }
    }
}

module.exports = BookingController;
