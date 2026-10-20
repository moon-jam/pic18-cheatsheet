import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { codeToHtml } from "shiki";

export default component$((props: { code: string }) => {
  const html = useSignal("");

  useTask$(async ({ track }) => {
    const code = track(() => props.code);
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
