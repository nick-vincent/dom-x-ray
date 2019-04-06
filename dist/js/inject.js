// Inject style tag
function injectStyles(styleTagId, cssStyles) {
  console.log("Injecting CSS into #" + styleTagId);
  var styleTag = document.getElementById(styleTagId);

  // if style tag doesn't exist, create & inject it
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.type = "text/css";
    styleTag.id = styleTagId;
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = cssStyles;
}

// Remove style tag
function removeStyles(styleTagId) {
  console.log("Removing CSS in #" + styleTagId);
  var styleTag = document.getElementById(styleTagId);
  if (styleTag) styleTag.remove();
}

// Update style tag ID
function updateStyleTagId(oldId, newId) {
  console.log("Updating style tag #" + oldId + " to #" + newId);
  var styleTag = document.getElementById(oldId);
  if (styleTag) styleTag.id = newId;
}
