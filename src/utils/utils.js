export function isEmpty(obj) {
  if (!obj && obj !== 0 && obj !== '') {
    return true;
  }
  return isEmptyObject() || isEmptyArray()
}

export function isEmptyArray(obj) {
  return Array.prototype.isPrototypeOf(obj) && obj.length === 0;
}

export function isEmptyObject(obj) {
  // let name;
  // for (name in obj) {
  //   return false;
  // }
  // return true;
  return Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0
}
