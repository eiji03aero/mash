import * as types from "../types";
import { Buffer } from "./Buffer";
import { Filer } from "./Filer";

export const isBuffer = (s: types.IBufferKind): s is types.IBuffer =>
  s instanceof Buffer;

export const isFiler = (s: types.IBufferKind): s is types.IFiler =>
  s instanceof Filer;
