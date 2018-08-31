import declare from 'dojo/_base/declare';
import BaseWidget from 'jimu/BaseWidget';

// To create a widget, you need to derive from BaseWidget.
export default declare([BaseWidget], {

  // Custom widget code goes here

  baseClass: 'project-info',

  // add additional properties here

  // methods to communication with app container:
  postCreate () {
    this.inherited(arguments);
    console.log('ProjectInfo::postCreate');
  }
  // startup() {
  //   this.inherited(arguments);
  //   console.log('ProjectInfo::startup');
  // },
  // onOpen() {
  //   console.log('ProjectInfo::onOpen');
  // },
  // onClose(){
  //   console.log('ProjectInfo::onClose');
  // },
  // onMinimize(){
  //   console.log('ProjectInfo::onMinimize');
  // },
  // onMaximize(){
  //   console.log('ProjectInfo::onMaximize');
  // },
  // onSignIn(credential){
  //   console.log('ProjectInfo::onSignIn', credential);
  // },
  // onSignOut(){
  //   console.log('ProjectInfo::onSignOut');
  // }
  // onPositionChange(){
  //   console.log('ProjectInfo::onPositionChange');
  // },
  // resize(){
  //   console.log('ProjectInfo::resize');
  // }
});
