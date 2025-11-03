import type {DefineComponent} from "vue";

export interface IProjectsBlocks {
    title: string;
    left_block: {
        title: string;
        subtitle: string;
        description: string;
        iconSvg: DefineComponent<{}, {}, any>;
    };
    right_block: {
        title: string;
        subtitle: string;
        description: string;
        iconSvg: DefineComponent<{}, {}, any>;
    }
}