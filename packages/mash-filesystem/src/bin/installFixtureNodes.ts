import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import _ from "lodash";
import { Monad, date } from "mash-common";
import {
  IFileSystem,
} from "../types";

const yamlString = fs.readFileSync(path.resolve(__dirname, "../../fixtures/nodes.yml"), "utf8");
const fixture = yaml.safeLoad(yamlString);

const uuid = () => `${Math.random()}-${Math.random()}-${Math.random()}`;

export const installFixtureNodes = (fs: IFileSystem) => {
  const r = fs.resolveNodeFromPath("/");
  if (Monad.either.isLeft(r)) throw r.error;
  const rootNode = r.value;

  const source = _.cloneDeep(fixture);
  for (const n of source.nodes) {
    installNode(fs, rootNode.id, n);
  }

  const r2 = fs.resolveNodeFromPath("/home");
  if (Monad.either.isLeft(r2)) throw r2.error;
  fs.changeCurrentDirectory(r2.value.id);
}

const installNode = (fs: IFileSystem, parentNodeId: string, params: any) => {
  const ownId = uuid();

  if (params.children) {
    installDirectory(fs, parentNodeId, { ...params, id: ownId });
    for (const c of params.children) {
      installNode(fs, ownId, c);
    }
  }
  else if (params.content) {
    installFile(fs, parentNodeId, { ...params, id: ownId });
  }
}

const installFile = (fs: IFileSystem, parentNodeId: string, params: any) => {
  fs.createFile({
    parentNodeId,
    params: {
      id: params.id,
      name: params.name,
      content: params.content,
      parentNodeId,
      createdAt: date.getCurrentTime(),
      updatedAt: date.getCurrentTime(),
    },
  });
};

const installDirectory = (fs: IFileSystem, parentNodeId: string, params: any) => {
  fs.createDirectory({
    parentNodeId,
    params: {
      id: params.id,
      name: params.name,
      parentNodeId,
      createdAt: date.getCurrentTime(),
      updatedAt: date.getCurrentTime(),
    },
  });
};
