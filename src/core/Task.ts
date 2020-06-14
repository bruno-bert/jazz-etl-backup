/* eslint-disable import/no-dynamic-require */
/* eslint-disable class-methods-use-this */

import Observable from "./Observable";
import ModuleLoader from "./ModuleLoader";
import { IsTask, TaskConfig, IsPipeline, IsLogger } from "./interfaces";

export class Task extends Observable implements IsTask {
  public moduleLoader: ModuleLoader;
  public rawData: any;
  public id: string;
  public description: string;
  public taskConfig: TaskConfig;
  public rawDataFrom: any;
  public params: [] | {};
  public logger: IsLogger;
  public pipeline: IsPipeline;
  public result: [];

  constructor(
    id: string,
    params: [] | {},
    config: TaskConfig,
    description: string = "",
    rawDataFrom: any = null
  ) {
    super();
    this.moduleLoader = ModuleLoader.getInstance();
    this.pipeline = require("./Pipeline");
    this.id = id;
    this.description = description;
    this.taskConfig = config.data;
    this.logger = config.logger;
    this.rawDataFrom = rawDataFrom;
    this.params = params;
    this.result = [];

    Task.validateConfiguration(config);

    this.rawData = null;
  }

  setRawData(data: any) {
    this.logger.log("Setting up raw data");
    this.rawData = data;
  }

  validateConditionsForExecution(data: any) {
    return true;
  }

  onError(err: string) {
    this.logger.error(`Task ${this.id} generared error: ${err}`);
    super.onError(err);
  }

  onSuccess(data: any) {
    this.logger.log(`Task ${this.id} completed successfully`);
    super.onSuccess(data);
  }

  getPipeline() {
    return this.pipeline;
  }

  getRawData() {
    /** This function gets raw data that usually are results from other previous tasks in the pipeline
     * This function will always need to be overwritten by task class in plugin implementation
     */

    const data = this.rawDataFrom
      ? this.getPipeline().getResult(this.rawDataFrom)
      : null;

    if (!data) {
      this.logger.log("No data provided");
    }
    return data;
  }

  static isFunction(object: {} | Function) {
    return typeof object === "function";
  }

  getFunction(object: {} | Function) {
    if (Task.isFunction(object)) {
      return object;
    }
    return this.moduleLoader.loadFunction(object);
  }

  static validateConfiguration(config: TaskConfig) {
    if (!config) {
      throw new TypeError("Configuration object is required");
    }
  }

  async run() {
    this.logger.log(`Starting task ${this.id}`);
    this.save(await this.preExecute(), "pre");
    this.save(await this.execute());
    this.save(await this.postExecute(), "post");
    this.logger.log(`Ending task ${this.id}`);
  }

  save(data: any, prefix?: string) {
    if (data) {
      this.getPipeline().addResult({
        ...this,
        prefix,
        result: data
      });
    }
  }

  preExecute() {
    return null;
  }

  execute() {
    return null;
  }

  postExecute() {
    return null;
  }
}