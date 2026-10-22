import { component$ } from "@builder.io/qwik";

export default component$((props: { compact?: boolean }) => (
  <div data-search-controls hidden class={props.compact ? "mb-3" : "space-y-2"}>
    <label class="sr-only" for="reference-search">
      Search reference
    </label>
    <input
      id="reference-search"
      data-search-input
      type="search"
      autoComplete="off"
      spellcheck={false}
      placeholder={
        props.compact
          ? "Search…"
          : "Search instructions, registers, directives…"
      }
      class="w-full rounded-lg border border-outline bg-transparent px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-outline"
    />
    <p
      data-search-status
      role="status"
      aria-live="polite"
      class="text-sm mt-1"
      hidden
    />
  </div>
));
