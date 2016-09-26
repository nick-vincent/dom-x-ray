// Current options
var options = {};

// Tabs in x-ray mode
var xRayTabs = [];

// Generated CSS
var xRayCss = '';

// Load the options & init
loadOptions( function ( loadedOptions ) {
  // If first time loading, save the defaults to storage
  if ( loadedOptions['first-init'] ) {
    console.log('First time! Saving defaults to storage...');
    loadedOptions['first-init'] = false;
    saveOptions( loadedOptions, init );
  }
  else {
    init( loadedOptions );
  }
});

// Initialize the extension
function init( loadedOptions ) {
  console.log('Initializing DOM X-Ray extension...');
  options = loadedOptions;
  xRayCss = generateCss( options );
  addEventHandlers();
  console.log('DOM X-Ray extension initialized!');
}

// Add the event handlers
function addEventHandlers() {
  console.log('Adding event handlers');

  // When the extension toggle is clicked in a tab
  chrome.browserAction.onClicked.addListener( onTabToggle );

  // When a tab loads a new page or refreshes
  chrome.tabs.onUpdated.addListener( onTabUpdated );

  // When the options are updated
  chrome.storage.onChanged.addListener( onOptionsChanged );

  // When a tab is closed
  chrome.tabs.onRemoved.addListener( onTabClosed );
}

// When the extension icon is clicked in a tab,
// toggle the extension state in that tab
function onTabToggle( tab ) {
  console.log('DOM X-ray toggled in tab ' + tab.id );
  var tabIndex = xRayTabs.indexOf( tab.id );
  if ( tabIndex >= 0 ) {
    xRayTabs.splice( tabIndex, 1 );
    updateTabState( tab.id, XRAY_OFF );
  }
  else {
    xRayTabs.unshift( tab.id );
    updateTabState( tab.id, XRAY_ON );
  }
}

// When an X-Ray tab loads a new page or refreshes,
// make sure to re-inject the CSS styles
function onTabUpdated( tabId, changeInfo, tab ) {
  var tabIndex = xRayTabs.indexOf( tabId );
  if ( tabIndex >= 0 && changeInfo.status === 'loading' ) {
    console.log('New page loaded in X-ray tab ' + tabId );
    updateTabState( tabId, XRAY_ON );
  }
}

// When an X-Ray tab is closed, remove it from xRayTabs
function onTabClosed( tabId ) {
  var tabIndex = xRayTabs.indexOf( tabId );
  if ( tabIndex >= 0 ) {
    console.log('X-ray tab closed: ' + tabId );
    xRayTabs.splice( tabIndex, 1 );
  }
}

// When the options are updated
function onOptionsChanged( changes, namespace ) {
  if ( namespace !== 'local' ) return;
  console.log('DOM X-ray options updated');

  var cssUpdated = false;

  // Loop through changes
  for ( key in changes ) {
    var change = changes[key];

    // If style tag ID changed and we have active tabs,
    // update the ID in active tabs before sending new CSS
    if ( key === 'style-tag-id' && xRayTabs.length ) {
      for ( var i = 0; i < xRayTabs.length; i++ ) {
        updateStyleId( xRayTabs[i], change.oldValue, change.newValue );
      }
    }

    // Else check if the CSS is updating
    else if ( key !== 'first-init' ) {
      cssUpdated = true;
    }

    // Update the options object
    options[ key ] = change.newValue;
  }

  // If we have new CSS to generate & inject
  if ( cssUpdated ) {
    xRayCss = generateCss( options );

    // Update any active tabs
    if ( xRayTabs.length ) {
      for ( var i = 0; i < xRayTabs.length; i++ ) {
        updateTabState( xRayTabs[i], XRAY_ON );
      }
    }
  }
}

// Update the state in a given tab
function updateTabState( tabId, event ) {
  console.log('Update tab ' + tabId + ': ' + event );
  var iconPath = event === XRAY_ON ? ICON_ON : ICON_OFF;
  chrome.browserAction.setIcon( { path: iconPath, tabId: tabId } );
  chrome.tabs.sendMessage( tabId, {
    'event'   : event,
    'xRayId'  : options['style-tag-id'],
    'xRayCss' : xRayCss
  });
}

// Update the style ID in a given tab
function updateStyleId( tabId, oldId, newId ) {
  console.log('Update style tag ID in tab ' + tabId );
  chrome.tabs.sendMessage( tabId, {
    'event' : UPDATE_ID,
    'oldId' : oldId,
    'newId' : newId
  });
}
