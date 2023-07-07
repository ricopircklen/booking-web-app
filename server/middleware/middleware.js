// This middleware is used to validate that anyone who uses the API is authenticated to use it so that no outsiders can make
// CRUD-queries and affect our system.
// To use withAuth, just add it to the backend. In the front, you also need to provide a token in headers.
// E.g. BACK:  app.get('/api/users', withAuth, (req, res) =>
// E.g. FRONT:  axios
//    .get(baseUrl + '/users', {
//        headers: {
//          'Content-Type': 'application/json',
//          token: localStorage.getItem('jwtToken')
//        }
//      })

const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

// Helper function for verifying token
const withAuth = function(req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['token'] ||
    req.headers['x-access-token'] ||
    req.cookies.token;

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};
module.exports = withAuth;
