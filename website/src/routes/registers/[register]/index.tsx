import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead, StaticGenerateHandler } from "@builder.io/qwik-city";
import registers from "../../../../../data/registers.json";
import Sidebar from "~/components/sidebar";
import RegisterDetail from "~/components/register-detail";

export const useRegister = routeLoader$(({ params }) => {
  const register = registers.find((r) => r.name.toLowerCase() === params.register);
  if (!register) throw new Response("Not Found", { status: 404 });
  return register;
});

export default component$(() => {
  const register = useRegister();
  const r = register.value;
  return (
    <div class="flex flex-row h-screen w-screen md:static relative">
      <Sidebar class="shrink-0 h-full absolute md:static" baseHref="../../" selectedCategory={`Registers: ${r.category}`} selectedEntry={r.name} />
      <div class="min-w-0 grow-1 h-full bg-chat-bg flex justify-center">
        <div class="p-8 w-full max-w-5xl bg-primary-50 h-screen flex flex-col overflow-y-auto nobar text-primary-700">
          <RegisterDetail entry={r} />
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ params }) => ({ title: `${params.register.toUpperCase()} - PIC18 Register Cheatsheet` });
export const onStaticGenerate: StaticGenerateHandler = async () => ({ params: registers.map((r) => ({ register: r.name.toLowerCase() })) });
