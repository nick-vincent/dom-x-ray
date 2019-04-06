// Save options to Chrome storage
function saveOptions(newOptions, success, error) {
  console.log("Saving options...");

  // Try to save options
  if (chrome.storage) {
    chrome.storage.local.set(newOptions, function() {
      console.log("Options saved.");
      if (success) success(newOptions);
    });
  }

  // Otherwise, throw error
  else {
    console.log("No chrome.storage - options not saved.");
    if (error) error();
  }
}

// Load options from Chrome storage
function loadOptions(success, error) {
  console.log("Loading options...");

  // Try to load saved options
  if (chrome.storage) {
    chrome.storage.local.get(DEFAULTS, function(options) {
      console.log("Options loaded.");
      if (success) success(options);
    });
  }

  // Otherwise, try to throw error & load default options
  else {
    console.log("No chrome.storage - loading defaults instead.");
    if (error) error(DEFAULTS);
    else if (success) success(DEFAULTS);
  }
}

// Generate the debug styles
function generateCss(opts) {
  console.log("Generating CSS...");

  var textColor,
    borderColor,
    backgroundColor,
    outlineColor,
    imageOpacity,
    imageOutlineColor,
    important = "",
    selectors = "",
    styles = "",
    css = "";

  // Compute RGBA values
  textColor = rgbaCss(opts["text-color"], opts["text-opacity"]);
  borderColor = rgbaCss(opts["border-color"], opts["border-opacity"]);
  backgroundColor = rgbaCss(
    opts["background-color"],
    opts["background-opacity"]
  );
  outlineColor = rgbaCss(opts["outline-color"], opts["outline-opacity"]);

  imageOpacity = opts["image-opacity"];
  imageOutlineColor = rgbaCss(
    opts["outline-color"],
    Math.min(1, (opts["outline-opacity"] / imageOpacity).toFixed(2))
  );

  if (opts["use-important"]) important = " !important";

  // Build the selectors string
  if (opts["include-root"]) {
    selectors += opts["root-selector"];
    if (opts["include-pseudo"]) {
      selectors += ", ";
      selectors += opts["root-selector"] + ":before, ";
      selectors += opts["root-selector"] + ":after";
    }
  }
  if (opts["include-descendants"]) {
    if (selectors) selectors += ", ";
    selectors += opts["root-selector"] + " *";
    if (opts["include-pseudo"]) {
      selectors += ", ";
      selectors += opts["root-selector"] + " *:before, ";
      selectors += opts["root-selector"] + " *:after";
    }
  }

  // Build the styles string
  if (opts["include-text"]) styles += "color: " + textColor + important + "; ";
  if (opts["include-border"])
    styles += "border-color: " + borderColor + important + "; ";
  if (opts["include-background"])
    styles += "background-color: " + backgroundColor + important + "; ";
  if (opts["include-outline"])
    styles += "outline: 1px solid " + outlineColor + important + "; ";

  // Put it together
  css = selectors + " { " + styles + "} ";

  // Add image
  if (opts["include-images"]) {
    css += opts["root-selector"] + " img { ";
    css += "opacity: " + imageOpacity + important + "; ";
    if (opts["include-outline"]) {
      css += "outline: 1px solid " + imageOutlineColor + important + "; ";
    }
    css += "}";
  }

  return css;
}

// Hex color to rgb object
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

// Hex color + opacity to rgba() CSS value
function rgbaCss(hex, opacity) {
  var rgb = hexToRgb(hex);
  return rgb
    ? "rgba( " + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + opacity + " )"
    : null;
}
