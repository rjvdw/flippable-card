import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * A card that can be flipped over.
 */
@customElement('flippable-card')
export class FlippableCard extends LitElement {
  @property({ type: Boolean, reflect: true })
  revealed = false

  constructor() {
    super()
    this.addEventListener('click', () => {
      this.revealed = !this.revealed
    })
    this.addEventListener('transitionstart', (event) => {
      const target = event.target as HTMLImageElement
      target.style.zIndex = '1'
    })
    this.addEventListener('transitionend', (event) => {
      const target = event.target as HTMLImageElement
      target.style.zIndex = ''
    })
  }

  static override styles = css`
    :host {
      --back-color: #333;
      --front-color: #fff;
      --border-radius: 1rem;
      --rem: inherit;
      --padding: 1rem;
      --rotation-perspective: 1000px;
      --object-fit: cover;
      --transition-duration: 1400ms;

      cursor: pointer;
      position: relative;
      font-size: var(--rem);
      display: block;
    }

    .container {
      display: contents;
    }

    * {
      box-sizing: border-box;
    }

    ::slotted(*) {
      border-radius: var(--border-radius);
      margin: 0;
      padding: 0;
      width: calc(100% - 2 * var(--padding));
      height: calc(100% - 2 * var(--padding));
      position: absolute;
      top: var(--padding);
      right: var(--padding);
      bottom: var(--padding);
      left: var(--padding);
      object-fit: var(--object-fit);
      transition: transform var(--transition-duration);
      transform-style: preserve-3d;
      perspective-origin: 50% 50%;
      overflow: hidden;
    }

    [name='front']::slotted(*) {
      background-color: var(--front-color);
      transform: perspective(var(--rotation-perspective));
    }

    .container:not(.revealed) [name='front']::slotted(*) {
      transform: perspective(var(--rotation-perspective)) rotateY(180deg);
    }

    [name='back']::slotted(*) {
      background-color: var(--back-color);
      backface-visibility: hidden;
      transform: perspective(var(--rotation-perspective)) rotateY(-180deg);
    }

    .container:not(.revealed) [name='back']::slotted(*) {
      transform: perspective(var(--rotation-perspective)) rotateY(0);
    }
  `

  override render() {
    return html`
      <div
        class="container ${this.revealed ? 'revealed' : ''}"
        role="button"
        tabindex="0"
      >
        <slot name="front"></slot>
        <slot name="back"></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'flippable-card': FlippableCard
  }
}
