import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import instructions from "../../../data/reference.json";
import { LuStar, LuTerminal } from "@qwikest/icons/lucide";

export default component$(() => {
  const grouped = instructions.reduce(
    (acc: Record<string, typeof instructions>, instr) => {
      if (!acc[instr.category]) {
        acc[instr.category] = [];
      }
      acc[instr.category].push(instr);
      return acc;
    },
    {},
  );

  return (
    <div class="min-w-0 grow-1 h-screen w-screen bg-chat-bg flex justify-center py-4 overflow-y-auto text-text">
      <div class="max-w-6xl w-full space-y-8 p-4">
        <div class="rounded-lg border border-outline p-3 text-sm leading-6">
          <h2 class="font-semibold mb-2">Operand guide</h2>
          <table class="w-full text-left">
            <tbody>
              <tr><th scope="row" class="w-24 align-top pr-4 font-mono">f</th><td>8-bit file address; File Select Register (FSR) selector in LFSR</td></tr>
              <tr><th scope="row" class="align-top pr-4 font-mono">b</th><td>Bit number, 0–7</td></tr>
              <tr><th scope="row" class="align-top pr-4 font-mono">d</th><td>Destination: 0 = Working Register (WREG), 1 = f</td></tr>
              <tr><th scope="row" class="align-top pr-4 font-mono">a</th><td>Memory access: 0 = Access Bank, 1 = bank selected by Bank Select Register (BSR)</td></tr>
              <tr><th scope="row" class="align-top pr-4 font-mono">k</th><td>Literal value or label; range depends on the instruction</td></tr>
              <tr><th scope="row" class="align-top pr-4 font-mono">n</th><td>How far to jump from the next instruction, in 2-byte steps. For example, n = 2 moves 4 bytes forward.</td></tr>
              <tr><th scope="row" class="align-top pr-4 font-mono">s</th><td>0 = no automatic save/restore; 1 = CALL saves the working value, status flags, and selected bank, while RETURN/RETFIE restores them.</td></tr>
              <tr><th scope="row" class="align-top pr-4 font-mono whitespace-nowrap">fs / fd</th><td>12-bit source / destination file address</td></tr>
            </tbody>
          </table>
          <p class="mt-2">Braces mark optional operands.</p>
          <div class="flex flex-wrap gap-4 mt-1">
            <a href="https://ww1.microchip.com/downloads/en/DeviceDoc/39631E.pdf#page=270" target="_blank" rel="noopener noreferrer" class="underline">Field definitions: Table 24-1</a>
            <a href="https://ww1.microchip.com/downloads/en/DeviceDoc/39631E.pdf#page=272" target="_blank" rel="noopener noreferrer" class="underline">Instruction list: Table 24-2</a>
          </div>
        </div>
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h2 class="text-2xl font-bold mb-4 border-b border-outline pb-2 select-none flex justify-start items-center">
              <LuTerminal class="h-7 w-7 inline-block -mb-1 mr-3" />
              {category}
            </h2>
            <div class="relative">
              <div class="hidden md:block absolute inset-y-0 left-1/2 w-px bg-outline opacity-50" aria-hidden="true" />
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-3 text-sm font-semibold text-primary-700">
                {[0, 1].map((column) => (
                  <div key={column} class={`${column === 1 ? "hidden md:grid" : "grid"} grid-cols-[minmax(0,25%)_minmax(0,30%)_minmax(0,1fr)] md:grid-cols-[minmax(0,18%)_minmax(0,27%)_minmax(0,1fr)] gap-x-2 px-2`}>
                    <span>Instruction</span><span>Operands</span><span>Description</span>
                  </div>
                ))}
              </div>
              <div class="text-md grid grid-cols-1 md:grid-cols-2 gap-y-0.5 gap-x-3">
                {items.map((item, index) => (
                  <a
                    href={`./${encodeURIComponent(item.name.toLowerCase())}`}
                    key={index}
                    class="text-text duration-150 not-disabled:hover:bg-primary not-disabled:hover:text-text-hover focus:ring-4 focus:ring-outline focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 rounded-lg p-2 grid grid-cols-[minmax(0,25%)_minmax(0,30%)_minmax(0,1fr)] md:grid-cols-[minmax(0,18%)_minmax(0,27%)_minmax(0,1fr)] gap-x-2"
                  >
                    <strong>{item.name}</strong>
                    <code class="min-w-0 break-words">{item.syntax.slice(item.name.length).trim() || "—"}</code>
                    <span>{item.short}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))}
        <div class="flex justify-center">
          <a
            href="https://github.com/Eason0729/pic18-cheatsheet"
            target="_blank"
            class="text-text duration-150 not-disabled:hover:bg-primary not-disabled:hover:text-text-hover focus:ring-4 focus:ring-outline focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 rounded-lg p-2 font-semibold text-lg px-8"
          >
            <LuStar class="inline-block h-6 w-6 mr-2" />
            Star on github
          </a>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "PIC18 ISA Cheatsheet",
  meta: [
    {
      name: "description",
      content:
        "Quick reference for PIC18 microcontroller Instruction Set Architecture (ISA) instructions, opcodes, and formats.",
    },
  ],
};
