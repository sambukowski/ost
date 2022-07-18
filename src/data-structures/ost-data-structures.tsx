export interface OnScreenItem {
  on_screen_percent: number;
  name: string;
  color: string;
  appearances: Appearance[];
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
