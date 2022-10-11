require('dotenv').config();

const amqplib = require('amqplib');

module.exports = {
    SendMail: async (queueName, payload) => {
        const connection = await amqplib.connect(process.env.AMQPLIB_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), { persistent: true });
    }
};