export interface IMash {
  initialize(): void;
  focusTerminal(): void;
  blurTerminal(): void;
  read(promptStr: string): Promise<string>;
}
