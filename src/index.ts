export interface URLDocumented extends URL {
  /**
   * A USVString containing a '#' followed by the fragment identifier of the URL.
   */
  hash: string;

  /**
   * A USVString containing the domain (that is the hostname) followed by (if a port was specified) a ':' and the port of the URL.
   */
  host: string;

  /**
   * A USVString containing the domain of the URL.
   */
  hostname: string;

  /**
   * A stringifier that returns a USVString containing the whole URL.
   */
  href: string;

  /**
   * Returns a USVString containing the origin of the URL, that is its scheme, its domain and its port.
   * (Read only)
   */
  readonly origin: string;

  /**
   * A USVString containing the password specified before the domain name.

   */
  password: string;

  /**
   * Is a USVString containing an initial '/' followed by the path of the URL, not including the query string or fragment.
   */
  pathname: string;

  /**
   * A USVString containing the port number of the URL.
   */
  port: string;

  /**
   * A USVString containing the protocol scheme of the URL, including the final ':'.
   */
  protocol: string;

  /**
   * A USVString indicating the URL's parameter string; if any parameters are provided, this string includes all of them, beginning with the leading ? character.
   */
  search: string;

  /**
   * A URLSearchParams object which can be used to access the individual query parameters found in search.
   * (Read only)
   */
  readonly searchParams: URLSearchParams;

  /**
   * A USVString containing the username specified before the domain name.
   */
  username: string;
}

const attrs = [
  "hash",
  "host",
  "hostname",
  "href",
  "password",
  "pathname",
  "port",
  "protocol",
  "search",
  "username",
] as const;

export interface BetterURLOpts {
  keepBaseSearch?: boolean;
  defaultProtocol?: string;
}

/**
 * Wrapper of `URL` class with additional formatting features.
 *
 * Every attribute is read-only. To modify an instance access to the underlying `url` attribute, but is not recommended.
 */
export class BetterURL implements URLDocumented {
  /**
   * Exposed so you are able to modify the URL
   */
  public readonly url: URL;

  /**
   * Create BetterURL instance but on error it returns `null`.
   */
  public static create(
    input: string | URL | BetterURL,
    base?: string | URL | BetterURL,
    overwrite?: Partial<Pick<URLDocumented, typeof attrs[number]>>,
    opts?: BetterURLOpts,
  ): BetterURL | null {
    try {
      return new BetterURL(input, base, overwrite, opts);
    } catch {
      return null;
    }
  }

  constructor(
    input: string | URL | BetterURL,
    base?: string | URL | BetterURL,
    overwrite?: Partial<Pick<URLDocumented, typeof attrs[number]>>,
    opts?: BetterURLOpts,
  ) {
    input = String(input);
    /** Also supports protocol relative (eg: //flyyer.io/foo ) */
    const ABSOLUTE_REGEX = /^https?:\/\/|^\/\//i;
    if (ABSOLUTE_REGEX.test(input)) {
      if (input.startsWith("//")) {
        const defaultProtocol = (opts && opts.defaultProtocol) || "https:";
        input = defaultProtocol + input; // Force explicit protocol
      }
      // Ignore base
      this.url = new URL(input);
    } else {
      this.url = new URL(input, base);
      if (base && base !== "") {
        const urlBase = base instanceof BetterURL ? base : base instanceof URL ? base : new URL(base);
        this.url.pathname = BetterURL.resolve(urlBase.pathname, this.url.pathname);

        // // Keep base queryparams
        if (opts && opts.keepBaseSearch) {
          urlBase.searchParams.forEach((value, key) => {
            if (!this.url.searchParams.has(key)) {
              this.url.searchParams.set(key, value);
            }
          });
        }
      }
    }

    if (overwrite) {
      for (const [key, value] of Object.entries(overwrite)) {
        // @ts-expect-error Later add typings
        if (attrs.indexOf(key) > -1) {
          // @ts-expect-error Later add typings
          this.url[key] = value;
        }
      }
    }
  }

  public get hash() {
    return this.url.hash;
  }
  public get host() {
    return this.url.host;
  }
  public get hostname() {
    return this.url.hostname;
  }
  public get href() {
    return this.url.href;
  }
  public get origin() {
    return this.url.origin;
  }
  public get password() {
    return this.url.password;
  }
  public get pathname() {
    return this.url.pathname;
  }
  public get port() {
    return this.url.port;
  }
  public get protocol() {
    return this.url.protocol;
  }
  public get search() {
    return this.url.search;
  }
  public get searchParams() {
    return this.url.searchParams;
  }
  public get username() {
    return this.url.username;
  }
  public toJSON(): string {
    // TODO: Should formats to parts? But is not going to be compliant with the URL class.
    return this.url.toJSON();
  }
  public toString(): string {
    return this.url.toString();
  }

  public isEqual(url: URL): boolean {
    return url.href === this.href;
  }

  public static resolve(baseURL: string, relativeURL?: string | null) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }

  /** Check if URL instance */
  public static isURL(input: any): input is URL {
    if (input instanceof URL) return true;
    return false;
  }
  /** Check if URL instance */
  public static isBetterURL(input: any): input is URL {
    if (input instanceof BetterURL) return true;
    return false;
  }

  /**
   * @deprecated Use `isURL` or `isBetterURL`.
   */
  public static isInstance(input: any): input is URL {
    if (BetterURL.isURL(input) || BetterURL.isBetterURL(input)) return true;
    return false;
  }

  public format(opts?: {
    protocol?: boolean;
    hostname?: boolean;
    port?: boolean;
    pathname?: boolean;
    search?: boolean;
    hash?: boolean;
  }): string {
    if (!opts) return this.href;
    const protocol = this.protocol;
    let str = "";
    // TODO: add more
    if (opts.protocol) str += protocol + "//";
    if (opts.hostname) str += this.hostname;
    if (opts.port) {
      const port = this.port || (protocol === "https:" && 443) || (protocol === "http:" && 80);
      if (port) str += ":" + port;
    }
    if (opts.pathname) str += this.pathname;
    if (opts.search) str += this.search ?? "";
    if (opts.hash) str += this.hash;
    return str;
  }

  /**
   * Returns a new instance
   */
  public concat(input: string | URL): BetterURL {
    return new BetterURL(input, this);
  }
}
