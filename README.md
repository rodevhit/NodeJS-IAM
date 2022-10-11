# NodeJS - IAM

Rest API with auth, crud, manage user role


## Technologies & tools used

- Nodejs
- ExpressJS
- Sequelize
- mySQL
- Redis
- JWT
- RabbitMQ
- PM2
- Swagger


## Features & Implementations

- Registering user by authorised user(admin)
- Login user
- Validation with JOI
- Access and Refresh token
- Password hashing
- Token generation using JWT
- Routes authorization with express
- HTTP only cookies used
- Confimation email on registering managed by child process
- multiple worker managed by PM2
- Queue architecture implemented using rabbitMQ
- Used redis for the security of tokens validation
- Nodemailer used for sending emails
