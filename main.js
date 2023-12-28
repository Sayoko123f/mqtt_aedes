const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);
const fs = require("fs");
const path = require("path");
const port = 1883;

const cat = fs.readFileSync("rainbow-cat.gif");

const filenames = fs.readdirSync(path.resolve("jpg"));
const images = filenames.map((e) => fs.readFileSync(`jpg/${e}`));
let imagePtr = 0;
function getImage() {
  imagePtr %= images.length;
  const image = images[imagePtr];
  imagePtr++;
  return image;
}

server.listen(port, function () {
  console.log("server started and listening on port ", port);
});

server.on("connection", (socket) => {
  console.log("connection");
  //   wait(1500).then(() => {
  //     aedes.publish(getSendData(), (err) => {
  //       if (err) {
  //         console.log("pubilsh", err);
  //       }
  //     });
  //   });
});

server.on("error", (err) => {
  console.log("error", err);
});

aedes.subscribe(
  "test2",
  (packet, cb) => {
    // console.log("test2: 收到資料", packet);
    const timestamp = new Date().toLocaleTimeString();
    const buffer = packet.payload;
    const message = buffer.toString();
    console.log(`[${timestamp}]: ${message}`);
  },
  () => {
    console.log("server subscribe test2");
  }
);

run();

async function run() {
  while (true) {
    await wait(40);
    aedes.publish(getSendData(), (err) => {
      if (err) {
        console.log("pubilsh", err);
      }
    });
  }
}

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getSendData(topic = "test") {
  return {
    topic,
    cmd: "publish",
    messageId: 42,
    message: "Hello world",
    data: "Hello Andrew",
    qos: 2,
    dup: false,
    payload: getImage(),
    retain: false,
    properties: {
      // optional properties MQTT 5.0
      payloadFormatIndicator: true,
      messageExpiryInterval: 4321,
      topicAlias: 100,
      responseTopic: "topic",
      correlationData: Buffer.from([1, 2, 3, 4]),
      userProperties: {
        test: "test",
      },
      subscriptionIdentifier: 120, // can be an Array in message from broker, if message included in few another subscriptions
      contentType: "test",
    },
  };
}
