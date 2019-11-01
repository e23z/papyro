/**
 * @function cleanRelativePath
 * @description Removes the '../' or './' from a relative path.
 * @param path {string} - The relative path.
 * @return `{string}` The path without relative notation.
 */
export const cleanRelativePath = (path: string) => path.replace(/^(\.+\/)+/, '').trim();

/**
 * @function hashObj
 * @description Hashes an object in a simple readable string format.
 * @param obj {any} - The object to be hashed.
 * @return `{string}` The hash of the object.
 */
export const hashObj = (obj: any) => Object.getOwnPropertyNames(obj).map(p => obj[p]).join('_');

/**
 * @function contains
 * @description Checks if the array contains the value.
 * @param arr {any[]} - The array to be searched on.
 * @param value {any} - The value to be searched for.
 * @return `{boolean}` True if the array contains the value. Otherwise, false.
 */
export const contains = (arr: any[], value: any) => arr.indexOf(value) !== -1;

/**
 * @function notContains
 * @description Checks if the array doesn't contains the value.
 * @param arr {any[]} - The array to be searched on.
 * @param value {any} - The value to be searched for.
 * @return `{boolean}` True if the array doesn't contains the value. Otherwise, false.
 */
export const notContains = (arr: any[], value: any) => !contains(arr, value);

/**
 * @function chunk
 * @param arr {any[]} - The array to be split into equal-sized chunks.
 * @param size {number} - The number of elements in each chunk.
 * @return `any[][]` - Returns an array of equal sized arrays.
 */
export const chunk = (arr: any[], size: number): any[][] => {
  const chunkedArr = new Array(size).fill(0).map(() => new Array());
  let copiedArr = [...arr];
  let index = 0;
  while (copiedArr.length > 0) {
    if (index > size - 1)
      index = 0;
    chunkedArr[index].push(copiedArr.shift());
    index++;
  }
  return chunkedArr;
};

/**
 * @function getExtension
 * @description Extracts the extension of a file from the filename.
 * @param filename {string} - The string to extract the file extension.
 * @return `{string}` - The extracted file extension.
 */
export const getExtension = (filename: string) => {
  if (!filename) return '';
  const match = filename.match(/\.[a-z0-9]+$/gi);
  return match ? match[0].replace('.', '').toLocaleLowerCase() : '';
}

/**
 * @function copyToClipboard
 * @description Copy the text to the clipboard.
 * @param str {string} - Text to be copied to the clipboard.
 */
export const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

/**
 * @function nowEpoch
 * @description Returns the current date and time as an unix timestamp
 * @return `{number}` - The current unix timestamp.
 */
export const nowEpoch = () => Math.round(new Date().getTime() / 1000);

/**
 * @function uuidv4
 * @description Generate a simple uuid v4
 * @return `{type}` - A uuid v4 string
 */
export const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  const v = c == 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

/**
 * @function uuid
 * @description Generate a simple uuid
 * @return `{type}` - A uuid string
 */
export const uuid = () => 'xx'.replace(/x/g, c => ("000" + ((Math.random() * 46656) | 0).toString(36)).slice(-3));

/**
 * @function truncate
 * @description Truncates a big string to the given length
 * @param str {string} - The string to be truncated
 * @param len {number} - The maximum number of characters the string could have
 * @param ending {string} - The ending to the appended to the truncated string
 * @return `{string}` The truncated string
 */
export const truncate = (str: string, len: number, ending: string = '...') => str.length > len ? `${str.substr(0, len)} ${ending}` : str;