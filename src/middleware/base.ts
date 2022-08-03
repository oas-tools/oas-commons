import { Express } from "express";
import { Middleware, OpenAPIV3Doc } from "../../typings";

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

export class OASBase implements Middleware {
  #middleware : Function;
  #oasFile : OpenAPIV3Doc;

  constructor(oasFile : OpenAPIV3Doc, middleware : Function) {
    this.#middleware = middleware;
    this.#oasFile = oasFile;
  }

  register(app : Express) {
    Object.entries(this.#oasFile.paths ?? {}).forEach(([path, methodObj]) => {
      Object.keys(methodObj ?? {})
        .filter((key) => operations.includes(key))
        .forEach((method) => {
          app[method as keyof typeof app](path, this.#middleware);
        });
    });
  }

  initialize(oasFile: OpenAPIV3Doc, _config: object) {
    return new OASBase(oasFile, (_req : any, _res : any, next : Function) => next());
  }

  getMiddleware() {
    return this.#middleware;
  }
}
