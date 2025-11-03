import type { DefineComponent } from 'vue';

export interface IFeature {
    name: string;
    description: string;
    iconSvg: DefineComponent<{}, {}, any>;
}