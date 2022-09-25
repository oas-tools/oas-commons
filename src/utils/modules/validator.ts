import { load } from "js-yaml";
import {existsSync, readFileSync} from "fs";
import {join} from "path";
import Ajv2020 from "ajv/dist/2020.js";
import Ajv04 from "ajv-draft-04";
import addFormats from "ajv-formats";
import { ValidationError, logger } from "../index";

/**
 * Validates the oasFile against the openApi schema
 * @param {string} oasFilePath - Path to the spec file.
 */
export function validateOASFile(oasFilePath : string) {
  if (!existsSync(oasFilePath)) {
    throw new ValidationError(`Specification file at ${oasFilePath} not found`);
  }
  const oasFile : any = load(readFileSync(oasFilePath, "utf8"));
  const version = oasFile.openapi;
  let ajv;
  let schema;

  switch(true) {
    case (/^3\.0\.\d(-.+)?$/).test(version):
      ajv = new Ajv04({strict: false, logger: logger});
      schema = JSON.parse(readFileSync(join(__dirname, "../../../schemas/v3.0/schema.json"), "utf8"));
      break;
    case (/^3\.1\.\d+(-.+)?$/).test(version):
      ajv = new Ajv2020({strict: false, logger: logger});
      ajv.addFormat("media-range", "^[^\\s;]+/[^\\s;]+$");
      ajv.addSchema(JSON.parse(readFileSync(join(__dirname, "../../../schemas/v3.1/dialect.json"), "utf8")));
      ajv.addSchema(JSON.parse(readFileSync(join(__dirname, "../../../schemas/v3.1/vocab.json"), "utf8")));
      ajv.addSchema(JSON.parse(readFileSync(join(__dirname, "../../../schemas/v3.1/schema.json"), "utf8")));
      schema = JSON.parse(readFileSync(join(__dirname, "../../../schemas/v3.1/schema-base.json"), "utf8")); 
      break;
    default:
      throw new ValidationError(`Unsupported OpenAPI version: ${version}. Supported versions are 3.0.X, 3.1.X`);
  }

  addFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(oasFile);
  if (!valid) {
    throw new ValidationError(`Specification file does not meet OpenAPI ${version} schema.\n` +
    `${validate.errors.map((e) => `- Validation failed at ${e.instancePath.split('/').map((s) => s.includes('~1')? `[${s.replace(/~1/g,'/')}]` : s).join('/')} > ${e.message}`).join("\n")}`);
  }
}

export function validate(body : object, schema : object, version : string) {
 
  /* Instanciate validator */
  let ajv;
  if((/^3\.0\.\d(-.+)?$/).test(version)) ajv = new Ajv04({strict: false, logger: logger}); // 3.0.X - Json draft04
  else ajv = new Ajv2020({strict: false, logger: logger}); // 3.1.X - Json schema 2020-12
  addFormats(ajv);

  const validate = ajv.compile(schema);
  return {valid: validate(body), validate: validate}
}
