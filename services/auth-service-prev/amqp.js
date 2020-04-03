var amqp = require("amqplib");

(async () => {
  const connection = await amqp.connect("amqp://rabbitmq:5672");
  if (connection instanceof Error) throw connection;

  const channel = await connection.createChannel();
  if (channel instanceof Error) throw channel;

  usersIndex(channel);
})();

async function usersIndex (channel) {
  const queue = "users:index";

  await channel.assertQueue(queue, { durable: false });
  channel.consume(queue, async (msg) => {
    console.log(`arrived: ${msg.content.toString()}`);

    const users = await getUsers();
    channel.sendToQueue(
      msg.properties.replyTo,
      Buffer.from(JSON.stringify(users)),
      { correlationId: msg.properties.correlationId }
    );
    channel.ack(msg);
  });
}

const getUsers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => { resolve(users) }, 500);
  });
};

const users = [
  { name: "hoge", age: 21 },
  { name: "domo", age: 34 },
  { name: "kore", age: 23 },
  { name: "soukai", age: 23 },
  { name: "hm", age: 23 },
];
