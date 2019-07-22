type IKeyStatus = {
  up: boolean;
  down: boolean;
  right: boolean;
  left: boolean;
  A: boolean;
  B: boolean;
  pressedKey: undefined | IKey
}

export const keyStatus: IKeyStatus = {
  up: false,
  down: false,
  left: false,
  right: false,
  A: false,
  B: false,
  // todo 这个对象上直接写getter和setter
  pressedKey: undefined
}
