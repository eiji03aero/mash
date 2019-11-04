import { text } from 'mash-common';
import {
  ITerminal,
  IRenderer,
  IConfig,
  IRenderPayload
} from './Types';
import { Renderer } from './renderer';
import { getConfig } from './common/Config';

export class Terminal implements ITerminal {
  container: HTMLElement;
  renderer: IRenderer;
  textarea: HTMLTextAreaElement;
  config: IConfig;
  rows: text.rows;
  rowPosition: number;

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

    window.addEventListener('resize', this.onResize);
    document.addEventListener('click', this.onDocumentClick);
    this.textarea.addEventListener('keyup', this.onKeyUp);
  }

  public focus () {
    this.textarea.focus();
  }

  public blur () {
    this.textarea.blur();
  }

  public prompt () {
    this.rows.push([
      ...this.config.prompt,
      { text: "" }
    ]);
    this.renderer.render(this.renderPayload);
  }

  private get renderPayload () {
    const payload: IRenderPayload = {
      rows: this.rows,
      rowPosition: this.rowPosition,
      config: this.config
    };
    return payload;
  }

  private onDocumentClick = (e: Event) => {
    if (this.container.contains(e.target as HTMLElement)) {
      this.focus();
    } else {
      this.blur();
    }
  }

  private onResize = (_: Event) => {
    this.renderer.resize(this.renderPayload);
  }

  private onKeyUp = (e: Event) => {
    const lastRow = this.rows[this.rows.length - 1];
    const lastTextObject = lastRow[lastRow.length - 1];
    lastTextObject.text = (e.target as HTMLInputElement).value;
    this.renderer.render(this.renderPayload);
  }
}
