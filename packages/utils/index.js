/**
 * 判断一个属性是否存在
 * @param obj 数据对象
 * @param key 要查找的键名
 * @returns {boolean}
 */
export function isInclude(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

//判断数据类型
export const isType = {
  isDataType(type) {
    return function(content) {
      return Object.prototype.toString.call(content) === `[object ${type}]`;
    };
  },
  init() {
    let arr = ['String', 'Boolean', 'Undefined', 'Array', 'Object', 'Number', 'Symbol', 'Function'],
      _self = this;
    arr.forEach((type) => {
      _self[`is${type}`] = _self.isDataType(type);
    });
  },
};
isType.init();

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}
