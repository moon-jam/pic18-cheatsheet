import { component$ } from "@builder.io/qwik";
import registers from "../../../data/registers.json";

import { entryId, indexId } from "./reference-links";

export default component$((props: { printView?: boolean }) => (
  <section id="registers" data-search-group class="space-y-6">
    <h2 class="text-2xl font-bold border-b border-outline pb-2">Registers</h2>
    <p>Special Function Registers (SFRs) control the processor and peripherals. Addresses below are in data memory, not program memory. Applies to PIC18F2420/2520/4420/4520.</p>
    <div class="flex flex-wrap gap-4 text-sm">
      <a class="underline" href="https://ww1.microchip.com/downloads/en/DeviceDoc/39631E.pdf#page=65" target="_blank" rel="noopener noreferrer">Addresses: Table 5-1</a>
      <a class="underline" href="https://ww1.microchip.com/downloads/en/DeviceDoc/39631E.pdf#page=66" target="_blank" rel="noopener noreferrer">Bit summary: Table 5-2</a>
      <a class="underline" href="https://ww1.microchip.com/downloads/en/DeviceDoc/39631E.pdf#page=51" target="_blank" rel="noopener noreferrer">Reset values: Table 4-4</a>
    </div>
    {Array.from(new Set(registers.map((r) => r.category))).map((category) => (
      <section key={category} data-search-group>
        <h3 class="text-xl font-semibold mb-3">{category}</h3>
        <div class="relative">
          <div aria-hidden="true" class="hidden md:block absolute inset-y-0 left-1/2 w-px bg-outline opacity-50" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-3 text-sm font-semibold">
            {[0, 1].map((column) => <div key={column} class={`${column ? "hidden md:grid" : "grid"} grid-cols-[minmax(0,23%)_minmax(0,19%)_minmax(0,1fr)] gap-x-2 px-2`}><span>Register</span><span>Address</span><span>Description</span></div>)}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-0.5">
            {registers.filter((r) => r.category === category).map((r) => (
              <a key={r.name} data-search-item={`${r.name} ${r.address} ${r.short} ${r.description} ${r.category}`} id={props.printView ? indexId("register", r.name) : undefined} href={props.printView ? `#${entryId("register", r.name)}` : `./registers/${r.name.toLowerCase()}/`} class="rounded-lg p-2 grid grid-cols-[minmax(0,23%)_minmax(0,19%)_minmax(0,1fr)] gap-x-2 hover:bg-primary focus:ring-4 focus:ring-outline focus:outline-none">
                <strong class="break-words">{r.name}</strong><code>{r.address}</code><span>{r.short}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    ))}
  </section>
));
