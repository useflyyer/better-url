export class BetterURL implements URL {
  public readonly url: URL;

  constructor(input: string, base?: string | URL) {
    if (!base && base !== "") {
      this.url = new URL(input);
    } else {
      const url = new BetterURL(String(base));
      this.url = new URL(BetterURL.resolve(url.format({ protocol: true, hostname: true, pathname: true }), input));
      url.searchParams.forEach((value, key) => {
        if (!this.url.searchParams.has(key)) {
          this.url.searchParams.set(key, value);
        }
      });
    }
  }

  get hash() {
    return this.url.hash;
  }
  get host() {
    return this.url.host;
  }
  get hostname() {
    return this.url.hostname;
  }
  get href() {
    return this.url.href;
  }
  get origin() {
    return this.url.origin;
  }
  get password() {
    return this.url.password;
  }
  get pathname() {
    return this.url.pathname;
  }
  get port() {
    return this.url.port;
  }
  get protocol() {
    return this.url.protocol;
  }
  get search() {
    return this.url.search;
  }
  get searchParams() {
    return this.url.searchParams;
  }
  get username() {
    return this.url.username;
  }
  toJSON(): string {
    return this.url.toJSON();
  }
  toString(): string {
    return this.url.toString();
  }

  isEqual(url: URL) {
    return url.href === this.href;
  }

  static resolve(baseURL: string, relativeURL?: string | null) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }

  format(opts?: {
    protocol?: boolean;
    hostname?: boolean;
    pathname?: boolean;
    search?: boolean;
    hash?: boolean;
  }): string {
    if (!opts) return this.href;
    let str = "";
    // TODO: add more
    if (opts.protocol) str += this.protocol;
    if (opts.hostname) str += this.hostname;
    if (opts.pathname) str += this.pathname;
    if (opts.search) str += this.search ?? "";
    if (opts.hash) str += this.hash;
    return str;
  }
}
