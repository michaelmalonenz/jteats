import {PLATFORM} from 'aurelia-pal';

export function configure(config) {
  config.globalResources([
    PLATFORM.moduleName('./icon'),
    PLATFORM.moduleName('./user-panel'),
    PLATFORM.moduleName('./date-picker'),
    PLATFORM.moduleName('./select-dropdown'),
    PLATFORM.moduleName('./focus-on-attach'),
    PLATFORM.moduleName('./menu-display'),
    PLATFORM.moduleName('./meal-menu-section'),
    PLATFORM.moduleName('./value-converters/currency-value-converter'),
    PLATFORM.moduleName('./user-display'),
    PLATFORM.moduleName('./meal-order'),
  ]);
}
