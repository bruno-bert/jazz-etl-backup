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
import { IsLogger, IsPipeline } from "./interfaces";

class TaskRunner {
  private logger: IsLogger;
  private pipeline: any;

  /** TODO - anys */
  constructor(taskParameters: any, config: any) {
    this.logger = config.logger;
    this.pipeline = this.createPipeline(taskParameters, config);
  }

  /** TODO - anys */
  createPipeline(taskParameters: any, config: any) {
    let TaskClass: any = null;
    let taskInstance = null;

    Pipeline.getInstance().clear();

    const pipeline = loadPipelineTasks(
      config.data.pipeline,
      config.data.plugins,
      this.logger
    );

    if (pipeline) {
      /* TODO - anys */
      pipeline.map((item: any) => {
        if (!item.skip || item.skip === false) {
          const source = `${item.pluginSourcePath}/${item.class}`;
          try {
            TaskClass = isNative(source)
              ? ModuleLoader.getInstance().loadFromInternalDependency(
                  item.class
                )
              : isThis(source)
              ? ModuleLoader.getInstance().loadPlugin(source)
              : ModuleLoader.getInstance().loadPluginFromPath(source);
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
                  taskInstance.preExecute = ModuleLoader.getInstance().load(
                    item.preExecute
                  );
              }

              if (item.execute) {
                if (isFunction(item.execute)) {
                  taskInstance.execute = item.execute;
                } else
                  taskInstance.execute = ModuleLoader.getInstance().load(
                    item.execute
                  );
              }

              if (item.postExecute) {
                if (isFunction(item.postExecute)) {
                  taskInstance.postExecute = item.postExecute;
                } else
                  taskInstance.postExecute = ModuleLoader.getInstance().load(
                    item.postExecute
                  );
              }
            }

            if (item.getRawData) {
              if (isFunction(item.getRawData)) {
                taskInstance.getRawData = item.getRawData;
              } else
                taskInstance.getRawData = ModuleLoader.getInstance().load(
                  item.getRawData
                );
            }

            if (item.ovewritables) {
              /** TODO - anys */

              item.ovewritables.map((method: any) => {
                if (item[method]) {
                  if (isFunction(item[method]))
                    taskInstance[method] = item[method];
                  else
                    taskInstance[method] = ModuleLoader.getInstance().load(
                      item[method]
                    );
                }
              });
            }

            taskInstance.subscribe(this);

            Pipeline.getInstance().addTask(taskInstance);
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

    this.logger.info("Pipeline" + Pipeline.getInstance());
    return Pipeline;
  }

  async run() {
    if (this.pipeline && this.pipeline.items) {
      for (let i = 0, len = this.pipeline.items.length; i < len; i++) {
        await this.pipeline.items[i].run();
      }
    }
  }

  onError(err: string) {
    this.logger.error(err);
    throw new Error(err);
  }

  onSuccess(data: any) {
    this.logger.info("Task completed sucessfully");
  }
}

export default TaskRunner;
