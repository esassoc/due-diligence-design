// Accessible names for esa-text-field / esa-select / esa-textarea used without
// a visible `label` prop (the label sits in our own label column). The legos
// read their name from `label` only; a host `aria-label` does not reach the
// inner control, which then falls back to its placeholder. This copies the
// host's aria-label onto the inner `.input` once the element has rendered.
// Lego gap: a forwarded `aria-label` on these three legos.
type LitHost = HTMLElement & { updateComplete?: Promise<unknown> };

export async function nameInnerControls(scope: ParentNode = document): Promise<void> {
  const hosts = [...scope.querySelectorAll<LitHost>('esa-text-field[aria-label], esa-select[aria-label], esa-textarea[aria-label]')];
  await Promise.all(
    hosts.map(async (host) => {
      await customElements.whenDefined(host.localName);
      await host.updateComplete;
      const inner = host.shadowRoot?.querySelector<HTMLElement>('.input');
      const name = host.getAttribute('aria-label');
      if (inner && name) inner.setAttribute('aria-label', name);
    }),
  );
}
