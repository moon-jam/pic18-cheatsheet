import { component$ } from "@builder.io/qwik";
import {
  LuArrowLeft,
  LuArrowRight,
  LuTableProperties,
} from "@qwikest/icons/lucide";

import pack from "../../../data/reference.json";
import registers from "../../../data/registers.json";
import directives from "../../../data/directives.json";
import Button from "./ui/button";
import { Accordion } from "./ui/accordion";
import ReferenceSearch from "./reference-search";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type Entry = ArrayElement<typeof pack>;

const categories: {
  [key: string]: Entry[];
} = {};

for (const entry of pack) {
  if (!categories[entry.category]) categories[entry.category] = [entry];
  else categories[entry.category].push(entry);
}

export default component$(
  (props: {
    class?: string;
    baseHref?: string;
    selectedCategory?: string;
    selectedEntry?: string;
  }) => {
    return (
      <>
        <input
          type="checkbox"
          id="sidebar-toggle"
          class="hidden peer"
          checked
        />
        <Button
          for="sidebar-toggle"
          class="p-3 absolute top-5 left-3 bg-chat-bg peer-checked:hidden cursor-pointer"
        >
          <LuArrowRight class="w-6 h-6" />
        </Button>
        <div
          data-reference-search-root="sidebar"
          class={`bg-sidebar-bg border-outline border-r p-5 flex flex-col transition-all peer-not-checked:-ml-[100vw] w-screen md:peer-not-checked:-ml-[310px] md:w-[310px] ${props["class"]}`}
        >
          <div class="flex items-center justify-between text-lg font-semibold border-b border-outline pb-1 mb-2 items-center">
            <a href={props.baseHref || "../"} class="hover:text-primary">
              <LuTableProperties class="w-6 h-6 mx-1 inline-block" />
              PIC18 cheatsheet
            </a>
            <Button for="sidebar-toggle" class="p-3 cursor-pointer">
              <LuArrowLeft class="w-6 h-6" />
            </Button>
          </div>
          <ReferenceSearch compact />
          <div data-search-list class="space-y-1 grow overflow-y-auto nobar">
            <Accordion
              value={props.selectedCategory || null}
              entries={Object.entries(categories).map(
                ([category, entries]) => ({
                  value: category,
                  trigger: (
                    <div class="font-semibold py-2 text-lg duration-150 rounded-md hover:bg-primary px-4 select-none">
                      {category.trim().replace("Operations", "")}
                    </div>
                  ),
                  content: (
                    <>
                      {entries.map((entry: Entry) => (
                        <a
                          data-search-item={`${entry.name} ${entry.syntax} ${entry.short} ${entry.description} ${entry.category}`}
                          class="flex items-center rounded-sm text-base duration-150 hover:bg-primary p-1.5 pl-4 select-none data-[state=selected]:bg-secondary"
                          key={entry.name}
                          data-state={
                            entry.name === props.selectedEntry ? "selected" : ""
                          }
                          href={
                            (props.baseHref || "../") + encodeURIComponent(entry.name.toLowerCase())
                          }
                        >
                          <span>{entry.name}</span>
                        </a>
                      ))}
                    </>
                  ),
                }),
              )}
            />
            <Accordion
              value={props.selectedCategory || null}
              entries={Array.from(new Set(registers.map((r) => r.category))).map((category) => ({
                value: "Registers: " + category,
                trigger: <div class="font-semibold py-2 text-lg duration-150 rounded-md hover:bg-primary px-4 select-none">Registers: {category}</div>,
                content: <>{registers.filter((r) => r.category === category).map((r) => (
                  <a key={r.name} data-search-item={`${r.name} ${r.address} ${r.short} ${r.description} ${r.category}`} href={`${props.baseHref || "../"}registers/${r.name.toLowerCase()}/`} data-state={r.name === props.selectedEntry ? "selected" : ""} class="flex items-center rounded-sm text-base duration-150 hover:bg-primary p-1.5 pl-4 select-none data-[state=selected]:bg-secondary"><span>{r.name}</span></a>
                ))}</>,
              }))}
            />
            <Accordion
              value={props.selectedCategory || null}
              entries={[{
                value: "Assembler Directives",
                trigger: <div class="font-semibold py-2 text-lg duration-150 rounded-md hover:bg-primary px-4 select-none">Assembler Directives</div>,
                content: <>{directives.map((d) => <a key={d.name} data-search-item={`${d.name} ${d.syntax} ${d.short} ${d.description}`} href={`${props.baseHref || "../"}directives/${d.slug}/`} data-state={d.name === props.selectedEntry ? "selected" : ""} class="flex items-center rounded-sm text-base duration-150 hover:bg-primary p-1.5 pl-4 select-none data-[state=selected]:bg-secondary"><span>{d.name}</span></a>)}</>,
              }]}
            />
          </div>
        </div>
      </>
    );
  },
);
