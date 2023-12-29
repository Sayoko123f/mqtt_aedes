class Camera {
  /**
   *
   * @param {{streaming: boolean; flash: boolean}} options
   */
  constructor(options = {}) {
    this.streaming = options.streaming ?? false;
    this.flash = options.flash ?? false;
  }

  toJson() {
    return JSON.stringify({
      streaming: this.streaming,
      flash: this.flash,
    });
  }
}

module.exports = {
  Camera,
};
