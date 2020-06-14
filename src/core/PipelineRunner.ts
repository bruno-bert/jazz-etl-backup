/* eslint-disable class-methods-use-this */
/* eslint-disable guard-for-in */
/* eslint-disable array-callback-return */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
import TaskRunner from "./TaskRunner";
import options from "./options";
import config from "../config";
import { loadPluginsConfig, createConfigInfo } from "../helpers";

export class PipelineRunner {
  //private cliRunner: any;
  private runner: any;

  constructor() {
    //this.cliRunner = this.buildCLIRunner();
    this.runner = this.buildRunner();
    const { env } = config;
  }

  buildRunner() {
    /** BEGIN - selects the values of the default parameters of command line */
    const yargs = require("yargs").options(options);

    const config = createConfigInfo(
      yargs.argv.c,
      yargs.argv.l,
      yargs.argv.d,
      yargs.argv.k
    );

    /** END - creates config info object based on default parameters */

    /** BEGIN - Gets additional parameters according to the pipeline configured */
    const configs = loadPluginsConfig(config.data.pipeline);
    let finalOptions = options;

    if (configs) {
      configs.map(item => {
        if (item.inputParameters) {
          finalOptions = { ...finalOptions, ...item.inputParameters };
        }
      });
    }
    /** END - Gets additional parameters according to the pipeline configured */

    /** BEGIN - gets additional parameters from user input parameters configured in the jazzpack */
    const { userInputParameters } = config.data;
    finalOptions = { ...finalOptions, ...userInputParameters };
    /** END - gets additional parameters from user input parameters  in the jazzpack */

    /** BEGIN - reflects the parameters in cli */
    yargs.options(finalOptions);
    if (env === "development") yargs.showHelp();
    /** END - reflects the parameters in cli */

    /** BEGIN - add command line parameters dinamically */
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
    /** END - add command line parameters dinamically */

    /** BEGIN - Runs tasks on pipeline */
    return new TaskRunner(inputParams, config);
  }

  buildCLIRunner() {
    /** BEGIN - selects the values of the default parameters of command line */
    const yargs = require("yargs").options(options);

    const config = createConfigInfo(
      yargs.argv.c,
      yargs.argv.l,
      yargs.argv.d,
      yargs.argv.k
    );

    /** END - creates config info object based on default parameters */

    /** BEGIN - Gets additional parameters according to the pipeline configured */
    const configs = loadPluginsConfig(config.data.pipeline);
    let finalOptions = options;

    if (configs) {
      configs.map(item => {
        if (item.inputParameters) {
          finalOptions = { ...finalOptions, ...item.inputParameters };
        }
      });
    }
    /** END - Gets additional parameters according to the pipeline configured */

    /** BEGIN - gets additional parameters from user input parameters configured in the jazzpack */
    const { userInputParameters } = config.data;
    finalOptions = { ...finalOptions, ...userInputParameters };
    /** END - gets additional parameters from user input parameters  in the jazzpack */

    /** BEGIN - reflects the parameters in cli */
    yargs.options(finalOptions);
    if (env === "development") yargs.showHelp();
    /** END - reflects the parameters in cli */

    /** BEGIN - add command line parameters dinamically */
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
    /** END - add command line parameters dinamically */

    /** BEGIN - Runs tasks on pipeline */
    return new TaskRunner(inputParams, config);
  }

  run() {
    this.runner.run();
  }

  /** END - Runs tasks on pipeline */
}
