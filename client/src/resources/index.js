import {PLATFORM} from 'aurelia-pal';

export function configure(config) {
  config.globalResources([
    PLATFORM.moduleName('./icon'),
    PLATFORM.moduleName('./user-panel'),
  ]);
}
