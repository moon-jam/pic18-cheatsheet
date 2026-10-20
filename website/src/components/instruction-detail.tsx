import { component$ } from "@builder.io/qwik";
import entries from "../../../data/reference.json";
import Code from "./code";
import { indexId } from "./reference-links";

export default component$(
  (props: { entry: (typeof entries)[number]; printView?: boolean }) => {
    const instr = props.entry;
    return (
      <>
        <h1 class="text-4xl font-bold mb-8 text-center text-primary-800">
          {instr.name}
        </h1>
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-primary-800">
            Instruction
          </h2>
          <table class="w-full text-primary-700 text-lg border-collapse">
            <tbody>
              <tr class="border-b border-outline">
                <th scope="row" class="w-40 text-left p-2 align-top">
                  Syntax
                </th>
                <td class="p-2 font-mono">{instr.syntax}</td>
              </tr>
              <tr class="border-b border-outline">
                <th scope="row" class="text-left p-2 align-top">
                  Operands
                </th>
                <td class="p-2">{instr.operands}</td>
              </tr>
              <tr class="border-b border-outline">
                <th scope="row" class="text-left p-2 align-top">
                  Operation
                </th>
                <td class="p-2">{instr.operation}</td>
              </tr>
              <tr class="border-b border-outline">
                <th scope="row" class="text-left p-2 align-top">
                  Status affected
                </th>
                <td class="p-2">{instr.status}</td>
              </tr>
              <tr class="border-b border-outline">
                <th scope="row" class="text-left p-2 align-top">
                  Encoding
                </th>
                <td class="p-2 font-mono break-all">{instr.encoding}</td>
              </tr>
              <tr>
                <th scope="row" class="text-left p-2 align-top">
                  Words / cycles
                </th>
                <td class="p-2">
                  {instr.words} / {instr.cycles}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-primary-800">
            Description
          </h2>
          <p class="text-primary-700 text-lg">{instr.description}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-primary-800">Example</h2>
          {props.printView ? (
            <pre class="print-example">{instr.example}</pre>
          ) : (
            <Code code={instr.example} />
          )}
        </section>

        <footer class="text-center text-primary-600 mt-auto">
          <p>
            <a
              href={`https://ww1.microchip.com/downloads/en/DeviceDoc/39631E.pdf#page=${instr.page + 2}`}
              target="_blank"
              rel="noopener noreferrer"
              class="underline"
            >
              Microchip DS39631E, p. {instr.page}
            </a>
          </p>
          <p>
            Back to{" "}
            <a
              href={
                props.printView
                  ? `#${indexId("instruction", instr.name)}`
                  : ".."
              }
              class="underline"
            >
              PIC18 ISA Cheatsheet
            </a>
          </p>
        </footer>
      </>
    );
  },
);
