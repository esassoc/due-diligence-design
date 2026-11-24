// Site Profile: the user's Theme Order (getState().themeOrder), with the data's
// order as the default. Sections reorder themselves when it changes.
import { getState, onState } from '../../lib/dd-store';
import { themes } from './profile-model';

const DEFAULT_IDS = themes.map((t) => t.id);

export function themeOrderIds(): number[] {
  const saved = getState().themeOrder;
  if (!saved) return [...DEFAULT_IDS];
  const valid = saved.filter((id) => DEFAULT_IDS.includes(id));
  return [...valid, ...DEFAULT_IDS.filter((id) => !valid.includes(id))];
}

/** Run fn now and whenever the order changes. */
export function onThemeOrder(fn: (ids: number[]) => void): void {
  let last = '';
  const run = (): void => {
    const ids = themeOrderIds();
    const key = ids.join(',');
    if (key === last) return;
    last = key;
    fn(ids);
  };
  run();
  onState(run);
}
