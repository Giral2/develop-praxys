// Reusable Mock DOM for testing PraxisApp in pure Node.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function createMockElement(id = '', tag = 'div') {
  const classes = new Set();
  const children = [];
  const attributes = {};
  let _value = '';
  let _innerText = '';
  let _innerHTML = '';

  const el = {
    id: id,
    tagName: tag.toUpperCase(),
    style: {},
    dataset: {},
    checked: false,
    disabled: false,
    options: [],
    selectedIndex: 0,
    parentElement: null,
    get children() {
      return children;
    },
    
    get className() {
      return Array.from(classes).join(' ');
    },
    set className(val) {
      classes.clear();
      if (val) {
        val.split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
      }
    },
    classList: {
      add(...cls) { cls.forEach(c => classes.add(c)); },
      remove(...cls) { cls.forEach(c => classes.delete(c)); },
      toggle(c, force) {
        if (force === true) { classes.add(c); return true; }
        if (force === false) { classes.delete(c); return false; }
        if (classes.has(c)) { classes.delete(c); return false; }
        classes.add(c); return true;
      },
      contains(c) { return classes.has(c); }
    },
    get innerText() {
      return _innerText;
    },
    set innerText(val) {
      _innerText = String(val);
      _innerHTML = String(val);
    },
    get innerHTML() {
      return _innerHTML;
    },
    set innerHTML(val) {
      _innerHTML = String(val);
      _innerText = String(val).replace(/<[^>]+>/g, '');
      if (val === '') {
        children.length = 0;
      }
    },
    get value() {
      return _value;
    },
    set value(val) {
      _value = String(val);
    },
    appendChild(child) {
      children.push(child);
      child.parentElement = el;
      return child;
    },
    removeChild(child) {
      const idx = children.indexOf(child);
      if (idx !== -1) children.splice(idx, 1);
      return child;
    },
    setAttribute(k, v) { attributes[k] = String(v); },
    getAttribute(k) { return attributes[k] !== undefined ? attributes[k] : null; },
    removeAttribute(k) { delete attributes[k]; },
    remove() {
      if (this.parentElement && typeof this.parentElement.removeChild === 'function') {
        this.parentElement.removeChild(this);
      }
    },
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {},
    focus() {},
    blur() {},
    click() {}
  };

  return el;
}

function setupMockEnvironment() {
  const indexPath = path.join(__dirname, '..', 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  // Extract all IDs from index.html
  const idRegex = /\bid=["']([^"']+)["']/g;
  const domElements = new Map();
  let match;
  while ((match = idRegex.exec(indexHtml)) !== null) {
    const id = match[1];
    if (!domElements.has(id)) {
      domElements.set(id, createMockElement(id));
    }
  }

  // Pre-populate some inputs with default values from HTML
  const valueRegex = /id=["']([^"']+)["'][^>]*\bvalue=["']([^"']+)["']/g;
  while ((match = valueRegex.exec(indexHtml)) !== null) {
    const id = match[1];
    const val = match[2];
    if (domElements.has(id)) {
      domElements.get(id).value = val;
    }
  }

  // LocalStorage mock
  const storage = {};
  const mockLocalStorage = {
    getItem(key) { return storage[key] !== undefined ? storage[key] : null; },
    setItem(key, val) { storage[key] = String(val); },
    removeItem(key) { delete storage[key]; },
    clear() { Object.keys(storage).forEach(k => delete storage[k]); },
    _dump() { return { ...storage }; }
  };

  // Mock document
  const mockDocument = {
    getElementById(id) {
      if (!domElements.has(id)) {
        const newEl = createMockElement(id);
        domElements.set(id, newEl);
      }
      return domElements.get(id);
    },
    createElement(tag) {
      return createMockElement('', tag);
    },
    querySelectorAll(selector) {
      const results = [];
      if (selector.startsWith('.')) {
        const cls = selector.slice(1);
        for (const el of domElements.values()) {
          if (el.classList.contains(cls)) results.push(el);
        }
      } else if (selector.startsWith('#')) {
        const id = selector.slice(1);
        if (domElements.has(id)) results.push(domElements.get(id));
      }
      return results;
    },
    querySelector(selector) {
      const list = this.querySelectorAll(selector);
      return list.length > 0 ? list[0] : null;
    },
    addEventListener(event, cb) {
      if (event === 'DOMContentLoaded') {
        mockWindow._domContentLoadedCallbacks.push(cb);
      }
    },
    removeEventListener() {},
    documentElement: createMockElement('html', 'html'),
    body: createMockElement('body', 'body')
  };

  // Setup classes on workspace elements and pills
  for (const role of ['R01', 'R02', 'R03', 'R04', 'R05', 'R06', 'R07']) {
    const ws = mockDocument.getElementById(`workspace-${role}`);
    ws.classList.add('role-workspace');
    const pill = mockDocument.getElementById(`pill-${role}`);
    pill.classList.add('role-pill');
  }

  // Window mock
  const mockWindow = {
    _domContentLoadedCallbacks: [],
    document: mockDocument,
    localStorage: mockLocalStorage,
    addEventListener(event, cb) {
      if (event === 'DOMContentLoaded') {
        this._domContentLoadedCallbacks.push(cb);
      }
    },
    removeEventListener() {},
    tailwind: { config: {} },
    navigator: {
      clipboard: {
        writeText: async () => true
      }
    }
  };

  // Find the application script tag (containing class PraxisApp)
  const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
  let appJsCode = '';
  while ((match = scriptRegex.exec(indexHtml)) !== null) {
    if (match[1].includes('class PraxisApp')) {
      appJsCode = match[1];
      break;
    }
  }

  if (!appJsCode) {
    const appJsPath = path.join(__dirname, '..', 'src', '07_app.js');
    appJsCode = fs.readFileSync(appJsPath, 'utf8');
  }

  // Create clean execution context
  const context = vm.createContext({
    window: mockWindow,
    document: mockDocument,
    localStorage: mockLocalStorage,
    navigator: mockWindow.navigator,
    tailwind: mockWindow.tailwind,
    console: {
      log: () => {},
      warn: console.warn,
      error: console.error
    },
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    Date: Date,
    Math: Math,
    JSON: JSON,
    Array: Array,
    Object: Object,
    String: String,
    Number: Number,
    Boolean: Boolean,
    RegExp: RegExp,
    Set: Set,
    Map: Map
  });

  // Execute in context
  vm.runInContext(appJsCode, context);

  // Trigger DOMContentLoaded
  mockWindow._domContentLoadedCallbacks.forEach(cb => cb());

  const appInstance = mockWindow.app || (context.PraxisApp ? new context.PraxisApp() : null);
  mockWindow.app = appInstance;
  context.app = appInstance;

  return {
    window: mockWindow,
    document: mockDocument,
    localStorage: mockLocalStorage,
    context: context,
    app: appInstance
  };
}

module.exports = { setupMockEnvironment, createMockElement };
