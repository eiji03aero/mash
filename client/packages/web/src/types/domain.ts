export interface IMash {
  initialize(): void;
  read(promptStr: string): Promise<string>;
}
