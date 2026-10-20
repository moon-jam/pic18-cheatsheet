import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import CheatsheetIndex from "~/components/cheatsheet-index";

export default component$(() => <CheatsheetIndex />);

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
