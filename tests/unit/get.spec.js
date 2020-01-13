import get from "@/learn-vue/utils/get";

test("test string path of get", () => {
  const value = "c";
  const defaultVal = "default";
  const sub = {
    b: value
  };
  const obj = {
    a: sub
  };

  expect(get(obj, "a.b")).toBe(value);
  expect(get(obj, "a")).toBe(sub);
  expect(get(obj, "b", defaultVal)).toBe(defaultVal);
});
