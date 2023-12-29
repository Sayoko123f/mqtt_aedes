const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);
const { topic, remoteParser, remoteHandler } = require("./src/topic.js");
const { Camera } = require("./src/camera.js");
const { infiniteLoop } = require("./src/utils.js");
const { ricky } = require("./src/image_provider.js");

const port = 1883;
const camera = new Camera();

main();

async function main() {
  server.listen(port, function () {
    console.log("server started and listening on port ", port);
  });

  server.on("connection", (socket) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}]: new connection.`);
  });

  server.on("error", (err) => {
    console.log("error", err);
  });

  aedes.subscribe(
    topic('remote'),
    (packet, cb) => {
      const timestamp = new Date().toLocaleTimeString();
      if (!packet.payload) {
        console.warn(`[${timestamp}]: Invalid payload.`);
        return;
      }
      const maybeJson = packet.payload.toString();
      const maybeData = remoteParser(maybeJson);

      if (!maybeData) {
        console.warn(`[${timestamp}]: Invalid data.`);
        return;
      }
      console.log(maybeData);
      remoteHandler(maybeData, camera);
    },
    () => {
      console.log(`server subscribe ${topic("remote")}.`);
    }
  );
  run();
}

async function run() {
  const getRicky = ricky();
  infiniteLoop(40, () => {
    aedes.publish(pack(topic("camera"), getRicky()), (err) => {
      if (err) {
        console.log("[ERROR]: pubilsh ricky, ", err);
      }
    });
  });

  infiniteLoop(2000, () => {
    aedes.publish(pack(topic("cameraStatus"), camera.toJson()), (err) => {
      if (err) {
        console.log("[ERROR]: pubilsh ricky, ", err);
      }
    });
  });

  infiniteLoop(3000,()=>{
    console.log(camera.toJson());
  })
}

/**
 *
 * @param {string} topic
 * @param {any} payload
 * @returns
 */
function pack(topic, payload) {
  return {
    topic,
    payload,
  };
}
