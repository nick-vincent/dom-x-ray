// Listen for messages sent from background.js
chrome.runtime.onMessage.addListener(
  function( request, sender, sendResponse ) {
    if ( request.event === XRAY_ON ) {
      injectStyles( request.xRayId, request.xRayCss );
    }
    else if ( request.event === XRAY_OFF ) {
      removeStyles( request.xRayId );
    }
    else if ( request.event === UPDATE_ID ) {
      updateStyleTagId( request.oldId, request.newId );
    }
  }
);
