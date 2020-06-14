/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable array-callback-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
import ModuleLoader from "./ModuleLoader";
import Pipeline from "./Pipeline";
import coreConfig from "../config";

import { loadPipelineTasks, isFunction, isNative, isThis } from "../helpers";
import { IsLogger } from "./interfaces";

class TaskRunner {
  private logger: IsLogger;

  constructor(taskParameters, config) {
    this.logger = config.logger;
    this.pipeline = this.createPipeline(taskParameters, config);
  }

  createPipeline(taskParameters, config) {
    let TaskClass = null;
    let taskInstance = null;

    Pipeline.clear();

    const pipeline = loadPipelineTasks(
      config.data.pipeline,
      config.data.plugins,
      this.logger
    );

    if (pipeline) {
      pipeline.map(item => {
        if (!item.skip || item.skip === false) {
          const source = `${item.pluginSourcePath}/${item.class}`;
          try {
            TaskClass = isNative(source)
              ? ModuleLoader.loadFromInternalDependency(item.class)
              : isThis(source)
              ? ModuleLoader.loadPlugin(source)
              : ModuleLoader.loadPluginFromPath(source);
          } catch (err) {
            this.logger.log(
              `Task informed in pipeline but not implemented: ${source}`,
              err
            );
          }

          if (TaskClass) {
            taskInstance = new TaskClass(
              item.id,
              taskParameters,
              config,
              item.description,
              item.rawDataFrom
            );

            /**  handles methods ovewrites  */
            if (coreConfig.featureFlags.allowOvewriteExecute) {
              taskInstance.preExecute = item.preExecute
                ? item.preExecute
                : taskInstance.preExecute;
              taskInstance.execute = item.execute
                ? item.execute
                : taskInstance.execute;
              taskInstance.postExecute = item.postExecute
                ? item.postExecute
                : taskInstance.postExecute;

              if (item.preExecute) {
                if (isFunction(item.preExecute)) {
                  taskInstance.preExecute = item.preExecute;
                } else
                  taskInstance.preExecute = ModuleLoader.load(item.preExecute);
              }

              if (item.execute) {
                if (isFunction(item.execute)) {
                  taskInstance.execute = item.execute;
                } else taskInstance.execute = ModuleLoader.load(item.execute);
              }

              if (item.postExecute) {
                if (isFunction(item.postExecute)) {
                  taskInstance.postExecute = item.postExecute;
                } else
                  taskInstance.postExecute = ModuleLoader.load(
                    item.postExecute
                  );
              }
            }

            if (item.getRawData) {
              if (isFunction(item.getRawData)) {
                taskInstance.getRawData = item.getRawData;
              } else
                taskInstance.getRawData = ModuleLoader.load(item.getRawData);
            }

            if (item.ovewritables) {
              item.ovewritables.map(method => {
                if (item[method]) {
                  if (isFunction(item[method]))
                    taskInstance[method] = item[method];
                  else taskInstance[method] = ModuleLoader.load(item[method]);
                }
              });
            }

            taskInstance.subscribe(this);

            Pipeline.addTask(taskInstance);
          } else {
            this.logger.warn(
              `Task named ${item.class} cannot be instantianted`
            );
          }
        } else {
          this.logger.info(`Task named ${item.id} skipped`);
        }

        return Pipeline;
      });
    }

    this.logger.info("Pipeline", Pipeline);
    return Pipeline;
  }

  async run() {
    if (this.pipeline && this.pipeline.items) {
      for (let i = 0, len = this.pipeline.items.length; i < len; i++) {
        await this.pipeline.items[i].run();
      }
    }
  }

  onError(err) {
    this.logger.error(err);
    throw new Error(err);
  }

  onSuccess(data) {
    this.logger.info("Task completed sucessfully");
  }
}

module.exports = TaskRunner;
