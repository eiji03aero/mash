import { text } from 'mash-common';
import { Renderer } from './renderer';
import { Config, getConfig } from './common/Config';

export class Terminal {
  container: HTMLElement;
  renderer: Renderer;
  textarea: HTMLTextAreaElement;
  config: Config;
  rows: text.rows;
  rowPosition: number;

  constructor (
    container: HTMLElement,
    config: Config
  ) {
    this.container = container;

    this.renderer = new Renderer(this.container)
    this.textarea = document.createElement('textarea');
    this.textarea.setAttribute('style', 'width: 0; height: 0; position: absolute;');
    this.container.appendChild(this.textarea);
    this.config = getConfig(config);
    this.rows = [] as text.rows;
    this.rowPosition = 0;

    document.addEventListener('click', this.onDocumentClick);
    this.textarea.addEventListener('keyup', this.onKeyUp);
  }

  focus () {
    this.textarea.focus();
  }

  blur () {
    this.textarea.blur();
  }

  prompt () {
    this.rows.push([
      ...this.config.prompt,
      { text: "" }
    ]);
    this.renderer.render(this.rows, this.rowPosition);
  }

  onDocumentClick = (e: Event) => {
    if (this.container.contains(e.target as HTMLElement)) {
      this.focus();
    } else {
      this.blur();
    }
  }

  onKeyUp = (e: Event) => {
    const lastRow = this.rows[this.rows.length - 1];
    const lastTextObject = lastRow[lastRow.length - 1];
    lastTextObject.text = (e.target as HTMLInputElement).value;
    this.renderer.render(this.rows, this.rowPosition);
  }
}
