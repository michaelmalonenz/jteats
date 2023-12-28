import environment from '../config/environment.json';
import {PLATFORM} from 'aurelia-pal';
import 'bootstrap'

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-dialog'), (config) => {
      config.settings.keyboard = ['Escape']
    })
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .feature(PLATFORM.moduleName('resources/index'))
    .feature(PLATFORM.moduleName('dialogs/index'))
    .globalResources([
      PLATFORM.moduleName('meals'),
      PLATFORM.moduleName('menus'),
    ]);

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
