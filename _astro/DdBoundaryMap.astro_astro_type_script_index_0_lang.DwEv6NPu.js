import"./esa-text-field.zjCVt3Qz.js";import"./esa-select.8jfMTFNb.js";import"./esa-button-toggle.CzwQYThf.js";import{i as Ge,b as H,A as he,t as Ke,a as Ze}from"./typography.C7xuE2z_.js";import{b as Be}from"./boolish.DOQu-9JQ.js";import{g as Ne,s as Te,t as me,o as Je,e as Qe}from"./dd-store.CmgH7V2_.js";import{i as J}from"./icons.B3L6BEf9.js";import{S as D,p as U,l as ge}from"./map-geometry.BxBMLGQy.js";import{b as et,e as tt,r as at,B as nt,a as ot}from"./boundary-file.BIrsBNgI.js";import"./a11y.c6v_nqwk.js";class st extends Ge{constructor(){super(),this.onNativeClose=()=>{this.open&&this.dismiss()},this.onLightDismiss=d=>{const o=this.dialogEl;if(!o||!this.open||d.composedPath()[0]!==o)return;const g=o.getBoundingClientRect();g.top<=d.clientY&&d.clientY<=g.top+g.height&&g.left<=d.clientX&&d.clientX<=g.left+g.width||this.dismiss()},this.confirm=()=>this.resolve(!0),this.cancel=()=>this.resolve(!1),this.dismiss=()=>this.resolve(!1,!0),this.open=!1,this.heading="",this.message="",this.variant="default",this.confirmLabel="Confirm",this.cancelLabel="Cancel",this.showIcon=!0,this.showCloseButton=!0}static{this.properties={open:{type:Boolean,reflect:!0},heading:{type:String},message:{type:String},variant:{type:String,reflect:!0},confirmLabel:{type:String,attribute:"confirm-label"},cancelLabel:{type:String,attribute:"cancel-label"},showIcon:{type:Boolean,attribute:"show-icon",converter:Be},showCloseButton:{type:Boolean,attribute:"show-close-button",converter:Be}}}connectedCallback(){super.connectedCallback(),"closedBy"in HTMLDialogElement.prototype||this.addEventListener("click",this.onLightDismiss)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.onLightDismiss)}get dialogEl(){return this.renderRoot.querySelector("dialog")}updated(d){if(!d.has("open"))return;const o=this.dialogEl;o&&(this.open?(o.open||o.showModal(),requestAnimationFrame(()=>{this.renderRoot.querySelector(".esa-confirm-dialog__btn--outline")?.focus()})):o.close())}show(){this.open=!0}resolve(d,o=!1){this.open=!1,o&&this.dispatchEvent(new CustomEvent("dismiss",{bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent(d?"confirm":"cancel",{bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("resolved",{detail:{confirmed:d,dismissed:o},bubbles:!0,composed:!0}))}icon(){return this.showIcon?this.variant==="danger"?H`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`:this.variant==="warning"?H`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`:H`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`:null}render(){return H`
      <dialog
        class="esa-confirm-dialog"
        role="alertdialog"
        closedby="any"
        aria-labelledby=${this.heading?"esa-confirm-dialog-title":he}
        aria-label=${this.heading?he:"Confirm"}
        aria-describedby=${this.message?"esa-confirm-dialog-message":he}
        @close=${this.onNativeClose}
      >
        ${""}
        ${this.showCloseButton?H`<button
              class="esa-confirm-dialog__close"
              type="button"
              aria-label="Close"
              @click=${this.dismiss}
            ><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`:null}
        <div class="esa-confirm-dialog__content">
          ${this.showIcon?H`<div class="esa-confirm-dialog__icon esa-confirm-dialog__icon--${this.variant}">${this.icon()}</div>`:null}
          <h2 id="esa-confirm-dialog-title" class="esa-confirm-dialog__title typography-title">${this.heading}</h2>
          <p id="esa-confirm-dialog-message" class="esa-confirm-dialog__message typography-body-md">${this.message}</p>
        </div>
        <div class="esa-confirm-dialog__footer">
          <button class="esa-confirm-dialog__btn esa-confirm-dialog__btn--outline typography-label-md" @click=${this.cancel}>${this.cancelLabel}</button>
          <button
            class="esa-confirm-dialog__confirm esa-confirm-dialog__btn typography-label-md esa-confirm-dialog__btn--${this.variant==="default"?"primary":this.variant}"
            @click=${this.confirm}
          >${this.confirmLabel}</button>
        </div>
      </dialog>
    `}static{this.styles=[Ke,Ze`
    :host { display: contents; }

    /* The backdrop and centering divs are gone — ::backdrop paints the scrim and
       the UA centers a modal <dialog> with 'margin: auto'. See esa-dialog. */
    /* hub-edit-approved: user approved (2026-06-29) — relative + close button styles. */
    dialog.esa-confirm-dialog {
      position: relative;
      border: none;
      padding: 0;
      margin: auto;
      width: var(--confirm-dialog-width, 360px);
      max-width: calc(100vw - 2rem);
      background: var(--color-background-elevation-floating, #fcfcfc);
      color: var(--color-content-default, #202020);
      border-radius: var(--radius-lg, 0.75rem);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      font-family: var(--typography-font-family-sans, 'DM Sans', sans-serif);
    }
    dialog.esa-confirm-dialog[open] { display: block; }
    /* Literal fallback is the real value where ::backdrop does not inherit. */
    dialog.esa-confirm-dialog::backdrop {
      background: var(--color-background-overlay-backdrop, rgba(0, 0, 0, 0.5));
    }

    /* hub-edit-approved: user approved hub edits this session (2026-06-30) — on mobile
       the confirm dialog docks to the bottom as a full-width sheet, matching esa-dialog. */
    @media (max-width: 600px) {
      dialog.esa-confirm-dialog {
        margin: auto auto 0;
        width: 100%;
        max-width: 100%;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        animation: esa-confirm-sheet-in var(--animation-overlay-enter, 250ms ease-out);
      }
    }
    @keyframes esa-confirm-sheet-in {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }

    .esa-confirm-dialog__close {
      position: absolute;
      top: var(--spacing-300, 0.75rem);
      right: var(--spacing-300, 0.75rem);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: var(--radius-md, 0.5rem);
      background: transparent;
      color: var(--color-content-default-secondary, #646464);
      cursor: pointer;
      transition: background var(--transition-fast, 150ms ease), color var(--transition-fast, 150ms ease);
    }
    .esa-confirm-dialog__close:hover {
      background: var(--color-background-elevation-sunken, #f0f0f0);
      color: var(--color-content-default, #202020);
    }
    .esa-confirm-dialog__close:focus-visible {
      outline: var(--focus-ring-width, 2px) solid var(--focus-ring-color, #3e9b4f);
      outline-offset: var(--focus-ring-offset, 2px);
    }

    .esa-confirm-dialog__content {
      padding: var(--spacing-500, 1.5rem);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .esa-confirm-dialog__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-pill, 9999px);
      margin-bottom: var(--spacing-300, 0.75rem);
    }
    .esa-confirm-dialog__icon--default {
      background: var(--color-background-utility-info-subtle, #fbfdff);
      color: var(--color-content-utility-info, #0d74ce);
    }
    .esa-confirm-dialog__icon--danger {
      background: var(--color-background-utility-danger-subtle, #fffcfc);
      color: var(--color-content-utility-danger, #ce2c31);
    }
    .esa-confirm-dialog__icon--warning {
      background: var(--color-background-utility-warning-subtle, #fefdfb);
      color: var(--color-content-utility-warning, #ab6400);
    }
    .esa-confirm-dialog__title {
      margin: 0 0 var(--spacing-150, 0.375rem);
      color: var(--color-content-default, #202020);
    }
    .esa-confirm-dialog__message {
      color: var(--color-content-default-secondary, #646464);
      /* Leading comes from .typography-body-md. It carried an override back when
         body-md was relaxed (1.8); the role leads at normal now, so it went. */
      margin: 0;
    }

    .esa-confirm-dialog__footer {
      padding: var(--spacing-300, 0.75rem) var(--spacing-500, 1.5rem);
      border-top: var(--border-width-default, 1px) solid var(--color-border-default-subtle, #d9d9d9);
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-200, 0.5rem);
    }

    .esa-confirm-dialog__btn {
      padding: var(--spacing-200, 0.5rem) var(--spacing-400, 1rem);
      border-radius: var(--radius-md, 0.5rem);
      cursor: pointer;
      border: var(--border-width-default, 1px) solid transparent;
      transition: background var(--transition-fast, 150ms ease);
    }
    .esa-confirm-dialog__btn:focus-visible {
      outline: var(--focus-ring-width, 2px) solid var(--focus-ring-color, #3e9b4f);
      outline-offset: var(--focus-ring-offset, 2px);
    }
    .esa-confirm-dialog__btn--outline {
      background: transparent;
      border-color: var(--color-border-default-strong, #bbbbbb);
      color: var(--color-content-default, #202020);
    }
    .esa-confirm-dialog__btn--outline:hover { background: var(--color-background-elevation-sunken, #f0f0f0); }
    .esa-confirm-dialog__btn--primary {
      background: var(--color-background-brand, #46a758);
      color: var(--color-content-default-knockout, #fcfcfc);
    }
    .esa-confirm-dialog__btn--primary:hover { background: var(--color-background-brand-hover, #3e9b4f); }
    .esa-confirm-dialog__btn--danger {
      background: var(--color-background-utility-danger, #ce2c31);
      color: var(--color-content-on-utility-danger, #fcfcfc);
    }
    .esa-confirm-dialog__btn--danger:hover { background: var(--color-background-utility-danger-hover, #641723); }
    /* Knockout text here measured 1.54:1 — yellow-9 is a bright scale, so the
       foreground is dark (7.21:1). This is the one intent whose fill does NOT move
       to step 11: yellow-11 under dark text drops to 2.47:1. */
    .esa-confirm-dialog__btn--warning {
      background: var(--color-background-utility-warning, #ffc53d);
      color: var(--color-content-on-utility-warning, #4f3422);
    }
    .esa-confirm-dialog__btn--warning:hover { background: var(--color-background-utility-warning-hover, #ffba18); }

    /* FORCED COLORS. box-shadow is forced to 'none', so the panel needs a real
       edge. The danger/warning BUTTONS lose their tint here too and there is no
       system colour that means "destructive" — the button's own label is what
       carries that, which is why confirm dialogs must never ship a bare "OK". */
    @media (forced-colors: active) {
      dialog.esa-confirm-dialog { border: 1px solid CanvasText; }
    }
  `]}}customElements.get("esa-confirm-dialog")||customElements.define("esa-confirm-dialog",st);const Re=document.querySelector("[data-dd-bmap]");Re&&rt(Re);function rt(C){const d=JSON.parse(C.dataset.model??"{}"),o=e=>C.querySelector(e),g=e=>Array.from(C.querySelectorAll(e)),q=o("[data-map]"),$=o("[data-overlay]"),Y=o("[data-tip]"),Q=o("[data-find]"),S=o("[data-find-input]"),L=o("[data-results]"),qe=document.querySelector("[data-dd-bupload]")?.dataset.uploadHint??"",_=e=>e.map(([t,a])=>[t,a]),ve=e=>Math.abs(e.reduce((t,[a,s],i)=>{const[c,p]=e[(i+1)%e.length];return t+a*p-c*s},0))/2,be=e=>e.reduce((t,[a,s],i)=>{const[c,p]=e[(i+1)%e.length];return t+Math.hypot(c-a,p-s)},0),Oe=ve(D),Pe=be(D),ye=e=>e.length<3?0:d.acres*ve(e)/Oe,we=e=>d.perimeterMi*be(e)/Pe,z=e=>d.parcels.find(t=>t.apn===e),re=d.parcels.filter(e=>e.inSite).map(e=>e.apn);let n=Ne().boundary==="defined"?"edit":"idle",ee=_(D),f=_(ee),l=[],h=!1,v=null,u=[],O=null,w=null,B=null,ie="",M=null,k=[],x=0;const xe=()=>({poly:_(f),drawPts:_(l),drawClosed:h,sel:[...u]}),te=()=>{k=[xe()],x=0},W=()=>{k=k.slice(0,x+1),k.push(xe()),x=k.length-1},$e=e=>{f=_(e.poly),l=_(e.drawPts),h=e.drawClosed,u=[...e.sel]};te();const N=()=>Ne().boundary==="defined",Ie=()=>N()?"view":"idle",A=d.view,_e=[A[0]+A[2]/2,A[1]+A[3]/2];let P=1,de=[..._e];const Fe=g("svg[data-dd-map], svg[data-overlay]"),le=()=>{const e=$.getScreenCTM();return e&&e.a?1/e.a:4},ae=e=>{const t=$.getScreenCTM();if(!t)return[0,0];const a=new DOMPoint(e.clientX,e.clientY).matrixTransform(t.inverse());return[Math.round(a.x),Math.round(a.y)]},je=()=>{const e=q.getBoundingClientRect();if(!e.width||!e.height)return 1;const t=e.width/A[2],a=e.height/A[3];return Math.min(t,a)/Math.max(t,a)},V=()=>{const e=P*je(),t=A[2]/e,a=A[3]/e,s=`${de[0]-t/2} ${de[1]-a/2} ${t} ${a}`;Fe.forEach(i=>i.setAttribute("viewBox",s)),He(),b()},He=()=>{const e=le()*3.28084,t=[100,200,500,1e3,2e3,5e3,1e4,2e4],a=t.filter(s=>s/e<=96).pop()??t[0];o("[data-scale-bar]").style.width=`${Math.round(a/e)}px`,o("[data-scale-label]").textContent=`${a.toLocaleString("en-US")} ft`},ke=(e,t,a,s="")=>`<g class="num ${s}"><circle cx="${e[0]}" cy="${e[1]}" r="${9*a}"/><text x="${e[0]}" y="${e[1]}" font-size="${11*a}" dy="0.36em" text-anchor="middle">${t}</text></g>`;function b(){const e=le();let t="";if(n==="parcels"&&(d.parcels.forEach(a=>{t+=`<path class="pc${u.includes(a.apn)?" is-sel":""}" data-apn="${a.apn}" d="${U(a.pts)}"/>`}),u.forEach((a,s)=>{t+=ke(z(a).label,s+1,e)})),w){const a=z(w);t+=`<path class="find" d="${U(a.pts)}"/>`,t+=`<g class="pin" transform="translate(${a.label[0]-12*e} ${a.label[1]-22*e}) scale(${e})">${J("map-pin",24,1.75)}</g>`}if(B&&(t+=`<g class="pin" transform="translate(${B[0]-12*e} ${B[1]-22*e}) scale(${e})">${J("map-pin",24,1.75)}</g>`),(n==="view"||n==="edit")&&(t+=`<path class="site" d="${U(f)}"/>`,d.parcels.filter(a=>a.inSite).forEach((a,s)=>{t+=ke(a.label,s+1,e)})),n==="preview"&&(t+=`<path class="site site--preview" d="${U(D)}"/>`),n==="edit"&&(f.forEach(([a,s],i)=>{const[c,p]=f[(i+1)%f.length];t+=`<circle class="mid" data-mid="${i}" cx="${(a+c)/2}" cy="${(s+p)/2}" r="${3.5*e}"/>`}),f.forEach(([a,s],i)=>{t+=`<circle class="vtx" data-vtx="${i}" cx="${a}" cy="${s}" r="${5*e}"/>`})),n==="draw"){if(h)t+=`<path class="site" d="${U(l)}"/>`;else{const a=l[l.length-1];v&&l.length>=2&&(t+=`<path class="draw-fill" d="${U([...l,v])}"/>`),l.length>=2&&(t+=`<path class="draw-line" d="${ge(l)}"/>`),v&&a&&(t+=`<path class="draw-band" d="${ge([a,v])}"/>`,l.length>=2&&(t+=`<path class="draw-band draw-band--faint" d="${ge([v,l[0]])}"/>`))}l.forEach(([a,s],i)=>{t+=`<circle class="vtx${i===0&&!h?" vtx--first":""}" cx="${a}" cy="${s}" r="${(i===0&&!h?6:4.5)*e}"/>`})}$.innerHTML=t}const ne=e=>o(`[data-tool="${e}"]`),ce=(e,t)=>{e.setAttribute("aria-pressed",String(t)),e.closest(".esa-button")?.classList.toggle("esa-button--active",t)},X=(e,t)=>{e&&(e.disabled=t,e.closest(".esa-button")?.classList.toggle("esa-button--disabled",t))};function Ue(){const e=N();C.dataset.mode=n;const t=e&&n!=="preview"||n==="draw"||n==="parcels";o("[data-tools]").hidden=!t||n==="idle",ce(ne("edit"),n==="edit"),ce(ne("draw"),n==="draw"),ce(ne("parcels"),n==="parcels"),X(ne("edit"),!e),o("[data-draw-label]").textContent=e?"Draw New":"Draw Area";const a=n==="edit"||n==="draw"||n==="parcels";X(o('[data-act="undo"]'),!a||x===0),X(o('[data-act="redo"]'),!a||x>=k.length-1),X(o('[data-act="delete"]'),!(e&&(n==="view"||n==="edit"))),Q.classList.toggle("is-left",n==="idle"||n==="preview"),g("[data-hint]").forEach(c=>{c.hidden=c.dataset.hint!==n});const i=C.querySelector('[data-hint="draw"] [data-act="done"]')?.closest(".esa-button");i&&(i.hidden=!h),X(C.querySelector('[data-hint="parcels"] [data-act="done"]'),u.length===0),o("[data-preview-name]").textContent=ie,o("[data-chooser]").hidden=n!=="idle",o("[data-chooser-error]").hidden=!M,M&&(o("[data-error-title]").textContent=`Couldn't read ${M.name}`,o("[data-error-text]").textContent=M.message)}const Ee=e=>{const t=o("[data-tpl-count]").content.cloneNode(!0),a=t.querySelector(".esa-badge__text");return a&&(a.textContent=String(e)),t};function Ce(){const e=N(),t=n==="idle"?"none":n==="draw"||n==="parcels"?"editing":n==="preview"?"preview":"";g("[data-badge]").forEach(T=>{T.hidden=T.dataset.badge!==t});let a=null,s=null,i=0,c=null;(n==="view"||n==="edit")&&(a=ye(f),s=we(f)),n==="preview"&&(a=d.acres,s=d.perimeterMi),n==="draw"&&(h?(a=ye(l),s=we(l)):c=["No area drawn yet",l.length?`${l.length} ${l.length===1?"corner":"corners"}`:""]),n==="parcels"&&(u.length?(a=u.reduce((T,K)=>T+z(K).acres,0),i=1):c=["No parcels selected yet",""]),o("[data-p-stat]").hidden=a===null,a!==null&&(o("[data-stat-ac]").textContent=`${a.toLocaleString("en-US",{minimumFractionDigits:i,maximumFractionDigits:i})} ac`,o("[data-stat-sqmi]").textContent=`${(a/640).toFixed(2)} sq mi`),o("[data-p-empty]").hidden=!c,c&&(o("[data-empty-title]").textContent=c[0],o("[data-empty-sub]").textContent=c[1],o("[data-empty-sub]").hidden=!c[1]),o("[data-county-locked]").hidden=!e,o("[data-county-select]").hidden=e,o("[data-p-perimeter]").hidden=s===null,s!==null&&(o("[data-perimeter]").textContent=`${s.toFixed(1)} mi`),o("[data-p-crossed]").hidden=!(n==="view"||n==="edit"),o("[data-p-affects]").hidden=n!=="edit";const p=o("[data-p-selected]");p.hidden=!(n==="parcels"&&u.length>0),p.hidden||(o("[data-selected-count]").replaceChildren(Ee(u.length)),o("[data-selected-list]").replaceChildren(...u.map((Z,E)=>{const r=z(Z),m=document.createElement("li");m.className="dd-bmap__sel",m.innerHTML=`<span class="dd-bmap__num dd-bmap__num--brand dd-t-12-strong">${E+1}</span><span class="dd-t-mono dd-bmap__sel-apn">${r.short}</span><span class="dd-t-13">${r.acres.toFixed(1)} ac</span>`;const R=o("[data-tpl-remove]").content.cloneNode(!0),se=R.querySelector("button");return se&&(se.setAttribute("aria-label",`Remove ${r.short}`),se.title=`Remove ${r.short}`,se.dataset.remove=Z),m.append(R),m})))}function y(){b(),Ue(),Ce()}const I=e=>{n=e,w=null,y()},Ye=()=>{f=_(ee),te(),I("edit")},Se=()=>{l=[],h=!1,v=null,te(),I("draw")},ue=e=>{u=[...e],te(),I("parcels")},G=e=>{ee=_(e),f=_(e),M=null,n="view",Me(),Te({boundary:"defined"}),Qe("boundary"),me("Saved"),y()},pe=o("[data-confirm-clear]");pe.addEventListener("confirm",()=>{pe.open=!1,n="idle",M=null,Me(),Te({boundary:"none"}),me("Saved"),y()});const ze=()=>{n==="edit"?G(f):n==="draw"&&h?G(D):n==="parcels"&&u.length?G(D):n==="preview"&&(window.dispatchEvent(new CustomEvent(ot,{detail:{name:ie}})),G(D))},We=()=>{n==="edit"&&(f=_(ee)),I(Ie())},Ve=()=>{x>0&&(x-=1,$e(k[x]),y())},Xe=()=>{x<k.length-1&&(x+=1,$e(k[x]),y())};C.addEventListener("click",e=>{const t=e.target,a=t.closest("[data-tool]")?.dataset.tool;if(a==="edit")return Ye();if(a==="draw")return Se();if(a==="parcels")return ue(N()?re:[]);const s=t.closest("[data-way]")?.dataset.way;if(s==="draw")return Se();if(s==="parcels")return ue([]);if(s==="upload"){window.dispatchEvent(new CustomEvent(et));return}if(s==="sample")return G(D);const i=t.closest("[data-remove]")?.dataset.remove;if(i){u=u.filter(p=>p!==i),W(),y();return}switch(t.closest("[data-act]")?.dataset.act){case"undo":return Ve();case"redo":return Xe();case"delete":pe.open=!0;return;case"zoom-in":return P=Math.min(6,P*1.5),V();case"zoom-out":return P=Math.max(.67,P/1.5),V();case"fit":return P=1,de=[..._e],V();case"cancel":return We();case"done":return ze()}});const fe=(e,t)=>{const a=q.getBoundingClientRect();Y.innerHTML=t,Y.style.left=`${e.clientX-a.left+14}px`,Y.style.top=`${e.clientY-a.top+14}px`,Y.hidden=!1},F=()=>{Y.hidden=!0};$.addEventListener("pointerdown",e=>{if(n!=="edit")return;const t=e.target,a=t.closest("[data-vtx]"),s=t.closest("[data-mid]");if(!(!a&&!s)){if(e.preventDefault(),a)O=Number(a.dataset.vtx);else if(s){const i=Number(s.dataset.mid);f.splice(i+1,0,ae(e)),O=i+1}$.setPointerCapture(e.pointerId),F(),b()}}),$.addEventListener("pointermove",e=>{const t=e.target;if(n==="edit"){if(O!==null){f[O]=ae(e),b(),Ce();return}t.closest("[data-vtx], [data-mid]")?fe(e,"Drag to Move"):F();return}if(n==="draw"&&!h){v=ae(e),b();const a=l[l.length-1];if(a){const s=Math.round(Math.hypot(v[0]-a[0],v[1]-a[1])*3.28084/10)*10;fe(e,`${s.toLocaleString("en-US")} ft`)}else F();return}if(n==="parcels"){const a=t.closest("[data-apn]")?.dataset.apn;if(a){const s=z(a);fe(e,`<span class="dd-t-mono">${s.short}</span> <span class="dd-bmap__tip-sub">${s.acres.toFixed(1)} ac</span>`)}else F()}}),$.addEventListener("pointerup",e=>{O!==null&&(O=null,$.releasePointerCapture(e.pointerId),W(),y())}),$.addEventListener("pointerleave",()=>{F(),n==="draw"&&v&&(v=null,b())});const Le=()=>{l.length<3||h||(h=!0,v=null,F(),W(),y())};$.addEventListener("click",e=>{if(n==="draw"&&!h){const t=ae(e),a=l[0];if(a&&l.length>=3&&Math.hypot(t[0]-a[0],t[1]-a[1])/le()<10)return Le();l.push(t),W(),y();return}if(n==="parcels"){const t=e.target.closest("[data-apn]")?.dataset.apn;if(!t)return;u=u.includes(t)?u.filter(a=>a!==t):[...u,t],W(),y()}}),window.addEventListener("keydown",e=>{n==="draw"&&e.key==="Enter"&&Le()}),q.addEventListener("dragover",e=>{e.preventDefault()}),q.addEventListener("drop",e=>{e.preventDefault();const t=e.dataTransfer?.files?.[0];t&&tt(at(t,qe))}),window.addEventListener(nt,e=>{const t=e.detail;if(t.ok){M=null,ie=t.name,I("preview");return}N()||(M={name:t.name,message:t.message},I("idle"))});const oe=e=>e.replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),j=()=>{L.hidden=!0,Q.classList.remove("is-open")};function Me(){S.value="",S.placeholder="Find an Address or APN",w=null,B=null,j()}function Ae(e){const t=e.trim();if(w=null,!t){B=null,j(),b();return}const a=t.toLowerCase().split(/\s+/).filter(Boolean),s=a.filter(r=>/[a-z]/.test(r)),i=a.filter(r=>!/[a-z]/.test(r)).join("").replace(/\D/g,""),c=a.find(r=>/^\d+$/.test(r)),p=d.parcels.filter(r=>{if(s.length){const m=r.situs?.toLowerCase()??"";return!!m&&s.every(R=>m.includes(R))&&(!c||m.startsWith(`${c} `))}return i.length>=3&&r.apn.replace(/\D/g,"").includes(i)}),T="grant line rd",K=s.length>0&&s.every(r=>T.includes(r)),Z=`${c?`${c} `:""}Grant Line Rd`;let E="";!p.length&&!K?E=`<div class="no-match"><span class="dd-t-14-medium">No parcel or address matched</span><span class="dd-t-13 dd-bmap__muted">Check the spelling, or search by APN, like ${d.parcels.find(m=>m.inSite)?.short??""}.</span></div>`:(p.length&&(E+=`<div class="group-h dd-t-13-medium">Parcels <span data-count="${p.length}"></span></div>`,E+=p.map(r=>`<div class="hit" data-hit-apn="${r.apn}">${J("layers",16)}<span class="hit-text"><span class="dd-t-mono">${r.short}</span><span class="dd-t-12 dd-bmap__muted">${r.situs?`${oe(r.situs)} · `:""}${r.acres.toFixed(1)} ac</span></span><span data-add-slot></span></div>`).join("")),K&&(E+='<div class="group-h dd-t-13-medium">Addresses <span data-count="2"></span></div>',E+=`<button type="button" class="hit hit--addr" data-addr>${J("map-pin",16)}<span class="hit-text"><span class="dd-t-14">${oe(Z)}, Elk Grove, CA</span><span class="dd-t-12 dd-bmap__muted">Not in the county's parcel data: shows the spot on the map</span></span></button>`,E+=`<div class="hit hit--off">${J("map-pin",16)}<span class="hit-text"><span class="dd-t-14">${oe(Z)}, Livermore, CA</span><span class="dd-t-12">${oe(d.otherCounty)}</span></span></div>`)),L.innerHTML=E,L.querySelectorAll("[data-count]").forEach(r=>r.replaceWith(Ee(Number(r.dataset.count)))),L.querySelectorAll("[data-hit-apn]").forEach(r=>{const m=r.querySelector("[data-add-slot]");if(N()&&re.includes(r.dataset.hitApn)&&n!=="parcels"||n==="parcels"&&u.includes(r.dataset.hitApn)){m.replaceWith(Object.assign(document.createElement("span"),{className:"in-area dd-t-13",textContent:"In the Area"}));return}const R=o("[data-tpl-add]").content.cloneNode(!0);R.querySelector("button")?.setAttribute("data-add",r.dataset.hitApn),m.replaceWith(R)}),L.hidden=!1,Q.classList.add("is-open"),w=p[0]?.apn??null,b()}S.addEventListener("change",e=>Ae(e.detail?.value??S.value)),S.addEventListener("keydown",e=>{e.key==="Escape"&&(j(),w=null,b())}),S.addEventListener("focusin",()=>{S.value?.trim()&&Ae(S.value)}),L.addEventListener("pointerover",e=>{const t=e.target.closest("[data-hit-apn]")?.dataset.hitApn;t&&t!==w&&(w=t,b())}),L.addEventListener("click",e=>{const t=e.target,a=t.closest("[data-add]")?.dataset.add;if(a){const s=n==="parcels"?u:N()?re:[];j(),B=null,ue(s.includes(a)?s:[...s,a]);return}t.closest("[data-addr]")&&(B=[1050,-300],w=null,j(),b())}),document.addEventListener("pointerdown",e=>{!L.hidden&&!Q.contains(e.target)&&(j(),w=null,b())}),o("[data-basemap]").addEventListener("change",e=>{const t=e.detail.value;g("[data-base]").forEach(a=>{a.hidden=a.dataset.base!==t})});const De=o("[data-county]");customElements.whenDefined("esa-select").then(()=>{De.value=d.county}),De.addEventListener("change",()=>me("Saved")),Je(e=>{e.boundary==="none"&&(n==="view"||n==="edit")&&(n="idle"),e.boundary==="defined"&&n==="idle"&&(n="view"),y()}),new ResizeObserver(()=>V()).observe(q),V(),y()}
