var amqp = require("amqplib");

(async () => {
  const connection = await amqp.connect("amqp://rabbitmq:5672");
  if (connection instanceof Error) throw connection;

  const channel = await connection.createChannel();
  if (channel instanceof Error) throw channel;

  const users = await getUsers(channel);
  console.log(users);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 2000)
})();

function getUsers (channel) {
  return rpcClient("users:index", JSON.stringify({hoge: "name"}));
}

function rpcClient (queue, dataStr) {
  return new Promise (async (res) => {
    const channel = await getChannel();
    const q = await channel.assertQueue("", { exclutive: true });
    if (q instanceof Error) throw q;

    const correlationId = Math.random().toString();

    channel.consume(q.queue, (msg) => {
      if (msg.properties.correlationId !== correlationId) return;

      res(JSON.parse(msg.content.toString()));
    });

    channel.sendToQueue(queue, Buffer.from(dataStr), {
      correlationId: correlationId,
      replyTo: q.queue,
    });
  });
}

async function getChannel () {
  const connection = await amqp.connect("amqp://rabbitmq:5672");
  if (connection instanceof Error) throw connection;

  const channel = await connection.createChannel();
  if (channel instanceof Error) throw channel;

  return channel;
}
