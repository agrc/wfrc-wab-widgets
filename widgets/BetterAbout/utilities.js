import declare from 'dojo/_base/declare';
import _TemplatedMixin from 'dijit/_TemplatedMixin';
import _WidgetBase from 'dijit/_WidgetBase';
import Dialog from 'dijit/Dialog';
import template from 'dojo/text!./DialogContent.html';


const DialogContent = declare([_WidgetBase, _TemplatedMixin], {
  templateString: template
});

export default {
  dialogitizeImages(containerNode) {
    console.log('BetterAbout/utilities:dialogitizeImages', arguments);

    const getShowDialogFunction = (url) => {
      return () => {
        const dialog = new Dialog({
          closable: true,
          content: new DialogContent({
            url,
            closeDialog: () => dialog.destroy()
          }),
          draggable: false,
          baseClass: 'better-about-dialog',
          onShow: () => {
            // give the underlay time to be built
            window.setTimeout(() => {
              document.getElementById(`${dialog.id}_underlay`).addEventListener('click', () => {
                dialog.destroy();
              });
            });
          }
        });

        dialog.show();
      };
    };

    Array.from(containerNode.getElementsByTagName('img')).forEach(img => {
      img.addEventListener('click', getShowDialogFunction(img.src));
    });
  }
};
