(() => {
  const normalize = (value) => value.normalize("NFKC").toLowerCase();
  const textParts = (element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const parts = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.data;
      const offsets = [];
      let normalized = "";
      let offset = 0;
      for (const character of text) {
        const value = normalize(character);
        for (let i = 0; i < value.length; i++)
          offsets.push([offset, offset + character.length]);
        normalized += value;
        offset += character.length;
      }
      parts.push({ node, text, normalized, offsets, inserted: [] });
    }
    return parts;
  };
  const highlight = (parts, terms) => {
    for (const part of parts) {
      for (const node of part.inserted) node.remove();
      part.inserted = [];
      part.node.data = part.text;
      const ranges = [];
      for (const term of terms) {
        let start = part.normalized.indexOf(term);
        while (start !== -1) {
          ranges.push([
            part.offsets[start][0],
            part.offsets[start + term.length - 1][1],
          ]);
          start = part.normalized.indexOf(term, start + 1);
        }
      }
      ranges.sort((a, b) => a[0] - b[0]);
      const merged = [];
      for (const range of ranges) {
        const last = merged[merged.length - 1];
        if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
        else merged.push(range);
      }
      if (!merged.length) continue;
      const fragment = document.createDocumentFragment();
      let offset = 0;
      for (const [start, end] of merged) {
        fragment.append(document.createTextNode(part.text.slice(offset, start)));
        const mark = document.createElement("mark");
        mark.className = "search-match";
        mark.textContent = part.text.slice(start, end);
        fragment.append(mark);
        offset = end;
      }
      part.inserted = Array.from(fragment.childNodes);
      part.node.before(fragment);
      part.node.data = part.text.slice(offset);
    }
  };

  for (const root of document.querySelectorAll(
    "[data-reference-search-root]",
  )) {
    const input = root.querySelector("[data-search-input]");
    const status = root.querySelector("[data-search-status]");
    const items = Array.from(
      root.querySelectorAll("[data-search-item]"),
      (element) => ({
        element,
        text: normalize(element.getAttribute("data-search-item")),
        parts: textParts(element),
      }),
    );
    const groups = Array.from(
      root.querySelectorAll("[data-search-group]"),
      (element) => ({
        element,
        items: Array.from(element.querySelectorAll("[data-search-item]")),
      }),
    );
    const introductions = root.querySelectorAll("[data-search-intro]");
    const list = root.querySelector("[data-search-list]");

    const filter = () => {
      const terms = normalize(input.value).trim().split(/\s+/).filter(Boolean);
      let count = 0;
      for (const item of items) {
        const matches = terms.every((term) => item.text.includes(term));
        item.element.hidden = !matches;
        highlight(item.parts, matches ? terms : []);
        if (matches) count++;
      }
      for (const group of groups) {
        group.element.hidden = !group.items.some((item) => !item.hidden);
      }
      for (const introduction of introductions)
        introduction.hidden = terms.length > 0;
      root.toggleAttribute("data-search-active", terms.length > 0);
      status.hidden = terms.length === 0;
      status.textContent =
        count === 0
          ? "No matches"
          : `${count} ${count === 1 ? "match" : "matches"}`;
      if (list) list.scrollTop = 0;
    };

    // All entries are already in the document: no requests, timer, or debounce.
    input.addEventListener("input", filter);
    input.addEventListener("search", filter);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        input.value = "";
        filter();
      }
    });

    if (root.getAttribute("data-reference-search-root") === "index") {
      const storageKey = "pic18:index-view";
      const indexPath = location.pathname.replace(/index\.html$/, "");
      const saveView = () => {
        try {
          sessionStorage.setItem(
            storageKey,
            JSON.stringify({
              path: indexPath,
              query: input.value,
              scroll: root.scrollTop,
            }),
          );
        } catch {
          // Search and ordinary navigation still work if storage is unavailable.
        }
      };
      const restoreView = (event) => {
        const navigation = performance.getEntriesByType?.("navigation")?.[0];
        // Explicit section links keep their intended target; Back restores the view.
        if (
          location.hash &&
          !event?.persisted &&
          navigation?.type !== "back_forward"
        )
          return;
        try {
          const saved = JSON.parse(sessionStorage.getItem(storageKey));
          if (
            saved?.path !== indexPath ||
            typeof saved.query !== "string" ||
            !Number.isFinite(saved.scroll) ||
            saved.scroll < 0
          )
            return;
          input.value = saved.query;
          filter();
          root.scrollTop = saved.scroll;
        } catch {
          // Ignore absent, malformed, or inaccessible session data.
        }
      };
      root.addEventListener("click", (event) => {
        const link = event.target.closest?.("a[href]");
        if (!link) return;
        const target = new URL(link.href, location.href);
        if (
          target.pathname === location.pathname &&
          target.hash &&
          input.value
        ) {
          input.value = "";
          filter();
        }
        saveView();
      });
      root.addEventListener("auxclick", saveView);
      window.addEventListener("pagehide", saveView);
      window.addEventListener("pageshow", restoreView);
      restoreView();
    }
    root.querySelector("[data-search-controls]").hidden = false;
  }
})();
