require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
require('./helpers/init_redis')

/* Load Swagger configuration file */
const SwaggerConfigOption = require('./config/swaggerConfig');

/* Load the routes */
const AuthRoute = require('./Routes/Auth.route')



const app = express();

var whitelist = process.env.ORIGIN_APP_URL;
var corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS, this site ${origin} does not have an access. Only specific domains are allowed to access it.`));
        }
    },
    credentials: true
}

/* use the middleware */
app.use(cors(corsOptions));
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(helmet());

/* use the middleware */

/* swagger declaration */
const specs = swaggerJsdoc(SwaggerConfigOption);
const swaggerUi = require('swagger-ui-express');
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(specs));
/* swagger declaration */

/* use the route */
app.use('/auth', AuthRoute)
app.get('/', async (req, res, next) => {
  res.send('Looking for default route.')
})

/* use the route */

/* Error Handler */
app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

/* Error Handler */

const PORT = process.env.PORT || 8001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
