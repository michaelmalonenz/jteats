import {PLATFORM} from 'aurelia-pal';

export function configure(config) {
  config.globalResources([
    PLATFORM.moduleName('./meal-editor'),
    PLATFORM.moduleName('./menu-editor'),
    PLATFORM.moduleName('./menu-section-editor'),
  ]);
}
