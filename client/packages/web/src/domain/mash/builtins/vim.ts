import * as E from "fp-ts/lib/Either";
import * as me from "mash-editor";

import { CommandPayload } from "../types";

export default async ({
  args,
  context: {
    filesystem,
    service,
  }
}: CommandPayload): Promise<void> => {
  const initialBufferPath = args[1];

  const requestActionHandler: me.RequestActionHandler = async (action) => {
    switch (action.type) {
      case "mounted":
        if (initialBufferPath) {
          const r1 = filesystem.resolveNodeFromPath(initialBufferPath);
          if (E.isLeft(r1)) {
            service.editorEngine.error(r1.left);
            return;
          }
          const node = r1.right;
          service.editorEngine.openBufferByNodeId(node.id);
        }
        break;
      case "quit":
        service.closeEditor();
        service.focusTerminal();
        break;
    }
  }

  service.editorEngine.onRequestAction(requestActionHandler);
  service.blurTerminal();
  await service.openEditor();
};
