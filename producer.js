const amqp = require("amqplib");
const messages = "new a product: Title abcassd3333";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.sendToQueue(queueName, Buffer.from(messages));
    console.log(`message sent: ${messages}`);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

runProducer().catch(console.error);
