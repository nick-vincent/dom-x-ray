export function injectStyles(config) {
  console.log('Injecting DOM X-Ray styles...');

  const {
    styleTagId,
    rootSelector,

    includeBackground,
    backgroundColor,
    backgroundOpacity,

    includeOutline,
    outlineColor,
    outlineOpacity,

    includeText,
    textColor,
    textOpacity,

    includeBorder,
    borderColor,
    borderOpacity,

    includeImages,
    imageOpacity,

    includeRoot,
    includeDescendants,
    includePseudo,
    useImportant,
  } = config;

  const backgroundRgba = hexToRgba(backgroundColor, backgroundOpacity);
  const outlineRgba = hexToRgba(outlineColor, outlineOpacity);
  const textRgba = hexToRgba(textColor, textOpacity);
  const borderRgba = hexToRgba(borderColor, borderOpacity);
  const imageOutlineOpacity = (outlineOpacity / imageOpacity).toFixed(2);
  const imageOutlineRgba = hexToRgba(outlineColor, imageOutlineOpacity);
  const important = useImportant ? ' !important' : '';

  // Create the style tag and get the stylesheet
  document.getElementById(styleTagId)?.remove();
  const style = document.createElement('style');
  style.id = styleTagId;
  document.head.appendChild(style);
  const sheet = style.sheet;

  // Build the selectors string
  let selectors = '';
  if (includeRoot) {
    selectors += rootSelector;
    if (includePseudo) {
      selectors += `, ${rootSelector}::before, ${rootSelector}::after`;
    }
  }
  if (includeDescendants) {
    if (selectors) {
      selectors += ', ';
    }
    selectors += `${rootSelector} *`;
    if (includePseudo) {
      selectors += `, ${rootSelector} *::before, ${rootSelector} *::after`;
    }
  }

  // Build the styles string
  let styles = '';
  if (includeText) {
    styles += `color: ${textRgba}${important};`;
  }
  if (includeBorder) {
    styles += `border-color: ${borderRgba}${important};`;
  }
  if (includeBackground) {
    styles += `background-color: ${backgroundRgba}${important};`;
  }
  if (includeOutline) {
    styles += `outline: 1px solid ${outlineRgba}${important};`;
  }

  // Add the rule
  if (selectors) {
    sheet.insertRule(`${selectors} { ${styles} }`);
  }

  // Add image
  if (includeImages) {
    const selector = `${rootSelector} img`;
    let styles = `opacity: ${imageOpacity}${important};`;
    if (includeOutline) {
      styles += `outline: 1px solid ${imageOutlineRgba}${important};`;
    }
    sheet.insertRule(`${selector} { ${styles} }`);
  }

  // Hex color + opacity to rgba() CSS value
  function hexToRgba(hex, opacity) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${clamp(opacity, 0, 1)})`;
  }

  function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
  }
}

export function removeStyles(styleTagId) {
  console.log('Removing DOM X-Ray styles...');
  document.getElementById(styleTagId)?.remove();
}
