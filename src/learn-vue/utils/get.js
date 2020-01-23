import { isNil } from "./util";

const PATH_SPLICE = ".";

export function get(target, path, defaultVal) {
  if (isNil(target)) return defaultVal;

  path = path.split(PATH_SPLICE);
  let key;
  while ((key = path.shift())) {
    if (!(key in target)) return defaultVal;

    target = target[key];
  }

  return target;
}

export default get;
