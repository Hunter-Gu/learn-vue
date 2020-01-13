import Watcher from "../../src/learn-vue/observer/watcher";
import { defineReactive } from "../../src/learn-vue/observer/index";

test("Observe key of data", () => {
  const key = "a";
  const dupVal = "1";
  const values = [dupVal, dupVal, "2", "3", "4", "5"];
  const oldValues = [];
  const getCur = () => oldValues.slice(-1)[0];
  const getPrev = () => oldValues.slice(-2)[0];
  const next = () => {
    oldValues.push(values.shift());
    return getCur();
  };
  const obj = {
    [key]: next()
  };
  defineReactive(obj, key, obj[key]);
  new Watcher(obj, key, (_newVal, _oldVal) => {
    expect(_newVal).toBe(getCur());
    expect(_oldVal).toBe(getPrev());
  });

  while ((obj.a = next()));
});
