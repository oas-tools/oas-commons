const operations = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
  "trace",
];

export class OASBase {
  #middleware;

  #oasFile;

  constructor(oasFile, middleware) {
    this.#middleware = middleware;
    this.#oasFile = oasFile;
  }

  register(app) {
    Object.entries(this.#oasFile.paths).forEach(([path, methodObj]) => {
      Object.keys(methodObj)
        .filter((key) => operations.includes(key))
        .forEach((method) => {
          app[method](path, this.#middleware);
        });
    });
  }

  getMiddleware() {
    return this.#middleware;
  }
}
