export class PlayerAnimation {
  static readonly RUN_SPEED = 2.35;

  static cycle(phase: number) {
    const swing = Math.sin(phase);
    const follow = Math.sin(phase - 0.28);
    const lift = Math.abs(Math.sin(phase));

    return {
      leftLeg: -swing,
      rightLeg: swing,
      leftKnee: Math.max(0, swing) * 0.32,
      rightKnee: Math.max(0, -swing) * 0.32,
      leftArm: swing * 0.82,
      rightArm: -swing * 0.82,
      bob: lift * 2.1,
      lean: -0.035,
      torsoTwist: follow * 0.03,
      hair: -swing * 0.12,
    };
  }

  static jumpPose() {
    return {
      leftLeg: 0.42,
      rightLeg: -0.28,
      leftKnee: 0.45,
      rightKnee: 0.32,
      leftArm: -0.85,
      rightArm: 0.7,
      bob: 0,
      lean: -0.08,
      torsoTwist: 0.04,
      hair: 0.35,
    };
  }

  static idleBreath(time: number) {
    return Math.sin(time * 2.4) * 1.6;
  }
}
