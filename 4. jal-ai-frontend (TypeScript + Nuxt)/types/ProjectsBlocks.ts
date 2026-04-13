import type {Component} from 'vue'

export interface IProjectsBlocks {
    title: string
    left_block: {
        title: string
        subtitle: string
        description: string
        iconSvg: Component
    }
    right_block: {
        title: string
        subtitle: string
        description: string
        iconSvg: Component
    }
}
