type EntryKind = "instruction" | "register" | "directive";

// Encode punctuation too, so TBLRD*, TBLRD*+ and TBLRD*- stay distinct.
export const entryId = (kind: EntryKind, name: string) =>
  `${kind}-${Array.from(name.toLowerCase(), (char) =>
    /[a-z0-9]/.test(char) ? char : `-${char.codePointAt(0)!.toString(16)}-`,
  ).join("")}`;

export const indexId = (kind: EntryKind, name: string) =>
  `index-${entryId(kind, name)}`;
