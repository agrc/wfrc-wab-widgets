# wfrc-wab-widgets [![Build Status](https://travis-ci.com/agrc/wfrc-wab-widgets.svg?branch=master)](https://travis-ci.com/agrc/wfrc-wab-widgets)
Web App Builder Widgets built for Wasatch Front Regional Council

[Requirements](https://docs.google.com/document/d/1h_7FTRrov3WgGAcQXJFpw87Adz9oFyiwgOkJOsYnqLw/edit)  
[Mockups](https://docs.google.com/presentation/d/1gkYFpZ-4EedxJpL895hKCi5OjegASWdz1YrS2kAYN6Y/edit?ts=5b9195cc#slide=id.p)

### Resources
[Esri Yeoman Generators](https://github.com/Esri/generator-esri-appbuilder-js)  
[Wrapped Widget Example](https://github.com/gbochenek/wab-test-example)

### Development
1. Start Web App Builder: `node WebAppBuilderForArcGIS/server/server.js`
2. Start local grunt (from project root): `grunt`
3. Go to [http://<your machine name>:3344/webappbuilder/](http://<your machine name>:3344/webappbuilder/)

Any changes you make to widget files are automatically copied to your web app builder installation and the test application located at [http://<your machine name>:3344/webappbuilder/apps/2/](http://<your machine name>:3344/webappbuilder/apps/2/) (this is configurable in `Gruntfile.js`).
