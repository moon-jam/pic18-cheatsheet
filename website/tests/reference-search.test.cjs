const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const dist = path.resolve(__dirname, '../dist');
const directives = require('../../data/directives.json');
const total = require('../../data/reference.json').length +
  require('../../data/registers.json').length + directives.length;

function load(route = '/') {
  const html = fs.readFileSync(path.join(dist, route, 'index.html'), 'utf8');
  const dom = new JSDOM(html, { url: `http://localhost${route}`, runScripts: 'outside-only' });
  const scripts = dom.window.document.querySelectorAll('script');
  assert.equal(scripts.length, 1, 'purified pages retain only the search enhancement');
  assert.ok(scripts[0].hasAttribute('data-reference-search'));
  const src = scripts[0].getAttribute('src');
  assert.match(src, /^\/assets\/[\w-]+-reference-search-runtime\.js$/);
  dom.window.fetch = () => { throw new Error('search must not request data'); };
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
