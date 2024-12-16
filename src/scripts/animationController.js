const AnimationController = {
  time: 0,
  update(delta) {
    this.time += delta;
  },
};

export default AnimationController;
