import { toQueryString } from "./utils";

describe("toQueryString", () => {
  it("should serialize plain objects", () => {
    const query = toQueryString({ id: 1, name: "plain" });
    expect(query).toBe("id=1&name=plain");
  });

  it("should serialize nested objects", () => {
    const query = toQueryString({ foo: "hi there", bar: { blah: 123, quux: [1, 2, 3] } });
    expect(query).toBe(
      "foo=hi%20there&bar%5Bblah%5D=123&bar%5Bquux%5D%5B0%5D=1&bar%5Bquux%5D%5B1%5D=2&bar%5Bquux%5D%5B2%5D=3"
    );
  });

  it("should serialize Date to ISO format", () => {
    const query = toQueryString({ date: new Date(Date.parse("2016-02-29T01:02:03Z")) });
    expect(query).toBe("date=2016-02-29T01%3A02%3A03.000Z");
  });

  it("should skip null values", () => {
    const query = toQueryString({ a: 1, b: null, c: 3 });
    expect(query).toBe("a=1&c=3");
  });

  it("should skip undefined values", () => {
    const query = toQueryString({ a: 1, b: void 0, c: 3 });
    expect(query).toBe("a=1&c=3");
  });

  it("should serialize null as empty string", () => {
    const query = toQueryString(null);
    expect(query).toBe("");
  });

  it("should throw with non-object arhument", () => {
    expect(() => {
      toQueryString(void 0);
    }).toThrow("Argument: obj is not an Object");
    expect(() => {
      toQueryString(true);
    }).toThrow("Argument: obj is not an Object");
    expect(() => {
      toQueryString(100);
    }).toThrow("Argument: obj is not an Object");
    expect(() => {
      toQueryString("string");
    }).toThrow("Argument: obj is not an Object");
  });
});
