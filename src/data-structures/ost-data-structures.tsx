export interface OnScreenItem {
  name: string;
  appearances: Appearance[];
  color: string;
}

export interface Appearance {
  start: number;
  end?: number;
}
