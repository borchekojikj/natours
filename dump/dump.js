const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // Build the QUERY

    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => {
      delete queryObj[el];
    });

    // // 1B) Advanced filtering

    // gte, gt, lte, lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => {
      return `$${match}`;
    });

    // console.log(JSON.parse(queryStr));
    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);
      query = query.sort(sortBy);
      // sort('price ratingsAverage')
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      // query = query.select('name duration price); // Projecting
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) Pagination

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;

    const skip = (page - 1) * limit;

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exits!');
    }
    // page=2&limit=10
    query = query.skip(skip).limit(limit);

    // EXECUTE THE QUERY

    // const features = new APIFeatures(Tour.find(), req.query)
    //   .filter()
    //   .sort()
    //   .limitFields()
    //   .paginate();

    // const tours = await features.query;
    const tours = await query;
    // Example how the quert could look like  query.sort().skip().limit();

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }

  // console.log(queryObj, req.query);

  // Solution 1 for filtering
  // const query =  Tour.find({
  //   duration: 5,
  //   difficulty: 'easy'
  // });

  // Manual Query
  // {difficulty: 'easy, duration: {$gte: 5}}

  // Solution 2 for filtering
  // const query =  Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');
};

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// exports.getAllTours = async (req, res) => {
//   try {
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();

//     const tours = await features.query;

//     res.status(200).json({
//       status: 'success',
//       requestedAt: req.requestTime,
//       results: tours.length,
//       data: {
//         tours
//       }
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: 'fail',
//       message: error.message
//     });
//   }

// console.log(queryObj, req.query);

// Solution 1 for filtering
// const query =  Tour.find({
//   duration: 5,
//   difficulty: 'easy'
// });

// Manual Query
// {difficulty: 'easy, duration: {$gte: 5}}

// Solution 2 for filtering
// const query =  Tour.find()
//   .where('duration')
//   .equals(5)
//   .where('difficulty')
//   .equals('easy');
// };

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));

//   // res.status(404).json({
//   //   status: 'fail',
//   //   message: `Can't find ${req.originalUrl} on this server!`
//   // });

//   // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
//   // err.status = 'fail';
//   // err.statusCode = 404;

//   // next(err);
// });

/*

GMAIL SEND MAIL

const nodemailer = require('nodemailer');

const sendEmail = options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    // Active in gmail "less secure app" option
  });
  // 2) Define the email options

  // 3) Actually send the email
};


*/
