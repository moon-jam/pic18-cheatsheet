const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const dist = path.resolve(__dirname, '../dist');
const directives = require('../../data/directives.json');
const total = require('../../data/reference.json').length +
  require('../../data/registers.json').length + directives.length;

function load(route = '/', options = {}) {
  const url = new URL(route, 'http://localhost');
  const html = fs.readFileSync(path.join(dist, url.pathname, 'index.html'), 'utf8');
  const dom = new JSDOM(html, { url: `http://localhost${route}`, runScripts: 'outside-only' });
  const scripts = dom.window.document.querySelectorAll('script');
  assert.equal(scripts.length, 1, 'purified pages retain only the search enhancement');
  assert.ok(scripts[0].hasAttribute('data-reference-search'));
  const src = scripts[0].getAttribute('src');
  assert.match(src, /^\/assets\/[\w-]+-reference-search-runtime\.js$/);
  dom.window.fetch = () => { throw new Error('search must not request data'); };
  if (options.saved) dom.window.sessionStorage.setItem('pic18:index-view', options.saved);
  if (options.navigationType) dom.window.performance.getEntriesByType = () => [{ type: options.navigationType }];
  if (options.blockStorage) Object.defineProperty(dom.window, 'sessionStorage', { get() { throw new Error('storage blocked'); } });
  dom.window.eval(fs.readFileSync(path.join(dist, src), 'utf8'));
  return dom;
}

function query(dom, value, event = 'input') {
  const input = dom.window.document.querySelector('[data-search-input]');
  input.value = value;
  input.dispatchEvent(new dom.window.Event(event, { bubbles: true }));
  return [...dom.window.document.querySelectorAll('[data-search-item]')]
    .filter(item => !item.hidden);
}

test('homepage filters synchronously by name, address, and literal punctuation', () => {
  const dom = load();
  const doc = dom.window.document;
  assert.equal(doc.querySelector('[data-search-controls]').hidden, false);
  assert.equal(doc.querySelectorAll('[data-search-item]').length, total);
  let matches = query(dom, 'aDdLw');
  assert.equal(matches.length, 1);
  assert.equal(matches[0].querySelector('strong').textContent, 'ADDLW');
  assert.equal(doc.querySelector('[data-search-status]').textContent, '1 match');
  assert.equal(doc.querySelector('[data-search-intro]').hidden, true);
  matches = query(dom, '0xfE8');
  assert.equal(matches.length, 1);
  assert.equal(matches[0].querySelector('strong').textContent, 'WREG');
  matches = query(dom, 'TBLRD*+');
  assert.equal(matches.length, 1);
  assert.equal(matches[0].querySelector('strong').textContent, 'TBLRD*+');
  dom.window.close();
});

test('multiple terms match descriptions; no matches and Escape restore the index', () => {
  const dom = load();
  const doc = dom.window.document;
  const matches = query(dom, 'bit skip');
  assert.ok(matches.some(item => item.querySelector('strong').textContent === 'BTFSC'));
  assert.ok(matches.some(item => item.querySelector('strong').textContent === 'BTFSS'));
  assert.equal(query(dom, 'no-such-reference-zz').length, 0);
  assert.equal(doc.querySelector('[data-search-status]').textContent, 'No matches');
  assert.ok([...doc.querySelectorAll('[data-search-group]')].every(group => group.hidden));
  doc.querySelector('[data-search-input]').dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(doc.querySelectorAll('[data-search-item]:not([hidden])').length, total);
  assert.equal(doc.querySelector('[data-search-intro]').hidden, false);
  assert.equal(doc.querySelector('[data-search-status]').hidden, true);
  dom.window.close();
});

test('highlights preserve text, links, and columns through edits and clearing', () => {
  const dom = load();
  const doc = dom.window.document;
  const items = [...doc.querySelectorAll('[data-search-item]')];
  const original = items.map(item => [item.textContent, item.getAttribute('href')]);
  let matches = query(dom, 'ａｄｄ');
  const addlw = matches.find(item => item.querySelector('strong').textContent === 'ADDLW');
  assert.equal(addlw.querySelector('strong mark').textContent, 'ADD');
  assert.equal(addlw.children.length, 3, 'marks stay inside the existing columns');
  matches = query(dom, 'add dl');
  assert.equal(addlw.querySelector('strong mark').textContent, 'ADDL', 'overlapping terms merge');
  matches = query(dom, 'TBLRD*+');
  assert.equal(matches[0].querySelector('strong mark').textContent, 'TBLRD*+');
  matches = query(dom, 'bit skip');
  const btfsc = matches.find(item => item.querySelector('strong').textContent === 'BTFSC');
  assert.deepEqual([...btfsc.querySelectorAll('span mark')].map(mark => mark.textContent.toLowerCase()), ['bit', 'skip']);
  query(dom, 'no-such-reference-zz');
  assert.equal(doc.querySelectorAll('mark').length, 0, 'hidden entries lose stale marks');
  query(dom, 'ADD');
  doc.querySelector('[data-search-input]').dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(doc.querySelectorAll('mark').length, 0);
  assert.deepEqual(items.map(item => [item.textContent, item.getAttribute('href')]), original);
  dom.window.close();
});

test('sidebar highlights remain inline and do not change the selected entry', () => {
  const dom = load('/registers/status/');
  const doc = dom.window.document;
  const selected = doc.querySelector('[data-search-item][data-state="selected"]');
  const matches = query(dom, 'tus');
  const status = matches.find(item => item.textContent === 'STATUS');
  assert.equal(status, selected);
  assert.equal(status.children.length, 1);
  assert.equal(status.firstElementChild.tagName, 'SPAN');
  assert.equal(status.querySelector('span mark').textContent, 'TUS');
  assert.equal(query(dom, '#include')[0].querySelector('span mark').textContent, '#include');
  query(dom, '', 'search');
  assert.equal(doc.querySelectorAll('mark').length, 0);
  assert.equal(selected.getAttribute('data-state'), 'selected');
  dom.window.close();
});

test('sidebar filters all categories while retaining its selected accordion', () => {
  const dom = load('/registers/status/');
  const doc = dom.window.document;
  const selected = doc.querySelector('.accordion__input:checked');
  assert.ok(selected);
  const matches = query(dom, '#include');
  assert.equal(matches.length, 1);
  assert.ok(matches.some(item => item.textContent.trim() === '#include'));
  assert.ok(doc.querySelector('[data-reference-search-root]').hasAttribute('data-search-active'));
  assert.equal(selected.checked, true);
  assert.equal(query(dom, '', 'search').length, total);
  assert.equal(doc.querySelector('[data-reference-search-root]').hasAttribute('data-search-active'), false);
  assert.equal(selected.checked, true);
  dom.window.close();
});

test('complete print reference is unfiltered and contains every directive', () => {
  const dom = load('/print/');
  const doc = dom.window.document;
  assert.equal(doc.querySelector('[data-reference-search-root]'), null);
  assert.equal(doc.querySelectorAll('.print-entry').length, total);
  assert.equal(doc.querySelectorAll('.print-entry[hidden]').length, 0);
  dom.window.close();
});

test('leaving the index saves the view; a homepage visit restores search and scroll', () => {
  const dom = load();
  const root = dom.window.document.querySelector('[data-reference-search-root]');
  const matches = query(dom, 'branch');
  root.scrollTop = 420;
  dom.window.document.addEventListener('click', event => event.preventDefault());
  matches[0].dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
  const saved = dom.window.sessionStorage.getItem('pic18:index-view');
  assert.equal(JSON.parse(saved).scroll, 420);
  assert.equal(JSON.parse(saved).query, 'branch');
  const returned = load('/', { saved });
  assert.equal(returned.window.document.querySelector('[data-search-input]').value, 'branch');
  assert.equal(returned.window.document.querySelector('[data-reference-search-root]').scrollTop, 420);
  assert.ok(returned.window.document.querySelector('[data-search-item] mark'));
  assert.equal(returned.window.document.querySelectorAll('[data-search-item]:not([hidden])').length, matches.length);
  dom.window.close(); returned.window.close();
});

test('Back restores a view with a fragment while fresh section links retain their target', () => {
  const saved = JSON.stringify({ path: '/', query: 'ADDLW', scroll: 150 });
  const fresh = load('/#registers', { saved });
  assert.equal(fresh.window.document.querySelector('[data-search-input]').value, '');
  const back = load('/#registers', { saved, navigationType: 'back_forward' });
  assert.equal(back.window.document.querySelector('[data-search-input]').value, 'ADDLW');
  assert.equal(back.window.document.querySelector('[data-reference-search-root]').scrollTop, 150);
  const cached = load('/#registers', { saved });
  cached.window.dispatchEvent(new cached.window.PageTransitionEvent('pageshow', { persisted: true }));
  assert.equal(cached.window.document.querySelector('[data-search-input]').value, 'ADDLW');
  fresh.window.close(); back.window.close(); cached.window.close();
});

test('pagehide saves an unfiltered position and section navigation clears hidden results', () => {
  const dom = load();
  const doc = dom.window.document;
  const root = doc.querySelector('[data-reference-search-root]');
  root.scrollTop = 1600;
  dom.window.dispatchEvent(new dom.window.PageTransitionEvent('pagehide'));
  assert.equal(JSON.parse(dom.window.sessionStorage.getItem('pic18:index-view')).scroll, 1600);
  query(dom, 'ADDLW');
  doc.addEventListener('click', event => event.preventDefault());
  doc.querySelector('nav a[href="#registers"]').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
  assert.equal(doc.querySelector('[data-search-input]').value, '');
  assert.equal(doc.getElementById('registers').hidden, false);
  dom.window.close();
});

test('bad or unavailable storage cannot break search; detail sidebars do not inherit the home filter', () => {
  for (const options of [{ saved: 'not JSON' }, { saved: JSON.stringify({ path: '/', query: 5, scroll: -1 }) }, { blockStorage: true }]) {
    const dom = load('/', options);
    assert.equal(query(dom, 'ADDLW').length, 1);
    dom.window.close();
  }
  const dom = load('/registers/status/', { saved: JSON.stringify({ path: '/', query: 'ADDLW', scroll: 150 }) });
  assert.equal(dom.window.document.querySelector('[data-search-input]').value, '');
  assert.equal(dom.window.document.querySelectorAll('[data-search-item]:not([hidden])').length, total);
  dom.window.close();
});
