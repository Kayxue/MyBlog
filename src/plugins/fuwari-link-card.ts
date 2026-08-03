import type { AstroIntegration } from "astro";
import type { UserOptions } from "./remark-link-card.ts";

// In Astro v7, the remarkLinkCard plugin is added directly in astro.config.mjs
// via unified({...}). This integration only handles site/base option resolution.
const fuwariLinkCard = (_options: UserOptions = {}): AstroIntegration => {
  const integration: AstroIntegration = {
    hooks: {
      "astro:config:setup": () => {
        // No-op: plugin registration is handled in astro.config.mjs directly
        // to avoid using the deprecated markdown.remarkPlugins config key.
      },
    },
    name: "fuwari-link-card",
  };

  return integration;
};

export default fuwariLinkCard;
export type { UserOptions };
