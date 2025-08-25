// src/types/mammoth.d.ts
declare module "mammoth" {
  export function extractRawText(input: { arrayBuffer: ArrayBuffer }): Promise<{ value: string }>;
}
