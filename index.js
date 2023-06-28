var express    = require("express");
const cors = require('cors')
const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoice');

const authenticationMiddleware = require('./middleware/authentication')


var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

var router = express.Router();

router.get('/', function(req, res) {
    console.log('ada')
    res.json({ message: 'success' });
});


app.use('/auth', authRoutes);
app.use('/invoice', invoiceRoutes)

app.use('/', router);
const PORT = process.env.PORT || 4000
app.listen(PORT, console.log(`app listening on port ${PORT}`))