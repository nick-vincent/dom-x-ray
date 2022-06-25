// Extension events
var XRAY_ON = "XRAY_ON",
  XRAY_OFF = "XRAY_OFF",
  UPDATE_ID = "UPDATE_ID";

// Icon paths
var ICON_ON = "img/icon-on.png",
  ICON_OFF = "img/icon-off.png";

// Options alerts
var MSG_SUCCESS = "Your changes have been saved.",
  MSG_ERROR = "Oops, there was an error saving your changes.",
  MSG_RESET = "Your settings have been reset to the defaults.",
  MSG_TIMOUT = 5000;

// Default values
var DEFAULTS = {
  "style-tag-id": "___dom-x-ray___",
  "root-selector": "html",

  "include-background": true,
  "background-color": "#70BBFF",
  "background-opacity": 0.03,

  "include-outline": true,
  "outline-color": "#FF69B4",
  "outline-opacity": 0.25,

  "include-text": true,
  "text-color": "#FF69B4",
  "text-opacity": 1.0,

  "include-border": true,
  "border-color": "#FF69B4",
  "border-opacity": 1.0,

  "include-images": true,
  "image-opacity": 0.8,

  "include-root": true,
  "include-descendants": true,
  "include-pseudo": true,
  "use-important": true,

  // Flag to save defaults to storage on first init
  "first-init": true,
};
