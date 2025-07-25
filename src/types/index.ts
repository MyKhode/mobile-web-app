export interface Path {
  name?: string;
  path?: string;
  params?: {
    [k in string]: string;
  };
  query?: {
    [k in string]: string;
  };
}

export interface Child {
  id: number | string;
  icon?: string;
  title?: string;
  badge?: number | string;
  path?: Path | string;
}

export interface CurvedOption {
  id: number | string;
  icon?: string;
  title?: string;
  badge?: number | string;
  path?: Path | string;
  childs?: Child[];
  isActive?: boolean;
}
export interface CurvedProps {
  modelValue: number | string | null;
  options: CurvedOption[];
  foregroundColor?: string;
  backgroundColor?: string;
  iconColor?: string;
  badgeColor?: string;
  replaceRoute?: boolean;
}

export interface GrowOption {
  id: number | string;
  icon?: string;
  title?: string;
  color?: string;
  selected?: boolean;
  path?: Path | string;
}
export interface GrowProps {
  modelValue: number | string | null;
  options: GrowOption[];
  color?: string;
  replaceRoute?: boolean;
}

export interface RingOption {
  id: number | string;
  icon?: string;
  title?: string;
  badge?: number | string;
  selected?: boolean;
  deselect?: boolean;
  path?: Path | string;
}
export interface RingProps {
  modelValue: number | string | null;
  options: RingOption[];
  titleColor?: string;
  borderColor?: string;
  badgeColor?: string;
  iconColor?: string;
  replaceRoute?: boolean;
}

export interface SwipeOption {
  id: number | string;
  icon?: string;
  title?: string;
  selected?: boolean;
  path?: Path | string;
}
export interface SwipeProps {
  modelValue: number | string | null;
  options: SwipeOption[];
  swiperColor?: string;
  backgroundColor?: string;
  iconColor?: string;
  replaceRoute?: boolean;
}

export interface WindowsOption {
  id: number | string;
  icon?: string;
  title?: string;
  color?: string;
  badge?: number | string;
  selected?: boolean;
  deselect?: boolean;
  path?: Path | string;
}
export interface WindowsProps {
  modelValue: number | string | null;
  options: WindowsOption[];
  swiperColor?: string;
  backgroundColor?: string;
  iconColor?: string;
  replaceRoute?: boolean;
}

// src/types/index.ts or define locally if you don't have one
export interface HillOption {
  id: string | number
  icon: string
  badge?: number
  selected?: boolean
  deselect?: boolean
  color?: string
  path?: string | {
    name?: string
    path?: string
    params?: Record<string, string | number | (string | number)[]>
    query?: Record<string, string | number>
  }
}



export interface HillProps {
  modelValue: number | string | null;
  options: HillOption[];
  color?: string;
  backgroundColor?: string;
  badgeColor?: string;
  replaceRoute?: boolean;
}

export interface FlashlightOption {
  id: number | string;
  icon?: string;
  selected?: boolean;
  path?: Path | string;
}
export interface FlashlightProps {
  modelValue: number | string | null;
  options: HillOption[];
  flashlightColor?: string;
  backgroundColor?: string;
  iconColor?: string;
  replaceRoute?: boolean;
}
