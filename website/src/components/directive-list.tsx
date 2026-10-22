import { component$ } from "@builder.io/qwik";
import directives from "../../../data/directives.json";

import { entryId, indexId } from "./reference-links";

export default component$((props: { printView?: boolean }) => (
  <section id="directives" data-search-group class="space-y-4">
    <div class="directive-intro space-y-4">
    <h2 class="text-2xl font-bold border-b border-outline pb-2">Assembler Directives</h2>
    <p>Assembler directives organize code, data, and symbols; preprocessor directives such as #define replace source text before assembly. Syntax here applies to the MPLAB XC8 PIC Assembler (pic-as).</p>
    <div class="grid grid-cols-[minmax(0,18%)_minmax(0,27%)_minmax(0,1fr)] gap-x-2 px-2 text-sm font-semibold">
      <span>Directive</span><span>Operands</span><span>Description</span>
    </div>
    </div>
    {directives.map((directive) => (
      <a key={directive.name} data-search-item={`${directive.name} ${directive.syntax} ${directive.short} ${directive.description}`} id={props.printView ? indexId("directive", directive.name) : undefined} href={props.printView ? `#${entryId("directive", directive.name)}` : `./directives/${directive.slug}/`} class="rounded-lg p-2 grid grid-cols-[minmax(0,18%)_minmax(0,27%)_minmax(0,1fr)] gap-x-2 hover:bg-primary focus:ring-4 focus:ring-outline focus:outline-none">
        <strong>{directive.name}</strong>
        <code class="min-w-0 break-words">{directive.syntax.startsWith(directive.name) ? directive.syntax.slice(directive.name.length).trim() : directive.syntax}</code>
        <span>{directive.short}</span>
      </a>
    ))}
  </section>
));
