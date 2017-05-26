import { CXT_ROLE, CXT_BG, CXT_MISC, CXT_W, CXT_H } from '../global/const';
import { inputParam } from '../global/var';

// 延时函数
export function delayTimeout(option: delayOption, fn: () => void) {
  let count = option.count;

  count ? count -= 1 : (count = option.amount) && fn();
  option.count = count;
}

// 清除画布
export function cleanCxt(...types: string[]) {
  let typeArr = types[0] === 'all' ? ['role', 'bg', 'misc'] : types;
  let cxt = { CXT_ROLE, CXT_BG, CXT_MISC };

  typeArr.forEach(ele => cxt[`CXT_${ele.toUpperCase()}`].clearRect(0, 0, CXT_W, CXT_H));
}

// 处理对应按键按下的操作
export function keyboardOperate(operate: operate) {
  if (inputParam.isPressed && typeof operate[inputParam.pressedKey] === 'function') {
    inputParam.isPressed = false;
    operate[inputParam.pressedKey]();
  }
}

// 单词首字母大写
export function firstUpperCase(str: string): string {
  return str.toLowerCase().replace(/( |^)[a-z]/g, ele => ele.toUpperCase());
}