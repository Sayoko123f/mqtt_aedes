const TOPIC = {
  prefix: "topicPreTest",
  remote: "remote",
  camera: "camera",
  cameraStatus: "cameraStatus",
};

/**
 *
 * @param {'prefix' | 'remote' | 'camera' | 'cameraStatus'} str
 * @returns {string}
 */
function topic(str) {
  switch (str) {
    case "prefix":
      return TOPIC.prefix;
    case "remote":
      return `${TOPIC.prefix}/${TOPIC.remote}`;
    case "camera":
      return `${TOPIC.prefix}/${TOPIC.camera}`;
    case "cameraStatus":
      return `${TOPIC.prefix}/${TOPIC.cameraStatus}`;
    default:
      throw new Error(`Invalid topic "${str}."`);
  }
}

/**
 * @typedef {{v?: boolean; f?: boolean}} RemoteCommand
 * @param {string} input
 * @returns {RemoteCommand | null}
 */
function remoteParser(input) {
  try {
    const data = JSON.parse(input);
    const output = {};
    if ("v" in data && typeof data.v === "boolean") {
      output.v = data.v;
    }
    if ("f" in data && typeof data.f === "boolean") {
      output.f = data.f;
    }
    return output;
  } catch (err) {
    console.error(err);
    return null;
  }
}

/**
 *
 * @param {RemoteCommand} cmd
 * @param {import('./camera').Camera} camera
 */
function remoteHandler(cmd, camera) {
  if (typeof cmd.f === "boolean") {
    camera.flash = cmd.f;
  }
  if (typeof cmd.v === "boolean") {
    camera.streaming = cmd.v;
  }
  return camera;
}

module.exports = {
  topic,
  remoteParser,
  remoteHandler,
};
