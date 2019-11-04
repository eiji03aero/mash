import { text } from 'mash-common';
import {
  KeyboardEventHandler,
  ITerminal,
  IRenderer,
  IConfig,
  IRenderPayload
} from './Types';
import { Renderer } from './renderer';
import { getConfig } from './common/Config';

export class Terminal implements ITerminal {
  public container: HTMLElement;
  public renderer: IRenderer;
  public textarea: HTMLTextAreaElement;
  public config: IConfig;
  public rows: text.rows;
  public rowPosition: number;
  private _onKeyPressHandler: (e: KeyboardEvent) => void;

  constructor (
    container: HTMLElement,
    config: any
  ) {
    this.container = container;

    this.textarea = document.createElement('textarea');
    this.textarea.setAttribute('style', 'width: 0; height: 0; position: absolute;');
    this.container.appendChild(this.textarea);
    this.config = getConfig(config);
    this.rows = [] as text.rows;
    this.rowPosition = 0;
    this.renderer = new Renderer(this.container);

    this._onKeyPressHandler = (_: KeyboardEvent) => {};

    window.addEventListener('resize', this._onResize);
    document.addEventListener('click', this._onDocumentClick);
    this.textarea.addEventListener('keyup', this._onKeyUp);
    this.textarea.addEventListener('keypress', this._onKeyPress);
  }

  public focus () {
    this.textarea.focus();
  }

  public blur () {
    this.textarea.blur();
  }

  public prompt () {
    this.textarea.value = "";
    this.rows.push([
      ...this.config.prompt,
      { text: "" }
    ]);
    this.renderer.render(this.renderPayload);
  }

  public onKeyPress (fn: KeyboardEventHandler) {
    this._onKeyPressHandler = fn;
  }

  private get renderPayload () {
    const payload: IRenderPayload = {
      rows: this.rows,
      rowPosition: this.rowPosition,
      config: this.config
    };
    return payload;
  }

  private _onDocumentClick = (e: Event) => {
    if (this.container.contains(e.target as HTMLElement)) {
      this.focus();
    } else {
      this.blur();
    }
  }

  private _onResize = (_: Event) => {
    this.renderer.resize(this.renderPayload);
  }

  private _onKeyPress = (e: KeyboardEvent) => {
    this._onKeyPressHandler(e);
  }

  private _onKeyUp = (e: Event) => {
    const lastRow = this.rows[this.rows.length - 1];
    const lastTextObject = lastRow[lastRow.length - 1];
    lastTextObject.text = (e.target as HTMLInputElement).value;
    this.renderer.render(this.renderPayload);
  }
}
