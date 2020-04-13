import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import { Evaluator } from "./Evaluator";
import {
  IEnvironment,
  ICommandMap,
  IMashClient,
  IContext,
} from "./types";

export class MashClient<T extends IContext> implements IMashClient<T> {
  private _environment: IEnvironment;
  private _commandMap: ICommandMap<T>;

  constructor ({
    environment,
    commandMap,
  }: {
    environment: IEnvironment;
    commandMap: ICommandMap<T>;
  }) {
    this._environment = environment;
    this._commandMap = commandMap;
  }

  async eval (str: string, ctx: T) {
    this._environment.reset();

    const lexer = new Lexer(str);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    const evaluator = new Evaluator<T>({
      environment: this._environment,
      commandMap: this._commandMap,
      context: ctx,
    });
    await evaluator.eval(program);
  }
}
