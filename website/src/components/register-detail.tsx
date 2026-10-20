import { component$ } from "@builder.io/qwik";
import entries from "../../../data/registers.json";
import Code from "./code";
import { entryId, indexId } from "./reference-links";

export default component$(
  (props: { entry: (typeof entries)[number]; printView?: boolean }) => {
    const r = props.entry;
    return (
      <>
        <h1 class="text-4xl font-bold mb-8 text-center text-primary-800">
          {r.name}
        </h1>
        <section class="mb-8">
          <table class="w-full text-lg border-collapse">
            <tbody>
              <tr class="border-b border-outline">
                <th scope="row" class="w-40 text-left p-2 align-top">
                  Address
                </th>
                <td class="p-2">
                  <code>{r.address}</code> · Bank 15 · Access Bank
                </td>
              </tr>
              <tr class="border-b border-outline">
                <th scope="row" class="text-left p-2 align-top">
                  Devices
                </th>
                <td class="p-2">{r.devices}</td>
              </tr>
              <tr>
                <th scope="row" class="text-left p-2 align-top">
                  Type
                </th>
                <td class="p-2">
                  {r.physical
                    ? "Physical register"
                    : "Access operation; not a physical register"}
                </td>
              </tr>
            </tbody>
          </table>
          <a
            class="underline text-sm inline-block mt-3"
            href="https://ww1.microchip.com/downloads/en/DeviceDoc/39631E.pdf#page=65"
            target="_blank"
            rel="noopener noreferrer"
          >
            Address map: Table 5-1
          </a>
        </section>
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-primary-800">
            Description
          </h2>
          <p class="text-lg">{r.description}</p>
          {r.notes.map((note) => (
            <p key={note} class="mt-3">
              {note}
            </p>
          ))}
        </section>
        {r.variants.map((variant) => (
          <section key={variant.title + variant.page} class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-primary-800">
              {r.variants.length > 1 ? variant.title : "Bits"}
            </h2>
            <div class="overflow-x-auto mb-4">
              <table class="w-full min-w-[32rem] text-center border-collapse">
                <thead>
                  <tr>
                    {variant.layout.map((_, index) => (
                      <th key={index} class="border border-outline p-2">
                        Bit {7 - index}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {variant.layout.map((name, index) => (
                      <td
                        key={index}
                        class="border border-outline p-2 font-mono text-sm"
                      >
                        {name}
                      </td>
                    ))}
                  </tr>
                  {variant.access.length === 8 && (
                    <tr>
                      {variant.access.map((access, index) => (
                        <td
                          key={index}
                          class="border border-outline p-2 text-sm"
                        >
                          {access}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {variant.access.length === 8 && (
              <p class="text-sm mb-3">
                R = readable; W = writable; U = unimplemented (reads as 0).
              </p>
            )}
            <table class="register-fields w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-outline">
                  <th class="p-2">Bit</th>
                  <th class="p-2">Name</th>
                  <th class="p-2">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {variant.fields.map((field) => (
                  <tr key={field.bits} class="border-b border-outline">
                    <th scope="row" class="p-2 align-top whitespace-nowrap">
                      {field.bits}
                    </th>
                    <td class="p-2 align-top font-mono">{field.name}</td>
                    <td class="p-2">
                      <p>{field.description}</p>
                      {field.values.map((value) => (
                        <p key={value} class="mt-1">
                          {value}
                        </p>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <a
              class="underline text-sm inline-block mt-3"
              href={`https://ww1.microchip.com/downloads/en/DeviceDoc/39631E.pdf#page=${variant.page + 2}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Microchip DS39631E, p. {variant.page}
            </a>
          </section>
        ))}
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-primary-800">
            Reset values
          </h2>
          <table class="w-full text-left border-collapse">
            <tbody>
              {r.resets.map((reset) => (
                <tr key={reset.condition} class="border-b border-outline">
                  <th scope="row" class="p-2 font-normal">
                    {reset.condition}
                  </th>
                  <td class="p-2 font-mono whitespace-nowrap">{reset.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p class="mt-3 text-sm">
            x = unknown; u = unchanged; – = unimplemented (reads as 0); q =
            depends on the configuration or event.
          </p>
          <a
            class="underline text-sm"
            href="https://ww1.microchip.com/downloads/en/DeviceDoc/39631E.pdf#page=51"
            target="_blank"
            rel="noopener noreferrer"
          >
            Table 4-4 and its device-specific notes
          </a>
        </section>
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-primary-800">Example</h2>
          {props.printView ? (
            <pre class="print-example">{r.example}</pre>
          ) : (
            <Code code={r.example} />
          )}
        </section>
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-primary-800">
            Instructions in this example
          </h2>
          <div class="flex flex-wrap gap-4">
            {r.related.map((name) => (
              <a
                key={name}
                class="underline"
                href={
                  props.printView
                    ? `#${entryId("instruction", name)}`
                    : `../../${encodeURIComponent(name.toLowerCase())}/`
                }
              >
                {name}
              </a>
            ))}
          </div>
        </section>
        <footer class="text-center mt-auto">
          <a
            class="underline"
            href={
              props.printView
                ? `#${indexId("register", r.name)}`
                : "../../#registers"
            }
          >
            Back to registers
          </a>
        </footer>
      </>
    );
  },
);
