export class App {
  message = 'Hello, World!';


  configureRouter (config, router) {
    config.title = 'Agile Bored'
    config.addPipelineStep('authorize', AuthorizeStep)
    config.map([
      { route: ['', ''], name: '', moduleId: '', nav: true, title: '', auth: true, settings: { icon: 'fa-th' } },
    ])

    this.router = router
  }
}
