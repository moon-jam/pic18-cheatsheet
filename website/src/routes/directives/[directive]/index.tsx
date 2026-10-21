import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead, StaticGenerateHandler } from "@builder.io/qwik-city";
import directives from "../../../../../data/directives.json";
import Sidebar from "~/components/sidebar";
import DirectiveDetail from "~/components/directive-detail";

export const useDirective = routeLoader$(({ params }) => {
  const directive = directives.find((d) => d.slug === params.directive);
  if (!directive) throw new Response("Not Found", { status: 404 });
  return directive;
});

export default component$(() => {
  const directive = useDirective();
  const d = directive.value;
  return (
    <div class="flex flex-row h-screen w-screen md:static relative">
      <Sidebar class="shrink-0 h-full absolute md:static" baseHref="../../" selectedCategory="Assembler Directives" selectedEntry={d.name} />
      <div class="min-w-0 grow-1 h-full bg-chat-bg flex justify-center">
        <div class="p-8 w-full max-w-5xl bg-primary-50 h-screen flex flex-col overflow-y-auto nobar text-primary-700">
          <DirectiveDetail entry={d} />
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ params }) => ({ title: `${directives.find((d) => d.slug === params.directive)?.name || params.directive} - PIC18 Assembler Directives` });
export const onStaticGenerate: StaticGenerateHandler = async () => ({ params: directives.map((d) => ({ directive: d.slug })) });
