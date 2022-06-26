import { injectStyles } from './styles.js';
import { DEFAULTS, saveOptions, getOptions } from './config.js';

const form = document.getElementById('options-form');
const inputs = document.querySelectorAll('input');
const status = document.getElementById('status');
const statusDuration = 5000;
const demoSelector = '#demo';
const demoStyleTagId = 'dom-x-ray';

let statusTimeout;
let options = await getOptions();

bindEvents();
loadForm(options);

function loadForm(options) {
  for (const id in options) {
    setValue(id, options[id]);
  }
  updateDemo();
}

function bindEvents() {
  inputs.forEach((input) => {
    input.addEventListener('change', onInputChange);
    if (input.type === 'text') {
      input.addEventListener('focus', onInputFocus);
      input.addEventListener('blur', onInputBlur);
    }
  });
  form.addEventListener('reset', onReset);
  form.addEventListener('submit', onSubmit);
}

function onInputChange(e) {
  const input = e.target;
  const id = input.id;
  const value = getValue(id);
  options[id] = value;
  updateInput(input);
  updateDemo();
}

function onInputFocus(e) {
  const input = e.target;
  input.select();
}

function onInputBlur(e) {
  const input = e.target;
  input.value = input.value.trim();
}

function setValue(id, val) {
  const input = document.getElementById(id);
  if (input.type === 'checkbox') {
    input.checked = val;
  } else {
    input.value = val;
  }
  updateInput(input);
}

function getValue(id) {
  const input = document.getElementById(id);
  switch (input.type) {
    case 'checkbox':
      return input.checked;
    case 'range':
      return parseFloat(input.value);
    default:
      return input.value.trim();
  }
}

function updateInput(input) {
  const { id, type, value, checked } = input;
  const isToggle = input.parentNode.nodeName === 'LEGEND';

  if (['color', 'range'].includes(type)) {
    const labelVal = document.querySelector(`label[for="${id}"] .value`);
    labelVal.textContent =
      type === 'range' ? `${parseInt(value * 100)}%` : value;
  } else if (isToggle) {
    const fieldset = input.closest('fieldset');
    fieldset.classList.toggle('enabled', checked);
  }
}

function onSubmit(e) {
  e.preventDefault();
  saveOptions(options);
  updateStatus('Your changes have been saved.');
}

function onReset(e) {
  e.preventDefault();
  options = JSON.parse(JSON.stringify(DEFAULTS));
  saveOptions(options);
  loadForm(options);
  updateStatus('Your settings have been reset to the defaults.');
}

function updateDemo() {
  const demoOptions = JSON.parse(JSON.stringify(options));
  demoOptions.rootSelector = demoSelector;
  demoOptions.styleTagId = demoStyleTagId;
  injectStyles(demoOptions);
}

function updateStatus(message) {
  status.textContent = message;
  status.classList.remove('hidden');
  clearTimeout(statusTimeout);
  statusTimeout = setTimeout(() => {
    status.classList.add('hidden');
  }, statusDuration);
}
