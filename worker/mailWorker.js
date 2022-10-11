require('dotenv').config();

const amqplib = require('amqplib');
const nodemailer = require('nodemailer');
const mailjetTransport = require('nodemailer-mailjet-transport');

const queueName = "sendMail";
const consumeTask = async () => {
    const connection = await amqplib.connect(process.env.AMQPLIB_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1);

    console.log(`Waiting for messages in queue: ${queueName}`);

    channel.consume(queueName, msg => {
        // console.log(JSON.parse(msg.content));
        const taskData = JSON.parse(msg.content);
        return new Promise((resolve, reject) => {
            let mailConfig = {
                auth: {
                    apiKey: process.env.EMAIL_API_KEY,
                    apiSecret: process.env.EMAIL_SECRET_KEY
                }
            };

            const transporter = nodemailer.createTransport(mailjetTransport(mailConfig));

            let mailOptions = {
                from: '"RODEVHIT -" <rodevhit@gmail.com>',
                to: taskData.to,
                subject: taskData.subject,
                text: "Plaintext version of the message",
                html: "<p>HTML version of the message</p>"
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
            return null;
        });
    }, { noAck: true })
}

consumeTask();
