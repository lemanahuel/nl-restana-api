module.exports = {
  PORT: process.env.PORT || 5001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo-list',
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  DOMAINS_WHITE_LIST: [
    'http://localhost:5000',
    'localhost:5000',
    'http://localhost:5001',
    'localhost:5001',
    'https://nl-restana-api.herokuapp.com',
    'https://nl-static-www.herokuapp.com',
    'http://nl-restana-api.herokuapp.com',
    'http://nl-static-www.herokuapp.com',
    'nl-restana-api.herokuapp.com',
    'nl-static-www.herokuapp.com']
};