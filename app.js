const path = require('path');
const express = require('express');
// const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
// const compression = require('compression');
const cors = require('cors');
// const bookingController = require('./controllers/bookingController');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

// Start express App
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// IMPLAMENT CORS

app.use(cors());
// Access-Control-Allow-Origin
// api.natours.com, front-end natours.com

// We only allow this ulr to make request
// app.use(
//   cors({
//     origin: 'https://www.natours.com'
//   })
// );

// For not simple request, DEL,PUT,PATCH or req with cookies etc.

// For only one Route
// app.options('/api/v1/tours/:id', cors());

// For all Routes
app.options('*', cors());

// 1) GLOBAL MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP headers

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
          'https://cdn.jsdelivr.net',
          'https://js.stripe.com' // Added Stripe source
        ],
        'frame-src': [
          "'self'",
          'https://js.stripe.com' // Allow framing of Stripe
        ],
        'style-src': [
          "'self'",
          'https://*.googleapis.com',
          'https://unpkg.com'
        ],
        'img-src': [
          "'self'",
          'data:',
          'https://*.openstreetmap.org',
          'https://unpkg.com'
        ],
        'connect-src': [
          "'self'",
          'ws://127.0.0.1:63465', // Existing port
          'ws://127.0.0.1:63534', // New port
          'ws://127.0.0.1:57337' // Added port
        ]
      }
    }
  })
);

// Development login
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // Fix the typo here
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// app.post(
//   '/webhook-checkout',
//   bodyParser.raw({ type: 'application/json' }),
//   bookingController.webhookCheckout
// );

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Data sanaitization agains XSS
app.use(xss());

// Prevent parametar pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);
// app.use(compression);

// Test middlware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES

app.use('/', viewRouter);
// app.use('/api/v1/tours', cors(), tourRouter); // For a specific route
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
