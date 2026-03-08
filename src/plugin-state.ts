import type { PluginPass } from "@babel/core";

import type { PluginOptions } from "./plugin-options";

export type PluginState = PluginPass & {
  skipCompilation?: boolean;

  file: {
    metadata: {
      pluginOptions: PluginOptions;
    };
  };
};

export function getPluginOptions(state: PluginState) {
  return state.file.metadata.pluginOptions;
}
