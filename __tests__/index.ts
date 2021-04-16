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

  it("creates URL and preserves baseURL path and deals with repeated slashes", () => {
    const url = new BetterURL("///hello", "https://example.com/path/");
    expect(url.href).toEqual("https://example.com/path/hello");
  });

  it("creates URL and preserves baseURL path and queryparams", () => {
    const url = new BetterURL("/subpath", "https://example.com/path?q=hello");
    expect(url.href).toEqual("https://example.com/path/subpath?q=hello");
  });

  it("formats URL", () => {
    const url = new BetterURL("/subpath", "https://example.com/path?q=hello");
    expect(url.format({ protocol: true, hostname: true, pathname: true })).toEqual("https://example.com/path/subpath");
    expect(url.format({ hostname: true, pathname: true })).toEqual("example.com/path/subpath");
    expect(url.format({ hostname: true, pathname: true, search: true })).toEqual("example.com/path/subpath?q=hello");
  });

  it("creates URL and resolves both queryparams", () => {
    const url = new BetterURL("/subpath?q=bye&title=title", "https://example.com/path?q=hello&desc=desc");
    expect(url.href).toEqual("https://example.com/path/subpath?q=bye&title=title&desc=desc");
  });

  it("overrides with third parameter", () => {
    const url = new BetterURL("/subpath?q=bye&title=title", "https://example.com/path?q=hello&desc=desc", {
      hostname: "flayyer.io",
      username: "user",
    });
    expect(url.href).toEqual("https://user@flayyer.io/path/subpath?q=bye&title=title&desc=desc");
  });
});
