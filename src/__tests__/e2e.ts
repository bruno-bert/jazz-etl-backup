import { PipelineRunner } from "../core/PipelineRunner";

const configInfo = new ConfigInfo({
  configFile,
  log,
  debug,
  decryptKey
});

const runner = new PipelineRunner(configInfo);
runner.run();
