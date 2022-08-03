import { OpenAPIV3Doc } from ".";
import { Express } from "express";

export interface Middleware {
    register: (app : Express) => void,
    initialize: (oasFile : OpenAPIV3Doc, config : object) => ThisType<Middleware>
}