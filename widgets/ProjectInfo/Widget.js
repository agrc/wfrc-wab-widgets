import declare from 'dojo/_base/declare';
import BaseWidget from 'jimu/BaseWidget';
import ProjectInfo from './ProjectInfo/ProjectInfo';


export default declare([BaseWidget], {

  baseClass: 'project-info',
  mainWidget: null,

  postCreate() {
    this.mainWidget = new ProjectInfo({
      config: this.config
    }, this.widgetContainer);
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
