// Current options
var options = {};

// Generated CSS
var xRayCss = '';

// Demo ID
var demoSelector = '#demo';

// Get elements
var form         = document.getElementById('options-form'),
    inputs       = form.getElementsByTagName('input'),
    textInputs   = form.querySelectorAll('input[type=text]');
    statusMsg    = document.getElementById('status');

// Timeout for hiding status
var statusTimeout = null;

// Load the options & init
loadOptions( init );

// Initialize the options page
function init( loadedOptions ) {
  console.log('Initializing DOM X-Ray options...');
  options = loadedOptions;
  updateInputs();
  updateDemo();
  addEventHandlers();
  console.log('DOM X-Ray options Initialized!');
}

// Update the input values
function updateInputs() {
  console.log('Updating inputs...');
  for ( var i = 0; i < inputs.length; i++ ) {
    var input = inputs[i];
    setValue( input );
    updateLabel( input );
  }
}

// Update the demo styles
function updateDemo() {
  console.log('Updating demo...');

  // clone options object so we can override root-selector for the demo
  var demoOptions = JSON.parse( JSON.stringify( options ) );
  demoOptions['root-selector'] = demoSelector;
  xRayCss = generateCss( demoOptions );

  injectStyles( demoOptions['style-tag-id'], xRayCss );
}

// Add the event handlers
function addEventHandlers() {
  console.log('Adding event handlers...');

  // Input change handlers
  for ( var i = 0; i < inputs.length; i++ ) {
    var input = inputs[i];
    input.onchange = onInputChange;

    // Add autoselect if it's a text input
    if ( input.type === 'text' ) {
      input.onfocus = onInputFocus;
      input.onblur = onInputBlur;
      input.onmouseup = function( e ) { e.preventDefault(); };
    }
  }

  // On form submit & reset
  form.onsubmit = onSave;
  form.onreset = onReset;
}

// When an input value changes
function onInputChange() {
  var input = this;
  var key = input.id;
  var value = getValue( input );
  options[key] = value;
  updateLabel( input );
  updateDemo();
}

// When an text input gets focus & blurs
var focused = null;
function onInputFocus() {
  if ( focused === this ) return;
  focused = this;
  setTimeout( function () { focused.select(); }, 50 );
}
function onInputBlur() {
  if ( focused === this ) focused = null;
  this.value = this.value.trim();
}

// When the save button is clicked
function onSave( e ) {
  e.preventDefault();
  saveOptions( options,
    function() {
      updateStatus( MSG_SUCCESS, 'success' );
    },
    function() {
      updateStatus( MSG_ERROR, 'error' );
    }
  );
}

// When the reset button is clicked
function onReset( e ) {
  e.preventDefault();
  options = JSON.parse( JSON.stringify( DEFAULTS ) );
  updateInputs();
  updateDemo();

  saveOptions( options,
    function() {
      updateStatus( MSG_RESET, 'success' );
    },
    function() {
      updateStatus( MSG_ERROR, 'error' );
    }
  );
}

// Display a status message
function updateStatus( msg, state ) {
  statusMsg.textContent = msg;
  statusMsg.classList.remove('hidden');
  if ( state ) statusMsg.classList.add( state );
  clearTimeout( statusTimeout );
  statusTimeout = setTimeout(function() {
    statusMsg.classList.add('hidden');
  }, MSG_TIMOUT );
}

// Input helper: set value
function setValue( input ) {
  var key = input.id;
  if ( input.type === 'checkbox' ) {
    input.checked = options[key] ? true : false;
  }
  else {
    input.value = options[key];
  }
}

// Input helper: get value
function getValue( input ) {
  if ( input.type === 'checkbox' ) {
    return input.checked ? true : false;
  }
  if ( input.type === 'range' ) {
    return parseFloat( input.value );
  }
  if ( input.id === 'style-tag-id' && input.value.indexOf('#') === 0 ) {
    console.log( input.value.split('#')[1].trim() )
    return input.value.split('#')[1].trim();
  }
  return input.value.trim();
}

// Update labels for color selector inputs
function updateLabel( input ) {
  if ( input.type === 'color' || input.type === 'range' ) {
    var id = input.id;
    var value = input.value;
    var labelVal = document.querySelector( 'label[for=' + id + '] .value' );
    if ( input.type === 'range' ) value = parseInt( value * 100 ) + '%';
    labelVal.textContent = value;
  }
  else if ( input.type === 'checkbox' && input.parentNode.nodeName.toLowerCase() === 'legend' ) {
    var fieldset = input.parentNode.parentNode;
    if ( input.checked ) fieldset.classList.add( 'enabled' );
    else fieldset.classList.remove( 'enabled' );
  }
}

// function isColorCheckbox