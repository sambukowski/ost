export interface OnScreenItem {
  on_screen_percent: number;
  name: string;
  color: string;
  appearances: Appearance[];
  event_list: string[];
  events: Event[];
}

export interface Appearance {
  start: number;
  end?: number;
}

export interface OSTproject {
  title: string;
  time: number;
  items: OnScreenItem[];
}

export interface Event {
  time: number;
  name: string;
}
