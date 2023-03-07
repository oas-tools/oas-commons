import { Express } from "express";
import { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import { Middleware, OpenAPIV3Doc } from "../../typings";
import { logger } from "../utils";

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

  register(app : Express, path: string) {
    let servers : Array<String>;
    
    if (this.#oasFile.servers?.length > 0) {
      servers = _getServers(this.#oasFile.servers);
    } else {
      servers = ["/"];
    }

    const methodObj : any = this.#oasFile.paths[path];
    
    if (methodObj.servers?.length > 0) servers = _getServers(methodObj.servers);
    Object.keys(methodObj ?? {})
      .filter((key) => operations.includes(key))
      .forEach((method) => {
        const pathItemObj : any = methodObj[method as keyof typeof methodObj];
        if (pathItemObj.servers?.length > 0) servers = _getServers(pathItemObj.servers);
        servers.forEach(prefix => {
          app[method as keyof typeof app](
            (prefix + path).replace(/\/\//g, "/"), 
            (req : any, res: any, next : any) => {
              req.route.path = req.route.path.replace(prefix, prefix === "/" ? "/" : "");
              this.#middleware(req, res, next);
            }
          );
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

function _getServers(oasServers : Array<OpenAPIV3.ServerObject | OpenAPIV3_1.ServerObject>) {
  /* Multiple hosts not supported currently */
  if (oasServers.length > 1) {
    logger.warn("Multiple server hosting is not yet supported.")
  }

  return [...new Set(oasServers.flatMap(server => {
    const url : URL = new URL(server.url, 'http://localhost');

    /* Different hosts not supported currently */
    if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1"){
      logger.warn(`Found ${url.hostname} in servers property: Multiple server hosting is not yet supported. OAS Tools will assume all servers' host as localhost`)
    }

    if (server.variables) {
      return Object.entries(server.variables).flatMap(([varName, varObj]) => {

        // When transforming into URL object, '{' and '}' bacame %7B and %7D
        const regex : RegExp = new RegExp(`%7B${varName}%7D`, "g"); 
        
        if (varObj.enum?.length > 0) {
          return varObj.enum.map(value => url.pathname.replace(regex, value));
        } else {
          return url.pathname.replace(regex, varObj.default);
        }
      })
    } else {
      return url.pathname;
    }
  }))];
}