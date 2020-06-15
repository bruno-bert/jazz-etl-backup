/* eslint-disable class-methods-use-this */
/* eslint-disable guard-for-in */
/* eslint-disable array-callback-return */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
import TaskRunner from "./TaskRunner";
import DefaultInputParameters from "./DefaultInputParameters";
import CoreConfiguration from "./CoreConfiguration";
import { loadPluginsConfig } from "../helpers";
import ModuleLoader from "./ModuleLoader";
import { DefaultLogger } from "./Logger";

import {
  IsUserConfig,
  Configuration,
  PipelineConfiguration,
  PluginConfiguration,
  IsRunner,
  IsTaskRunner
} from "../types";

/** PENDING TO IMPLEMENT THE COMMAND LINE */
export class PipelineRunnerCommandLine {
  //implements IsRunner
  private runner: any;
  private userConfig: IsUserConfig;

  constructor(userConfig: IsUserConfig) {
    this.runner = this.buildRunner();
    this.userConfig = userConfig;
  }

  buildRunner() {
    //: IsTaskRunner
    /*
    const yargs = require("yargs").options(options);*/
    /*
    const config = createConfigInfo(
      yargs.argv.c,
      yargs.argv.l,
      yargs.argv.d,
      yargs.argv.k
    );


    const configs = loadPluginsConfig(config.data.pipeline);
    let finalOptions = options;

    if (configs) {
      configs.map(item => {
        if (item.inputParameters) {
          finalOptions = { ...finalOptions, ...item.inputParameters };
        }
      });
    }

    const { userInputParameters } = config.data;
    finalOptions = { ...finalOptions, ...userInputParameters };

    yargs.options(finalOptions);
    if (env === "development") yargs.showHelp();

    let parameterValue = null;
    const inputParams = {};
    let name = null;

    for (const param in finalOptions) {
      if (finalOptions.hasOwnProperty(param)) {
        name = finalOptions[param].name || param;
        parameterValue = yargs.argv[finalOptions[param].alias];
        inputParams[name] = parameterValue;
      }
    }
    return new TaskRunner([], new);
    */
  }

  run(): void {
    this.runner.run();
  }
}

export class PipelineRunner implements IsRunner {
  private runner: any;
  private userConfig: IsUserConfig;

  constructor(userConfig: IsUserConfig) {
    this.runner = this.buildRunner();
    this.userConfig = userConfig;
  }

  buildRunner(): IsTaskRunner {
    let config: Configuration = {
      pipelineConfiguration: ModuleLoader.getInstance().loadPackage(
        this.userConfig.configFile
      ) as PipelineConfiguration,

      /** TODO - determine the logger based on the logStrategy informed in the userConfig.logStrategy */
      logger: DefaultLogger.getInstance()
    };

    config.logger.setDebugMode(this.userConfig.debugMode);

    /** BEGIN - Gets additional parameters according to the pipeline configured */
    const configs: PluginConfiguration[] = loadPluginsConfig(
      config.pipelineConfiguration.pipeline
    );

    let finalParameters = DefaultInputParameters;

    if (configs) {
      configs.map(item => {
        if (item.inputParameters) {
          finalParameters = { ...finalParameters, ...item.inputParameters };
        }
      });
    }
    /** END - Gets additional parameters according to the pipeline configured */

    /** BEGIN - gets additional parameters from user input parameters configured in the jazzpack */
    const { userInputParameters } = config.pipelineConfiguration;
    finalParameters = { ...finalParameters, ...userInputParameters };
    /** END - gets additional parameters from user input parameters  in the jazzpack */

    /** BEGIN - Runs tasks on pipeline */
    return new TaskRunner(finalParameters, config);
  }

  run(): void {
    this.runner.run();
  }
}
