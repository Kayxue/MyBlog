import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginFileIcons } from "@xt0rted/expressive-code-file-icons";
import { defineEcConfig } from "astro-expressive-code";

export default defineEcConfig({
  plugins: [
    pluginLineNumbers(),
    pluginCollapsibleSections(),
    pluginFileIcons({
      iconClass: "text-4 w-5 inline mr-1 mb-1",
      titleClass: "",
    }),
  ],
});
