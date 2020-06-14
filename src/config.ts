import { ModuleLoadedFromExternal } from "./core/ModuleLoader";
import { ConsoleLogger } from "./core/Logger";
export default {
  env: "production",
  defaultKey: "JazzIsAwesome",
  logStrategy: new ConsoleLogger(),
  moduleLoadStrategy: new ModuleLoadedFromExternal(),
  featureFlags: {
    detachPluginOnPackage: true,
    detachFunctionOnPackage: true,
    detachJazzPack: true,
    allowOvewriteExecute: true
  }
};
