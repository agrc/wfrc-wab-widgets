# wfrc-wab-widgets [![Build Status](https://travis-ci.com/agrc/wfrc-wab-widgets.svg?branch=master)](https://travis-ci.com/agrc/wfrc-wab-widgets)
Web App Builder Widgets built for Wasatch Front Regional Council

[Requirements](https://docs.google.com/document/d/1h_7FTRrov3WgGAcQXJFpw87Adz9oFyiwgOkJOsYnqLw/edit)  
[Mockups](https://docs.google.com/presentation/d/1gkYFpZ-4EedxJpL895hKCi5OjegASWdz1YrS2kAYN6Y/edit?ts=5b9195cc#slide=id.p)  
Production Application: [https://wfrc.org/rtp-2019-adopted)](https://wfrc.org/rtp-2019-adopted))  
[Production Web Map](https://wfrc.maps.arcgis.com/home/webmap/viewer.html?webmap=a665db50a28c42bdaa3124df4ef563f0)

## General Setup for All Widgets
### Add a polyfill for older browsers
Add `https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.includes` to the resources array (~ line 104) in `init.js` within your Web App Builder App. For example:
```js
resources = resources.concat([
  window.apiUrl + 'dojo/resources/dojo.css',
  window.apiUrl + 'dijit/themes/claro/claro.css',
  window.apiUrl + 'esri/css/esri.css',
  window.apiUrl + 'dojox/layout/resources/ResizeHandle.css',
  window.path + 'jimu.js/css/jimu-theme.css',
  window.path + 'libs/caja-html-sanitizer-minified.js',
  window.path + 'libs/moment/twix.js',
  window.path + 'libs/Sortable.js',

  window.path + 'libs/cropperjs/cropperjs.js',
  window.path + 'libs/cropperjs/cropper.css',
  //because we have jimu/dijit/GridLayout dijit, so we import this css here
  window.path + 'libs/goldenlayout/goldenlayout-base.css',
  window.path + 'libs/goldenlayout/goldenlayout-light-theme.css',
  'https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.includes'
]);
```

## Widget Documentation
### ProjectInfo
This widget displays the attribute values for map features that the user has clicked on. Features are collected from all feature layers that have been added to the map. The value that is show in the title bar is the value of the display field as defined in the feature service. Field name aliases are also used if they are defined.

Notes:  
* Popups should be removed from all feature layers within the web map to prevent the map popup from showing when clicking on features.
* Each feature layer is required to have a valid display field defined.

#### Configuration
`clickedPixelTolerance` - `[number]`  
The click tolerance (in pixels) for hitting features when clicking on the map. Defaults to 6.

`selectionColor` - `[number[]]`  
The color of the symbol used to display features that have been clicked on. Format is 1-255 rgba. Defaults to `[255, 255, 0, 230]`.

`excludeFields` - `[string[]]`  
This is a list of fields that should be excluded from the widget. Defaults to `["OBJECTID", "GlobalID"]`.

`language` - `[string]`  
The language that the strings in the widget should be displayed as. Possible values are `english` and `spanish`. Defaults to `english`.

`strings` - `[object]`  
The language-specific strings to be used in the widget.

`layerSortOrder` - `[object]`  
This controls the order that the features show up in the Project Information panel. It is an array of layer name as defined in the web map.

### Comments
This widget is embedded within the ProjectInfo widget. No need to copy additional files. This widget will only be displayed for features with a `GlobalID` field.

#### Configuration
`commentsEnabled` [boolean]  
This controls weather the comments widget is displayed or not. Defaults to `true`.

`newCommentsOpenUntil` [string]  
The user will be able to post new comments until this date. Defaults to `"9999-01-31T00:00:00.000Z"`.

`commentsTableUrl` [string]  
The URL to the feature service that hosts the comments table. It is assumed that the comments table has the following fields:
- PersonName (text(50))
- PersonOrg (text(50))
- PersonCont (text(50))
- Comment (text(1000))
- CommentDT (date)
- GUID: (guid)

### BetterAbout
This widget is a thin wrapper around the out-of-the-box About widget. The only thing that it adds is a click event on all of the images in the content of the widget that opens the images in a larger dialog box. Otherwise, it should behave exactly the same as the About widget.

#### Table of Contents
A table of contents with clickable links can be achieve by using anchor tags to link to headers further down in the document. You can read more about this [on MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks#Document_fragments). For example. If you want to link to this header...

```html
<h1 id='my_header'>My Header</h1>
```

...you can use an anchor tag like this:

```html
<a href='#my_header'>my header</a>
```

Note: This will clear out any existing URL parameters in the address bar. However, I don't believe that this will make any difference to the average user; they likely won't even notice. This is just something to be aware of if you are building a URL to share with someone.

#### To update the About widget files (developer task)
1. Copy the About widget into `widgets/BetterAbout/About`.
1. Move `widgets/BetterAbout/About/nls` and `widgets/BetterAbout/About/setting/nls` to `widgets/BetterAbout` and `widgets/BetterAbout/settings` respectively.
1. Move `widgets/BetterAbout/About/Widget.html` and `widgets/BetterAbout/About/setting/Setting.html` to `widgets/BetterAbout` and `widgets/BetterAbout/settings` respectively.

### URL Params
This widget allows the application to be configured via URL parameters. Technically, it's an "on-screen" widget. However, it has no UI that is presented to the user. The widget supports the following parameters:

1. `x`, `y`, & `scale` - These parameters control the initial extent of the map when the application is loaded. They are dynamically updated any time the map extent changes.
  - example: `x=-12475241&y=4960919&scale=144448`
1. `guid` and `layerid` - These parameters load the application in a state as if the user had clicked on the specified project. They are dynamically updated each time the user expands a project to reveal its details. Note: this requires that the source layer have a GlobalID field.
  - example: `guid=%7BD4C8986B-942A-470F-A0D9-2F9BDF690851%7D&layerid=RTP_2019_2050_DraftPhased_1851`
1. `infopanel` - This parameter controls whether the BetterAbout widget's parent panel (left sidebar in the Jewelry theme) is open or closed.
1. `clickx` & `clicky` - These parameters act as if the user had clicked on the coordinates. This affects the ProjectInfo widget.
1. `basemap` - This parameter controls the currently selected base map via the LayerSelector widget.

#### Additional steps to add as an on-screen widget to WAB Developer Edition
1. Add a new config object to the `widgetOnScreen.widgets` array in `/client/stemapp/predefined-apps/default/config.json` & `/client/stemapp/config.json`.
  ```json
  {
    "uri": "widgets/URLParams/Widget",
    "visible": false,
    "position": {
      "top": 0,
      "left": 0
    }
  }
  ```
1. Add a new config object property to the `mobileLayout.widgetOnScreen.widgets` object in the same two files as above.
  ```json
  "widgets/URLParams/Widget": {
    "position": {
      "top": 0,
      "left": 0
    }
  }
  ```

#### Additional steps to add as an on-screen widget to an existing WAB application
1. In WAB, add the URLParams widget to any widget container.
1. Go to the object corresponding to this widget in the `widgetOnScreen.widgets` array in `config.json` and remove the `closable` & `placeholderIndex` properties.
  ```json
  {
    "position": {
      "left": 55,
      "top": 45,
      "relativeTo": "map"
    },
    "id": "_26",
    "version": "0.3.1",
    "uri": "widgets/URLParams/Widget",
    "name": "URLParams",
    "IsController": false,
    "config": "configs/URLParams/config__26.json"
  },
  ```

#### Configuration
`pointZoomLevel` [number]  
The caching scale level that you would like the map to zoom to for points. Higher numbers are larger scales.

### Layer Selector
This widget is an alternative to the out-of-the-box Basemap Gallery widget. It is a wrapper around the [AGRC Layer Selector widget](https://github.com/agrc-widgets/layer-selector).

This widget is an on-screen widget so it requires the same additional steps to add it to WAB dev edition and existing apps as the URL Parameter widget above. The position configs are irrelevant since this widget positions itself.

Since this widget manages the base map independent of the web map, it requires you to [set the transparency for the base map layer in your web map to 100%](https://support.esri.com/en/technical-article/000012413) so that it is invisible. This feels like a bit of a hack but would require significant changes to the parent widget for it to work otherwise.

#### Configuration
This widget takes the same configuration parameters as the [constructor for the parent LayerSelector widget](https://github.com/agrc-widgets/layer-selector/blob/8835bafaeaefb71ee1fb3d10a7c4bcb15e87b38b/LayerSelector.js#L160-L175).

Examples of loading different layers can be found in the [layer-selector tests](https://github.com/agrc-widgets/layer-selector/tree/v1.1.2/tests).

To configure an imagery layer to be black and white you must use the following config:
```json
{
  "id": "Imagery_BW",
  "Factory": "WebTiledLayer",
  "url": "https://discover.agrc.utah.gov/login/path/your-quad-word-here/tiles/utah/${level}/${col}/${row}"
}
```
Remember to put your quad word in the URL. Also note that the id must note be changed.

### WFRC Filter
This is a in-panel widget that contains controls for toggling and filtering layers as well as legend swatches.

Here is an [spreadsheet](https://docs.google.com/spreadsheets/d/1CaMtQzCAKHTyewZBNyw0S4xqu7_5r0WxPgUzVPSpq0o/edit#gid=0) (managed by WFRC) that shows the relationship between the controls and layers in the [web map](https://wfrc.maps.arcgis.com/home/webmap/viewer.html?webmap=0ee014ea3aea4231b47e8da289b8acc0).

#### Configuration
`language` - `[string]`  
The language that the strings in the widget should be displayed as. Possible values are `english` and `spanish`. Defaults to `english`.

`strings` - `[object]`  
The language-specific strings to be used in the widget.

`layerNames` - `[object]`  
An object that stores the names of the layers as they are defined in the web map.

`phases` - `[object]`  
An object where the keys are the layer keys from `layerNames` above and the values are an array defining the definition query for displaying different phases for the layer. The format for the array is:
```
[<FieldName>, <phase 1 value>, <phase 2 value>, <phase 3 value>, <unfunded value>]
```
For example, a definition query for phases 1 and 4 for this array:
```js
["FCPhase", 1, 2, 3, 4]
```
would be...
```sql
FCPhase IN (1, 4)
```

`colors` - `[object]`  
An object defining most of the colors used in the legend controls.

### Sherlock
This widget allows the user to quickly search for geographic features. It is a wrapper around the [AGRC Sherlock widget](https://github.com/agrc-widgets/sherlock).

#### Configuration
`serviceUrl`(required) - `[string]`  
The URL to the service that you would like to search features on.

`searchField`(required) - `[string]`  
The name of the field that you would like the search to be applied to.

`placeHolder` - `[string]`  
The place holder text that shows up in the text box before a user starts typing.

You may place any other config that Sherlock uses in the config file.

#### Installation
This widget is an on-screen widget so it requires the same additional steps to add it to WAB dev edition and existing apps as the URL Parameter widget above.

In addition to the URL Parameter set up steps above, this widget also requires the following steps:

##### WAB Developer Edition
1. Add spinjs and sherlock as packages in `/client/builder/init.js` to `dojoConfig.packages` within the `else` block.
  ```js
  } else {
    dojoConfig.baseUrl = window.apiUrl + 'dojo';
    dojoConfig.packages = [{
      name: "builder",
      location: window.path + "builder"
    }, {
      name: "jimu",
      location: window.path + 'stemapp/jimu.js'
    }, {
      name: "libs",
      location: window.path + "stemapp/libs"
    }, {
      name: "dynamic-modules",
      location: window.path + "stemapp/dynamic-modules"
    }, {
      name: "for3dSetting",
      location: window.path + "builder/for3dSetting"
    }, {
      name: 'spinjs',
      location: window.path + 'widgets/Sherlock/spinjs'
    }, {
      name: 'sherlock',
      location: window.path + 'widgets/Sherlock/sherlock'
    }];
  ```

##### Existing App
1. Make the same change as above to `/init.js`.


## Development
[Esri Yeoman Generators](https://github.com/Esri/generator-esri-appbuilder-js)  
[Wrapped Widget Example](https://github.com/gbochenek/wab-test-example)

### Getting started
1. Start Web App Builder: `cd ~/WebAppBuilderForArcGIS/server/ && node server.js`
1. Create a test application in WAB and update the path to it in `Gruntfile.js`, if needed.
1. Start local grunt (from project root): `grunt`
1. Go to [http://<your machine name>:3344/webappbuilder/](http://<your machine name>:3344/webappbuilder/)

Any changes you make to widget files are automatically copied to your web app builder installation and the test application located at [http://<your machine name>:3344/webappbuilder/apps/2/](http://<your machine name>:3344/webappbuilder/apps/2/) (this is configurable in `Gruntfile.js`).

### Cutting a new release
1. `grunt release:<bumpType>`
1. Go to https://github.com/agrc/wfrc-wab-widgets/releases and finalize the newly created draft release.
  - Remember to attach the widget zip files in the root of the project as binaries.
