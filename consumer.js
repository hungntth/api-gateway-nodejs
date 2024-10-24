const amqp = require("amqplib");

const runConsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.consume(
      queueName,
      (messages) => {
        console.log(`Received ${messages.content.toString()}`);
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

runConsumer().catch(console.error);
