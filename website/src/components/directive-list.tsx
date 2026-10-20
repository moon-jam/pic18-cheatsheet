import { component$ } from "@builder.io/qwik";
import directives from "../../../data/directives.json";

import { entryId, indexId } from "./reference-links";

export default component$((props: { printView?: boolean }) => (
  <section id="directives" class="space-y-4">
    <h2 class="text-2xl font-bold border-b border-outline pb-2">Assembler Directives</h2>
    <p>Directives tell the assembler how to organize the source. Syntax here applies to the MPLAB XC8 PIC Assembler (pic-as).</p>
    <div class="grid grid-cols-[minmax(0,18%)_minmax(0,27%)_minmax(0,1fr)] gap-x-2 px-2 text-sm font-semibold">
      <span>Directive</span><span>Operands</span><span>Description</span>
    </div>
    {directives.map((directive) => (
      <a key={directive.name} id={props.printView ? indexId("directive", directive.name) : undefined} href={props.printView ? `#${entryId("directive", directive.name)}` : `./directives/${directive.name.toLowerCase()}/`} class="rounded-lg p-2 grid grid-cols-[minmax(0,18%)_minmax(0,27%)_minmax(0,1fr)] gap-x-2 hover:bg-primary focus:ring-4 focus:ring-outline focus:outline-none">
        <strong>{directive.name}</strong>
        <code class="min-w-0 break-words">{directive.syntax.slice(directive.name.length).trim()}</code>
        <span>{directive.short}</span>
      </a>
    ))}
  </section>
));
