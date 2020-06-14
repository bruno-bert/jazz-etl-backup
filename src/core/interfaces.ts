export interface IObservable {
  onError(err: string): void;
  onSuccess(err: string): void;
  notify(data: any): void;
  subscribe(observer: IObservable): void;
}

export interface ILoadModuleStrategy {
  load(name: string | Function | {}, appendPaths?: string[]): {};
}

export interface IsPlugin {
  name: string;
  pipeline: [] | null;
  tasks: [] | null;
}
export interface IsTask {
  id: string;
  prefix?: string;
  result: [] | {} | null;
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
  getResult(taskName: string, prefix?: string): {} | [] | null;
  addResult(task: IsTask): IsPipeline;
  addTask(task: IsTask): IsPipeline;
}
export interface IsLogger {
  log(message: string, file?: string): void;
  error(message: string): void;
  info(message: string): void;
  warn(message: string): void;
}
