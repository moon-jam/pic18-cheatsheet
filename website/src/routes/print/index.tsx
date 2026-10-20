import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import instructions from "../../../../data/reference.json";
import registers from "../../../../data/registers.json";
import directives from "../../../../data/directives.json";
import CheatsheetIndex from "~/components/cheatsheet-index";
import InstructionDetail from "~/components/instruction-detail";
import RegisterDetail from "~/components/register-detail";
import DirectiveDetail from "~/components/directive-detail";
import { entryId, indexId } from "~/components/reference-links";
import "./print.css";

export default component$(() => (
  <main class="print-document">
    <nav class="print-toolbar">
      <a href="../">Back to cheatsheet</a>
      <span>
        Print / Save as PDF: Ctrl+P (Windows/Linux) or Cmd+P (Mac). Paper: A4 or
        Letter.
      </span>
    </nav>
    <CheatsheetIndex printView />
    {instructions.map((entry) => (
      <article
        class="print-entry"
        id={entryId("instruction", entry.name)}
        key={entry.name}
      >
        <a class="print-back" href={`#${indexId("instruction", entry.name)}`}>
          Back to index · {entry.name}
        </a>
        <InstructionDetail entry={entry} printView />
      </article>
    ))}
    {registers.map((entry) => (
      <article
        class="print-entry"
        id={entryId("register", entry.name)}
        key={entry.name}
      >
        <a class="print-back" href={`#${indexId("register", entry.name)}`}>
          Back to index · {entry.name}
        </a>
        <RegisterDetail entry={entry} printView />
      </article>
    ))}
    {directives.map((entry) => (
      <article
        class="print-entry"
        id={entryId("directive", entry.name)}
        key={entry.name}
      >
        <a class="print-back" href={`#${indexId("directive", entry.name)}`}>
          Back to index · {entry.name}
        </a>
        <DirectiveDetail entry={entry} printView />
      </article>
    ))}
  </main>
));

export const head: DocumentHead = {
  title: "PIC18 cheatsheet — complete reference",
  meta: [
    {
      name: "description",
      content:
        "Complete printable PIC18 instruction, register, and assembler directive reference with an internal linked index.",
    },
  ],
};
