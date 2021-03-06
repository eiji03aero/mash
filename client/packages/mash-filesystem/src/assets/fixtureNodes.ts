import fs from "fs";
import path from "path";
import yaml from "js-yaml"

import { IFileSystemNode } from "../types";

const nodesYamlString = fs.readFileSync(path.resolve(__dirname, "../../fixtures/nodes.yml")).toString();
export const fixtureNodes = yaml.safeLoad(nodesYamlString) as IFileSystemNode[];
