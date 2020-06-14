/* eslint-disable import/no-dynamic-require */

import { ModuleLoader } from "./ModuleLoader";
import config from "../config";
import { IsLogger } from "./interfaces";
//import { default as decryptToString } from "./helpers";
class ConfigInfo {
  private data: any;
  /** TODO */
  private logger: IsLogger | null;

  /** TODO */
  constructor(params: any) {
    // eslint-disable-next-line import/prefer-default-export

    /* load configuration from js file */

    /** TODO */
    /*
    const encryptedFile = params.configFile;
    const key = params.decryptKey || config.defaultKey;

    if (key) {

        
      try {
        const code = decryptToString(encryptedFile, key);
        const requireFromString = require("./requireFromString");
        this.data = requireFromString(code, encryptedFile);
      } catch (e) {
        this.data = ModuleLoader.loadPackage(params.configFile);
      }
    } else {*/
    this.data = ModuleLoader.getInstance().loadPackage(params.configFile);
    //}

    /** TODO */
    /* define logger strategy */
    this.logger = null;
    //this.logger = require("./Logger");
    //this.logger.changeStrategy(params.log || "toConsole");
    //this.logger.debug = params.debug === "true";
  }
}

export default ConfigInfo;
