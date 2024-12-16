const AnimationController = {
  time: 0,
  update(t) {
    this.time += t;
    },
};
console.log(AnimationController.time);

export default AnimationController;
