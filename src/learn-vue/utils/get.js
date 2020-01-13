const PATH_SPLICE = ".";

export default function get(target, path, defaultVal) {
  path = path.split(PATH_SPLICE);
  let key;
  while ((key = path.shift())) {
    if (!(key in target)) return defaultVal;

    target = target[key];
  }

  return target;
}
