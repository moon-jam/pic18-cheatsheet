import { component$ } from "@builder.io/qwik";
import type {
  DocumentHead,
  StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import pack from "../../../../data/reference.json";
import Sidebar from "~/components/sidebar";
import InstructionDetail from "~/components/instruction-detail";

export const useInstruction = routeLoader$(({ params }) => {
  const instr = pack.find((i) => i.name.toLowerCase() === params.instruction);
  if (!instr) {
    throw new Response("Not Found", { status: 404 });
  }
  return instr;
});

export default component$(() => {
  const instr = useInstruction();

  return (
    <div class="flex flex-row h-screen w-screen md:static relative">
      <Sidebar
        class="shrink-0 h-full absolute md:static"
        selectedCategory={instr.value.category}
        selectedEntry={instr.value.name}
      />
      <div class="min-w-0 grow-1 h-full bg-chat-bg flex justify-center">
        <div class="p-8 w-full max-w-5xl bg-primary-50 h-screen flex flex-col overflow-y-auto nobar">
          <InstructionDetail entry={instr.value} />
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
