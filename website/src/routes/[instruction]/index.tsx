import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type {
  DocumentHead,
  StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import pack from "../../../../data/reference.json";
import Sidebar from "~/components/sidebar";
import { codeToHtml } from "shiki";

export const useInstruction = routeLoader$(({ params }) => {
  const instr = pack.find((i) => i.name.toLowerCase() === params.instruction);
  if (!instr) {
    throw new Response("Not Found", { status: 404 });
  }
  return instr;
});

const Code = component$(({ code }: { code: string }) => {
  const html = useSignal("");

  useTask$(async () => {
    const [dark, light] = await Promise.all([
      codeToHtml(code, {
        lang: "asm",
        theme: "github-dark",
      }),
      codeToHtml(code, {
        lang: "asm",
        theme: "github-light",
      }),
    ]);

    html.value = `<div class="p-3 bg-code-bg rounded mb-4 overflow-auto border border-gray-300"><div class="dark:block hidden">${dark}</div><div class="dark:hidden">${light}</div></div>`;
  });

  return <div dangerouslySetInnerHTML={html.value} />;
});

export default component$(() => {
  const instr = useInstruction();

  return (
    <div class="flex flex-row h-screen w-screen md:static relative">
      <Sidebar
        class="shrink-0 h-full md:w-auto w-screen absolute md:static"
        selectedCategory={instr.value.category}
        selectedEntry={instr.value.name}
      />
      <div class="min-w-0 grow-1 h-full bg-chat-bg flex justify-center">
        <div class="p-8 w-full max-w-5xl bg-primary-50 h-screen flex flex-col overflow-y-auto nobar">
          <h1 class="text-4xl font-bold mb-8 text-center text-primary-800">
            {instr.value.name}
          </h1>
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-primary-800">
              Instruction
            </h2>
            <table class="w-full text-primary-700 text-lg border-collapse">
              <tbody>
                <tr class="border-b border-outline"><th scope="row" class="w-40 text-left p-2 align-top">Syntax</th><td class="p-2 font-mono">{instr.value.syntax}</td></tr>
                <tr class="border-b border-outline"><th scope="row" class="text-left p-2 align-top">Operands</th><td class="p-2">{instr.value.operands}</td></tr>
                <tr class="border-b border-outline"><th scope="row" class="text-left p-2 align-top">Operation</th><td class="p-2">{instr.value.operation}</td></tr>
                <tr class="border-b border-outline"><th scope="row" class="text-left p-2 align-top">Status affected</th><td class="p-2">{instr.value.status}</td></tr>
                <tr class="border-b border-outline"><th scope="row" class="text-left p-2 align-top">Encoding</th><td class="p-2 font-mono break-all">{instr.value.encoding}</td></tr>
                <tr><th scope="row" class="text-left p-2 align-top">Words / cycles</th><td class="p-2">{instr.value.words} / {instr.value.cycles}</td></tr>
              </tbody>
            </table>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-primary-800">
              Description
            </h2>
            <p class="text-primary-700 text-lg">{instr.value.description}</p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-primary-800">
              Example
            </h2>
            <Code code={instr.value.example} />
          </section>

          <footer class="text-center text-primary-600 mt-auto">
            <p><a href={`https://ww1.microchip.com/downloads/en/DeviceDoc/39631E.pdf#page=${instr.value.page + 2}`} target="_blank" rel="noopener noreferrer" class="underline">Microchip DS39631E, p. {instr.value.page}</a></p>
            <p>
              Back to{" "}
              <a href=".." class="underline">
                PIC18 ISA Cheatsheet
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ params }) => {
  const instr = pack.find((i) => i.name.toLowerCase() === params.instruction);

  return {
    title: instr
      ? `${instr.name} - PIC18 ISA Cheatsheet`
      : "Instruction - PIC18 ISA Cheatsheet",
    meta: [
      {
        name: "description",
        content: instr
          ? `${instr.name} instruction details for PIC18 microcontroller.`
          : "PIC18 instruction details.",
      },
    ],
  };
};

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: pack.map((x) => ({ instruction: x.name.toLowerCase() })),
  };
};
