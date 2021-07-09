import { BetterURL } from "../src";

describe("BetterURL", () => {
  it("work like URL", () => {
    const url = new BetterURL("/hello", "https://example.com");
    expect(url.href).toEqual("https://example.com/hello");
  });

  it("creates URL and preserves baseURL path", () => {
    const url = new BetterURL("/hello", "https://example.com/path");
    expect(url.href).toEqual("https://example.com/path/hello");
  });

  it.skip("creates URL and preserves baseURL path and deals with repeated slashes", () => {
    const url = new BetterURL("///hello", "https://example.com/path/");
    expect(url.href).toEqual("https://example.com/path/hello");
  });

  it("creates URL and preserves baseURL path and queryparams", () => {
    const url = new BetterURL("/subpath", "https://example.com/path?q=hello");
    expect(url.href).toEqual("https://example.com/path/subpath");
  });

  it("creates URL and omits base if present on first argument", () => {
    const url = new BetterURL("https://flyyer.io/subpath", "https://example.com/path?q=hello");
    expect(url.href).toEqual("https://flyyer.io/subpath");
  });

  it("formats URL", () => {
    const url = new BetterURL("/subpath", "https://example.com/path?q=hello");
    expect(url.format({ protocol: true, hostname: true, pathname: true })).toEqual("https://example.com/path/subpath");
    expect(url.format({ protocol: true, hostname: true, port: true, pathname: true })).toEqual(
      "https://example.com:443/path/subpath",
    );
    expect(url.format({ hostname: true, pathname: true })).toEqual("example.com/path/subpath");
    expect(url.format({ hostname: true, pathname: true, search: true })).toEqual("example.com/path/subpath");
  });

  it("creates URL and resolves both queryparams", () => {
    const url = new BetterURL("/subpath?q=bye&title=title", "https://example.com/path?q=hello&desc=desc");
    expect(url.href).toEqual("https://example.com/path/subpath?q=bye&title=title");
  });

  it("concatenate URL", () => {
    expect(new BetterURL("https://example.com/").concat("/path").href).toBe("https://example.com/path");
    expect(new BetterURL("https://example.com/about").concat("/path").href).toBe("https://example.com/about/path");
  });

  it("test URL instance", () => {
    expect(BetterURL.isInstance(new BetterURL("https://example.com/"))).toBe(true);
    expect(BetterURL.isInstance(new URL("https://example.com/"))).toBe(true);
    expect(BetterURL.isInstance("https://example.com/")).toBe(false);
  });

  it("overrides with third parameter", () => {
    const url = new BetterURL("/subpath?q=bye&title=title", "https://example.com/path?q=hello&desc=desc", {
      hostname: "flyyer.io",
      username: "user",
    });
    expect(url.href).toEqual("https://user@flyyer.io/path/subpath?q=bye&title=title");
  });
});
