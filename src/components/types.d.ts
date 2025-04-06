declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Material Icon props
declare type MaterialIconProps = {
  name: string;
  size?: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';
  color?: string;
  customClass?: string;
}