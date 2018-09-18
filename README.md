# wfrc-wab-widgets [![Build Status](https://travis-ci.com/agrc/wfrc-wab-widgets.svg?branch=master)](https://travis-ci.com/agrc/wfrc-wab-widgets)
Web App Builder Widgets built for Wasatch Front Regional Council

[Requirements](https://docs.google.com/document/d/1h_7FTRrov3WgGAcQXJFpw87Adz9oFyiwgOkJOsYnqLw/edit)  
[Mockups](https://docs.google.com/presentation/d/1gkYFpZ-4EedxJpL895hKCi5OjegASWdz1YrS2kAYN6Y/edit?ts=5b9195cc#slide=id.p)

### Widget Documentation
#### ProjectInfo
This widget displays the attribute values for map features that the user has clicked on. Features are collected from all feature layers that have been added to the map. The value that is show in the title bar is the value of the display field as defined in the feature service. Field name aliases are also used if they are defined.

Note: Popups should be removed from all feature layers within the web map to prevent the map popup from showing when clicking on features.

##### Configuration
`clickedPixelTolerance`  
The click tolerance (in pixels) for hitting features when clicking on the map. Defaults to 6.

`selectionColor`  
The color of the symbol used to display features that have been clicked on. Format is 1-255 rgba. Defaults to `[255, 255, 0, 230]`.

`excludeFields`  
This is a list of fields that should be excluded from the widget. Defaults to `["OBJECTID", "GlobalID"]`.

### Development
[Esri Yeoman Generators](https://github.com/Esri/generator-esri-appbuilder-js)  
[Wrapped Widget Example](https://github.com/gbochenek/wab-test-example)

#### Getting started
1. Start Web App Builder: `node WebAppBuilderForArcGIS/server/server.js`
1. Create a test application in WAB and update the path to it in `Gruntfile.js`, if needed.
1. Start local grunt (from project root): `grunt`
1. Go to [http://<your machine name>:3344/webappbuilder/](http://<your machine name>:3344/webappbuilder/)

Any changes you make to widget files are automatically copied to your web app builder installation and the test application located at [http://<your machine name>:3344/webappbuilder/apps/2/](http://<your machine name>:3344/webappbuilder/apps/2/) (this is configurable in `Gruntfile.js`).
