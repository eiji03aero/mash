import { FileSystem } from "mash-filesystem";
import { EditorEngine } from "./service";
import { render } from "./adapters/ui";
import { fixtureNodes } from "./fixtureNodes";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("app");
  if (!container) {
    throw new Error("container not found");
  }

  const filesystem = FileSystem.bootstrap();
  filesystem.installNodes(filesystem.rootDirectory.id, fixtureNodes);

  const engine = new EditorEngine({
    filesystem,
  });

  (window as any).e = engine;

  render({
    container,
    engine,
  });

  const r1 = filesystem.resolveNodeFromPath("/README.txt");
  if (r1._tag === "Left") {
    throw r1.left;
  }

  window.setTimeout(() => {
    engine.openBuffer(r1.right.id);
  }, 500);
});
