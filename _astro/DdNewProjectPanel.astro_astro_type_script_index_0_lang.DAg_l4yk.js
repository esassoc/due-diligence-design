import{i as h,A as o,b as s,t as p,a as u}from"./typography.C7xuE2z_.js";import{b as m}from"./boolish.DOQu-9JQ.js";import"./esa-text-field.zjCVt3Qz.js";import{a as f}from"./a11y.c6v_nqwk.js";import"./esa-textarea.ENVpHSz-.js";import{n as b}from"./dd-a11y.Np4rsNrK.js";class v extends h{constructor(){super(),this.onCancel=e=>{e.preventDefault(),this.close()},this.onNativeClose=()=>{clearTimeout(this.closeTimer);const e=this.open;this.open=!1,this.closing=!1,e&&this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},this.onLightDismiss=e=>{const t=this.dialogEl;if(!t||!this.open||e.composedPath()[0]!==t)return;const i=t.getBoundingClientRect();i.top<=e.clientY&&e.clientY<=i.top+i.height&&i.left<=e.clientX&&e.clientX<=i.left+i.width||this.close()},this.open=!1,this.heading="",this.position="right",this.size="md",this.showCloseButton=!0,this.closing=!1}static{this.properties={open:{type:Boolean,reflect:!0},heading:{type:String},position:{type:String,reflect:!0},size:{type:String,reflect:!0},showCloseButton:{type:Boolean,attribute:"show-close-button",converter:m},closing:{state:!0}}}connectedCallback(){super.connectedCallback(),"closedBy"in HTMLDialogElement.prototype||this.addEventListener("click",this.onLightDismiss)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.onLightDismiss),clearTimeout(this.closeTimer)}get dialogEl(){return this.renderRoot.querySelector("dialog")}updated(e){if(!e.has("open")&&!e.has("closing"))return;const t=this.dialogEl;if(!t)return;const i=this.open||this.closing;i&&!t.open?t.showModal():!i&&t.open&&t.close()}show(){clearTimeout(this.closeTimer),this.closing=!1,this.open=!0}close(){this.open&&(this.open=!1,this.closing=!0,clearTimeout(this.closeTimer),this.closeTimer=setTimeout(()=>{this.closing=!1},200),this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0})))}render(){const e=!!this.querySelector('[slot="header"]'),t=this.heading||this.showCloseButton||e,i=this.closing&&!this.open,n=this.querySelector('[slot="header"]')?.textContent?.trim();return s`
      <dialog
        class="panel ${i?"is-closing":""}"
        closedby="any"
        aria-labelledby=${this.heading?"esa-side-dialog-title":o}
        aria-label=${this.heading?o:n||"Side dialog"}
        @cancel=${this.onCancel}
        @close=${this.onNativeClose}
      >
        ${t?s`<header class="header typography-title">
              <slot name="header"><h2 id="esa-side-dialog-title" class="title typography-title">${this.heading}</h2></slot>
              ${this.showCloseButton?s`<button class="close" @click=${this.close} aria-label="Close">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>`:null}
            </header>`:null}
        <div class="body typography-body-md"><slot></slot></div>
        <footer class="footer typography-label-md"><slot name="footer"></slot></footer>
      </dialog>
    `}static{this.styles=[p,u`
    :host { --_width: var(--side-dialog-width, 400px); }
    :host([size='sm']) { --_width: var(--side-dialog-width-sm, 320px); }
    :host([size='lg']) { --_width: var(--side-dialog-width-lg, 520px); }

    /* ::backdrop replaces the hand-rolled .backdrop div. The var() may not resolve
       here — ::backdrop does not inherit custom properties from its originating
       element in every engine — but --side-dialog-backdrop-filter's declared
       default IS 'none' (component-tokens.css), so the fallback and the default
       agree and the only thing at stake is whether an opt-in frost applies in an
       older engine. Keep the literal fallbacks in step with the token defaults. */
    dialog.panel::backdrop {
      background: var(--color-background-overlay-backdrop, rgba(0, 0, 0, 0.5));
      backdrop-filter: var(--side-dialog-backdrop-filter, none);
      -webkit-backdrop-filter: var(--side-dialog-backdrop-filter, none);
      animation: fade var(--animation-enter, 150ms ease-out);
    }
    dialog.panel.is-closing::backdrop { animation: fade-out var(--animation-exit, 150ms ease-in) forwards; }

    /* Inset floating panel (matches Beacon prod .ui-side-dialog): 16px gap on the
       top / bottom / anchored side, rounded corners. --_inset is overridable.
       'position: fixed' with explicit insets overrides the UA's centering margin;
       the UA's border/padding and its 'max-width/max-height: calc(100% - 6px - 2em)'
       have to be cleared or they clamp this panel inside a second, smaller box.
       Two more UA dialog declarations have to be beaten explicitly, because
       'margin: 0' removes the auto-margins that used to absorb them: 'inset: 0'
       (its left: 0 out-ranks the position rule's right and glues the panel to
       the wrong edge) and 'height: fit-content' (it wins the over-constrained
       top+bottom pair and collapses the panel to its content).
       hub-edit-approved: Andy, 2026-08-25, biochar-atlas session — reported the
       panel opening left-glued at content height; the defect is this lego's,
       not the spoke's. */
    dialog.panel {
      --_inset: var(--side-dialog-inset, 16px);
      position: fixed;
      top: var(--_inset);
      bottom: var(--_inset);
      inset-inline: auto;
      height: auto;
      margin: 0;
      border: none;
      padding: 0;
      width: min(var(--_width), calc(100vw - var(--_inset) * 2));
      max-width: none;
      max-height: none;
      background: var(--color-background-elevation-raised, #fcfcfc);
      color: var(--color-content-default, #202020);
      border-radius: var(--radius-md, 0.5rem);
      box-shadow: var(--elevation-5, 0 8px 32px -8px rgba(0, 0, 0, 0.2));
      outline: none;
      overflow: hidden;
      /* Hosts may re-point --side-dialog-inset while open (e.g. card-stacking a
         second dialog on top) — ease the reposition instead of jumping. */
      transition: top 220ms ease, right 220ms ease, bottom 220ms ease, left 220ms ease;
    }
    dialog.panel[open] { display: flex; flex-direction: column; }
    :host([position='right']) dialog.panel { right: var(--_inset); animation: slide-right var(--animation-overlay-enter, 250ms ease-out); }
    :host([position='left']) dialog.panel { left: var(--_inset); animation: slide-left var(--animation-overlay-enter, 250ms ease-out); }
    /* Exit: keep the end state so it doesn't flash back before unmounting. */
    :host([position='right']) dialog.panel.is-closing { animation: slide-out-right var(--animation-overlay-exit, 200ms ease-in) forwards; }
    :host([position='left']) dialog.panel.is-closing { animation: slide-out-left var(--animation-overlay-exit, 200ms ease-in) forwards; }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-300, 0.75rem);
      padding: var(--spacing-400, 1rem) var(--spacing-500, 1.5rem);
      border-bottom: var(--border-width-default, 1px) solid var(--color-border-default, #cecece);
      flex: none;
    }
    .title { margin: 0; color: var(--color-content-default, #202020); }
    .close {
      display: grid; place-items: center; width: 32px; height: 32px;
      border: 0; border-radius: var(--radius-sm, 0.25rem); background: none;
      color: var(--color-content-default-secondary, #646464); cursor: pointer;
    }
    .close:hover { background: var(--color-background-elevation-sunken, #f0f0f0); color: var(--color-content-default, #202020); }
    .body { flex: 1; overflow-y: auto; padding: var(--spacing-500, 1.5rem); color: var(--color-content-default-secondary, #646464); }
    .footer { flex: none; padding: var(--spacing-400, 1rem) var(--spacing-500, 1.5rem); border-top: var(--border-width-default, 1px) solid var(--color-border-default, #cecece); }
    .footer:not(:has(*)) { display: none; }

    @keyframes fade { from { opacity: 0; } }
    @keyframes fade-out { to { opacity: 0; } }
    /* Offset by the inset so the panel fully clears the viewport edge. */
    @keyframes slide-right { from { transform: translateX(calc(100% + var(--_inset))); } }
    @keyframes slide-left { from { transform: translateX(calc(-100% - var(--_inset))); } }
    @keyframes slide-out-right { to { transform: translateX(calc(100% + var(--_inset))); } }
    @keyframes slide-out-left { to { transform: translateX(calc(-100% - var(--_inset))); } }

    /* FORCED COLORS. This panel floats with a 16px inset on all four sides, so
       losing --elevation-5 leaves it with no edge at all against the scrim.
       Width is 'min(--_width, 100vw - inset*2)' on a content-box element; the
       border is inside the query so that clamp keeps holding in normal mode. */
    @media (forced-colors: active) {
      dialog.panel { border: 1px solid CanvasText; }
    }
  `]}}customElements.get("esa-side-dialog")||customElements.define("esa-side-dialog",v);const y=s`<svg
  class="error__icon"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line
    x1="12"
    x2="12.01"
    y1="16"
    y2="16"
  />
</svg>`,x={xs:"label-2xs",sm:"label-xs",md:"label-md",lg:"label-lg"},w={xs:"body-2xs",sm:"body-xs",md:"body-md",lg:"body-lg"};class k extends h{constructor(){super(),this.selectOption=e=>{e.disabled||(this.value=e.value,this.internals.setFormValue(this.value),this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0,composed:!0})))},this.onKeydown=(e,t)=>{(e.key===" "||e.key==="Enter")&&(e.preventDefault(),this.selectOption(t))},this.options=[],this.label="",this.size="md",this.orientation="vertical",this.value=null,this.required=!1,this.helpText="",this.errorText="",this.liveError=!1,this.internals=this.attachInternals()}static{this.formAssociated=!0}static{this.properties={options:{type:Array},label:{type:String},size:{type:String,reflect:!0},orientation:{type:String,reflect:!0},name:{type:String,reflect:!0},value:{type:String},required:{type:Boolean},helpText:{type:String,attribute:"help-text"},errorText:{type:String,attribute:"error-text"},liveError:{type:Boolean,attribute:"live-error"}}}updated(){this.syncValidity()}syncValidity(){if(!this.required||this.value){this.internals.setValidity({});return}const e=this.renderRoot?.querySelector(".circle")??void 0;this.internals.setValidity({valueMissing:!0},this.label?`Select ${this.label}.`:"Select an option.",e)}willUpdate(e){if(e.has("options")&&typeof this.options=="string")try{this.options=JSON.parse(this.options)}catch{this.options=[]}e.has("value")&&this.internals.setFormValue(this.value)}connectedCallback(){super.connectedCallback(),this.internals.setFormValue(this.value)}isSelected(e){return this.value===e}focus(e){const t=this.renderRoot?.querySelector(".circle--selected, .circle");t?t.focus(e):super.focus(e)}render(){const e=!!this.errorText,t=[e?"error":"",this.helpText?"help":""].filter(Boolean).join(" ");return s`
      <!-- A real fieldset/legend, not a div with role=group + aria-label. Three reasons:
           the legend NAMES the fieldset natively (measured to work inside a shadow
           root); a name by REFERENCE cannot drift from the visible text the way the old
           copied aria-label did, which also silently unnamed the group whenever label
           was empty; and role=group is the weak one — support is poor on iOS VoiceOver
           and Android TalkBack, i.e. exactly the users most likely to be filling this in
           on a phone.

           role=radiogroup overrides the fieldset's implicit group role because ARIA does
           not allow aria-required on group, and radiogroup is what this actually is.
           aria-labelledby is belt-and-braces: name-from-legend is an HTML-AAM mapping,
           and overriding the role puts it on less certain ground. -->
      <fieldset
        class="items ${e?"items--error":""}"
        role="radiogroup"
        aria-labelledby=${this.label?"legend":o}
        aria-required=${this.required?"true":o}
        aria-invalid=${e?"true":o}
        aria-describedby=${t||o}
      >
        ${this.label?s`<legend class="group-label typography-${x[this.size]}" id="legend">
              ${this.label}${this.required?s`<span class="required" aria-hidden="true">*</span>`:null}
            </legend>`:null}
        ${this.options.map((i,n)=>{const d=this.isSelected(i.value),l=i.disabled??!1,c=`opt-${n}-label`;return s`
            <label
              class="item ${l?"item--disabled":""}"
              @keydown=${g=>this.onKeydown(g,i)}
              @click=${()=>this.selectOption(i)}
            >
              <span
                class="circle ${d?"circle--selected":""}"
                role="radio"
                aria-labelledby=${c}
                aria-checked=${String(d)}
                aria-disabled=${String(l)}
                tabindex=${l?-1:0}
              >
                <span class="dot"></span>
              </span>
              <span id=${c} class="item-label typography-${w[this.size]}"
                >${i.label}</span
              >
            </label>
          `})}
      </fieldset>

      <!-- Both message nodes always present so the live region pre-exists its content;
           .visually-hidden when empty keeps them out of flow. -->
      <p
        class="error typography-body-sm ${e?"is-shown":"visually-hidden"}"
        id="error"
        role=${this.liveError?"alert":o}
          data-esa-live=${this.liveError?"opt-in":o}
      >${e?s`${y}<span class="visually-hidden">Error: </span
              ><span>${this.errorText}</span>`:o}</p>
      <p class="help typography-body-sm ${this.helpText?"is-shown":"visually-hidden"}" id="help"
        >${this.helpText||o}</p
      >
    `}static{this.styles=[p,f,u`
    :host {
      --_radio-size: 20px;
      --_radio-dot-size: 10px;
      display: block;
    }
    :host([size='xs']) {
      --_radio-size: 14px;
      --_radio-dot-size: 7px;
    }
    :host([size='sm']) {
      --_radio-size: 16px;
      --_radio-dot-size: 8px;
    }
    :host([size='lg']) {
      --_radio-size: 24px;
      --_radio-dot-size: 12px;
    }

    /* A <legend>, so it names the fieldset natively. The UA gives legend a float/
       padding treatment inside a bordered fieldset; with the border reset off below
       there is nothing to inset it from, and this restores plain block flow. */
    .group-label {
      display: block;
      padding: 0;
      margin-bottom: var(--spacing-200, 8px);
      color: var(--color-content-default, #202020);
    }
    .required {
      color: var(--color-content-utility-danger, #ce2c31);
      margin-inline-start: 2px;
    }

    /* Now a <fieldset>, which arrives with a UA border, padding, margin and a
       min-inline-size: min-content that breaks flex children. All four are reset —
       the element is here for its SEMANTICS (name-from-legend, and disabled
       propagation if a group-level disabled is ever added), not its chrome. */
    .items {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-200, 8px);
      border: 0;
      padding: 0;
      margin: 0;
      min-inline-size: 0;
    }
    :host([orientation='horizontal']) .items {
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--spacing-400, 16px);
    }

    .item {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-200, 8px);
      cursor: pointer;
      user-select: none;
    }
    .item--disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--_radio-size);
      height: var(--_radio-size);
      flex-shrink: 0;
      /* The size token is authoritative: without this, re-pointing the indicator
         border width would resize the control instead of thickening its edge. */
      box-sizing: border-box;
      border: var(--form-border-width, 1px) solid var(--form-border-color, #cecece);
      border-radius: 50%;
      background: var(--color-background-field, transparent);
      transition:
        border-color var(--transition-fast, 150ms ease),
        box-shadow var(--transition-fast, 150ms ease);
    }
    .circle--selected {
      border-color: var(--color-background-brand, #46a758);
    }
    .circle:focus-visible {
      border-color: var(--form-border-color-focus, #3e9b4f);
      outline: var(--focus-ring-width, 2px) solid var(--focus-ring-color, #3e9b4f);
      outline-offset: var(--focus-ring-offset, 2px);
    }

    .dot {
      width: var(--_radio-dot-size);
      height: var(--_radio-dot-size);
      border-radius: 50%;
      background: transparent;
      transition: background var(--transition-fast, 150ms ease);
    }
    .circle--selected .dot {
      background: var(--color-background-brand, #46a758);
    }

    /* DISABLED IS A TOKEN TREATMENT, not an opacity hack. Tier 2 already ships the
       whole triple — --color-background-disabled, --color-border-disabled,
       --color-content-disabled — and this is the state they exist for; two of the
       three had zero readers because the kit reached for opacity instead.
       The fill is also the one moment a field is deliberately NOT the colour of its
       container: the break from the surface IS the signal that it is inert. */
    /* The dot is a CHILD here, not a fill on the circle, so unlike the checkbox
       this can paint every disabled circle without erasing the selection. */
    .item--disabled .circle {
      background: var(--color-background-disabled, #f0f0f0);
      border-color: var(--color-border-disabled, #d9d9d9);
    }

    .item-label {
      color: var(--color-content-default, #202020);
    }

    /* An invalid group reddens its legend — the group is what is invalid. This comment used
       to add "and there is no single box to outline the way a text field has", and gave that
       as the reason the ring stayed brand-coloured. The premise was right and the conclusion
       was not: there is no single circle, so DO NOT outline one — re-point the token instead
       and all N circles follow. That is the house mechanism for the error ring as of
       2026-08-17 (see esa-text-field), and a group is the case that makes it obviously
       correct rather than merely tidier. */
    .items--error {
      --focus-ring-color: var(--form-error-border-color, #e5484d);
    }
    .items--error .group-label {
      color: var(--form-error-color, var(--color-content-utility-danger, #ce2c31));
    }

    /* Both message nodes always render (the live region has to pre-exist its content);
       .visually-hidden takes the empty ones out of flow. Not display:none, which would
       drop them from the accessibility tree. */
    .help,
    .error {
      margin: 0;
    }
    .help.is-shown,
    .error.is-shown {
      margin-block-start: var(--form-help-gap, 4px);
    }
    .help {
      color: var(--form-help-color, #838383);
    }
    /* Colour, icon AND a visually-hidden "Error:" — colour alone is SC 1.4.1. */
    .error {
      display: flex;
      align-items: center;
      gap: var(--spacing-100, 4px);
      color: var(--form-error-color, var(--color-content-utility-danger, #ce2c31));
    }
    .error__icon {
      flex: none;
      width: 1em;
      height: 1em;
    }

    /* FORCED COLORS. The radio is worse off than the checkbox: the checkbox has a
       tick, a real shape that survives, but selection here is a .dot that is
       always in the DOM and differs ONLY by 'background' (transparent vs brand).
       Force-adjust both and selected and unselected become the same empty circle.
       Nothing else changes — border-WIDTH is constant, only border-colour moves,
       and colour is exactly what this mode overrides.

       CanvasText rather than Highlight for the dot: the dot sits inside the
       circle rather than replacing it, so it reads as a mark on the control, not
       as a selection sweep across a row. Highlight is reserved for list rows. */
    @media (forced-colors: active) {
      .circle {
        background: Canvas;
        border-color: CanvasText;
      }
      .circle--selected { border-color: CanvasText; }
      .circle--selected .dot { background: CanvasText; }
      .item--disabled .circle { border-color: GrayText; }
      .item--disabled .circle--selected .dot { background: GrayText; }
      .item--disabled { color: GrayText; }
    }
  `]}}customElements.get("esa-radio-group")||customElements.define("esa-radio-group",k);const a=document.querySelector("[data-dd-new-project-panel]");if(a){const r=a.querySelector("#dd-np-name");b(a),document.addEventListener("click",e=>{e.target.closest("[data-dd-new-project]")&&(a.open=!0,window.setTimeout(()=>r.focus(),60))}),a.querySelector("[data-dd-np-cancel]")?.addEventListener("click",()=>{a.open=!1}),r.addEventListener("change",()=>{r.value.trim()&&(r.errorText="")}),a.querySelector("[data-dd-np-create]")?.addEventListener("click",()=>{if(!r.value.trim()){r.errorText="Enter a project name",r.focus();return}a.open=!1;const e=a.dataset.href??"/";window.setTimeout(()=>window.location.assign(e),220)})}
