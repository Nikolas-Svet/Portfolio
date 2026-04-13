import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("clinic", {
  version: "0.1.0"
});
