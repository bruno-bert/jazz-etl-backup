export type FeatureFlagsType = {
  detachPluginOnPackage: boolean;
  detachFunctionOnPackage: boolean;
  detachJazzPack: boolean;
  allowOvewriteExecute: boolean;
};

export type CoreConfigurationType = {
  env: string;
  defaultKey: string;
  logStrategy: IsLogger;
  moduleLoadStrategy: ILoadModuleStrategy;
  featureFlags: FeatureFlagsType;
};

export interface IObservable {
  onError(err: string): void;
  onSuccess(info: string): void;
  notify(data: any): void;
  subscribe(observer: IObservable): void;
}

export interface IsLogger {
  log(message: string, file?: string): void;
  error(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  setDebugMode(debudMode: boolean): void;
}

export interface IsTaskRunner {
  run(): Promise<void>;
  createPipeline(taskParameters: any, config: any): IsPipeline;
}

export interface IsRunner {
  buildRunner(): IsTaskRunner;
  run(): void;
}

/** TODO - not in use */
export enum logStrategy {
  TO_CONSOLE = "toConsole",
  CONSOLE_WITHDATE = "consoleWithDate",
  FILELOGGER = "file",
  NONE = "none"
}

export interface IsPlugin {
  name: string;
  pipeline: string[] | null;
  tasks: [] | null;
}

export interface PluginTask {
  id: string;
  description?: string;
  class: string;
  params?: string[];
  ovewritables?: string[];
}

export interface InputParameter {
  name: string;
  alias: string;
  describe: string;
  demandOption: boolean;
  default: string;
}

export interface PluginConfiguration {
  name: string;
  pipeline: PluginTask[];
  inputParameters?: InputParameter[];
}

export interface PipelineConfiguration {
  userInputParameters?: {};
  pipeline: string[];
  plugins: IsPlugin[];
}

export interface Configuration {
  pipelineConfiguration: PipelineConfiguration;
  logger: IsLogger;
}

/**
* This interface contains the configuration that can be informed in the moment the pipeline runner is instantiated
* @param configFile: It contains the file path of the jazz configuration file (.js file)
* @param logStrategy: [NOT IMPLEMENTED - DO NOT USE] Log Strategy: this option allows the user to set a customized 
Logger implementation (that needs to implement the interface IsLogger) (common use, for example to log the process results into a text file in File System)   
* @param debugMode: Turn on/off the debug mode - if turned on, every single message generated in the processors will be displayed to the user
* @param decryptKey: [NOT IMPLEMENTED - DO NOT USE] Decript Key: this option allows the user to inform a key to decript a configuration file that is encrypted
*/
export interface IsUserConfig {
  configFile: string;
  logStrategy: logStrategy;
  debugMode: boolean;
  decryptKey: string | null;
}

export interface ILoadModuleStrategy {
  load(name: string | Function | {}, appendPaths?: string[]): {};
}

export interface IsTask {
  id: string;
  prefix?: string;
  result: [] | {} | null;
  run(): Promise<void>;
  execute?(): void;
  preExecute?(): void;
  postExecute?(): void;
  getRawData?(): void;
  onError(err: string): void;
  getPipeline(): IsPipeline;

  /** TODO - define data types */
  onSuccess(data: any): void;
  setRawData(data: any): void;
  validateConditionsForExecution(data: any): void;
}
export interface TaskConfig {
  data: any;
  logger: any;
}
export interface Buffer {
  /** TODO */
}
export interface IExtractor {
  extract(info: {} | []): any;
}
export interface ILoader {
  load(info: {} | []): any;
}
export interface ITransformer {
  transform(info: {} | []): any;
}

export interface IsPipeline {
  items: IsTask[];
  getResult(taskName: string, prefix?: string): {} | [] | null;
  addResult(task: IsTask): IsPipeline;
  addTask(task: IsTask): IsPipeline;
}
