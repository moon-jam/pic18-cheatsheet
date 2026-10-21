import { component$ } from "@builder.io/qwik";
import entries from "../../../data/directives.json";
import Code from "./code";
import { entryId, indexId } from "./reference-links";

export default component$(
  (props: { entry: (typeof entries)[number]; printView?: boolean }) => {
    const d = props.entry;
    return (
      <>
        <h1 class="text-4xl font-bold mb-8 text-center text-primary-800">
          {d.name}
        </h1>
        <section class="mb-8">
          <table class="w-full text-lg border-collapse">
            <tbody>
              <tr class="border-b border-outline">
                <th scope="row" class="w-40 text-left p-2 align-top">
                  Syntax
                </th>
                <td class="p-2 font-mono">{d.syntax}</td>
              </tr>
              <tr class="border-b border-outline">
                <th scope="row" class="text-left p-2 align-top">
                  Assembler
                </th>
                <td class="p-2">{d.assembler}</td>
              </tr>
              {d.operands.map((operand) => (
                <tr key={operand.name} class="border-b border-outline">
                  <th scope="row" class="text-left p-2 align-top font-mono">
                    {operand.name}
                  </th>
                  <td class="p-2">{operand.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-primary-800">
            Description
          </h2>
          <p class="text-lg">{d.description}</p>
          {d.notes.map((note) => (
            <p key={note} class="mt-3">
              {note}
            </p>
          ))}
        </section>
        {d.flags.length > 0 && (
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-primary-800">
              PSECT attributes
            </h2>
            <table class="w-full text-left border-collapse">
              <tbody>
                {d.flags.map((flag) => (
                  <tr key={flag.name} class="border-b border-outline">
                    <th
                      scope="row"
                      class="w-40 p-2 align-top font-mono break-words"
                    >
                      {flag.name}
                    </th>
                    <td class="p-2">{flag.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {d.tables.map((table) => (
          <section key={table.title} class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-primary-800">
              {table.title}
            </h2>
            <table class="w-full text-left border-collapse">
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.name} class="border-b border-outline">
                    <th scope="row" class="w-48 p-2 align-top font-mono">
                      {row.name}
                    </th>
                    <td class="p-2">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-primary-800">Example</h2>
          {props.printView ? (
            <pre class="print-example">{d.example}</pre>
          ) : (
            <Code code={d.example} />
          )}
        </section>
        {d.examples.map((example) => (
          <section key={example.title} class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-primary-800">
              {example.title}
            </h2>
            {props.printView ? (
              <pre class="print-example">{example.code}</pre>
            ) : (
              <Code code={example.code} />
            )}
          </section>
        ))}
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-primary-800">
            Related directives
          </h2>
          <div class="flex flex-wrap gap-4">
            {d.related.map((name) => (
              <a
                key={name}
                class="underline"
                href={
                  props.printView
                    ? `#${entryId("directive", name)}`
                    : `../${entries.find((entry) => entry.name === name)!.slug}/`
                }
              >
                {name}
              </a>
            ))}
          </div>
        </section>
        <footer class="text-center mt-auto space-y-2">
          {d.sources.map((source) => (
            <p key={source.url}>
              <a
                class="underline"
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.title}
              </a>
            </p>
          ))}
          <p>
            <a
              class="underline"
              href={
                props.printView
                  ? `#${indexId("directive", d.name)}`
                  : "../../#directives"
              }
            >
              Back to assembler directives
            </a>
          </p>
        </footer>
      </>
    );
  },
);
