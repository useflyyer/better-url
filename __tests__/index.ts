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

  it("creates URL and resolves both queryparams", () => {
    const url = new BetterURL("/subpath?q=bye&title=title", "https://example.com/path?q=hello&desc=desc");
    expect(url.href).toEqual("https://example.com/path/subpath?q=bye&title=title&desc=desc");
  });
});
