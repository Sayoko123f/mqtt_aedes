const fs = require("fs");
const path = require("path");

const RICKY_DIR = path.resolve(__dirname, "assets", "ricky");

function ricky() {
  let ptr = 0;
  const filenames = fs.readdirSync(RICKY_DIR);
  const images = filenames.map((e) => fs.readFileSync(path.join(RICKY_DIR, e)));

  return function rickyTick() {
    ptr %= images.length;
    const image = images[ptr];
    ptr++;
    return image;
  };
}

function rainbowCat() {
  // const cat = fs.readFileSync("rainbow-cat.gif");
}

module.exports = {
  ricky,
};
