const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', () => {
  // console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

// Ensure <PASSWORD> is replaced with the actual password
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(async () => {
  console.log('DB connection successful');
});
// .catch(err => console.error('DB connection error: RRR 🥳🥳🥳🥳'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}s...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
