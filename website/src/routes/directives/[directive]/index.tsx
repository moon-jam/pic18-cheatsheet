import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead, StaticGenerateHandler } from "@builder.io/qwik-city";
import directives from "../../../../../data/directives.json";
import Sidebar from "~/components/sidebar";
import Code from "~/components/code";

export const useDirective = routeLoader$(({ params }) => {
  const directive = directives.find((d) => d.name.toLowerCase() === params.directive);
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
          <h1 class="text-4xl font-bold mb-8 text-center text-primary-800">{d.name}</h1>
          <section class="mb-8">
            <table class="w-full text-lg border-collapse"><tbody>
              <tr class="border-b border-outline"><th scope="row" class="w-40 text-left p-2 align-top">Syntax</th><td class="p-2 font-mono">{d.syntax}</td></tr>
              <tr class="border-b border-outline"><th scope="row" class="text-left p-2 align-top">Assembler</th><td class="p-2">{d.assembler}</td></tr>
              {d.operands.map((operand) => <tr key={operand.name} class="border-b border-outline"><th scope="row" class="text-left p-2 align-top font-mono">{operand.name}</th><td class="p-2">{operand.description}</td></tr>)}
            </tbody></table>
          </section>
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-primary-800">Description</h2>
            <p class="text-lg">{d.description}</p>
            {d.notes.map((note) => <p key={note} class="mt-3">{note}</p>)}
          </section>
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-primary-800">PIC18 code-section flags</h2>
            <table class="w-full text-left border-collapse"><tbody>{d.flags.map((flag) => <tr key={flag.name} class="border-b border-outline"><th scope="row" class="p-2 align-top font-mono">{flag.name}</th><td class="p-2">{flag.description}</td></tr>)}</tbody></table>
          </section>
          <section class="mb-8"><h2 class="text-2xl font-semibold mb-4 text-primary-800">Example</h2><Code code={d.example} /></section>
          <footer class="text-center mt-auto space-y-2">
            {d.sources.map((source) => <p key={source.url}><a class="underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></p>)}
            <p><a class="underline" href="../../#directives">Back to assembler directives</a></p>
          </footer>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ params }) => ({ title: `${params.directive.toUpperCase()} - PIC18 Assembler Directives` });
export const onStaticGenerate: StaticGenerateHandler = async () => ({ params: directives.map((d) => ({ directive: d.name.toLowerCase() })) });
