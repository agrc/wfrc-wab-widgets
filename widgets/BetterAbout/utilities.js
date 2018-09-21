import Dialog from 'dijit/Dialog';


export default {
  dialogitizeImages(containerNode) {
    console.log('BetterAbout/utilities:dialogitizeImages', arguments);

    const getShowDialogFunction = (url) => {
      return () => {
        const dialog = new Dialog({
          content: `<img src=${url} />`,
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
