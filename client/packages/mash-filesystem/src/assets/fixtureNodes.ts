import fs from "fs";
import path from "path";
import yaml from "js-yaml"

const nodesYamlString = fs.readFileSync(path.resolve(__dirname, "../../fixtures/nodes.yml")).toString();
export const fixtureNodes = yaml.safeLoad(nodesYamlString);
