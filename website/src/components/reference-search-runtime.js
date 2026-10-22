(() => {
  const normalize = (value) => value.normalize("NFKC").toLowerCase();

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
    root.querySelector("[data-search-controls]").hidden = false;
  }
})();
