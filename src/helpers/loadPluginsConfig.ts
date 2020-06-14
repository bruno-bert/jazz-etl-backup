/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
import ModuleLoader from '~/ModuleLoader';
import setPluginConfigPath from './setPluginConfigPath';
import _ from 'lodash';

const loadPluginsConfig = (pipelineInfo) => {
  const configs = [];

  pipelineInfo.map((item) => {
    const [source, pluginName] = String(item).split(':');
    const pluginPath = setPluginConfigPath(source, pluginName);
    const pluginConfig = source === 'native'
      ? ModuleLoader.loadFromInternalDependency(pluginPath)
      : source === 'this'
        ? ModuleLoader.loadPlugin(pluginPath)
        : ModuleLoader.loadPluginFromPath(pluginPath);

    if (!pluginConfig) {
      const message = `loadPluginsConfig - Cannot Instantiate configuration object of plugin ${pluginName}`;
      this.logger.error(message);
      throw new Error(message);
    } else {
      configs.push(pluginConfig);
    }
  });

  return _.uniq(configs);
};

module.exports = loadPluginsConfig;
