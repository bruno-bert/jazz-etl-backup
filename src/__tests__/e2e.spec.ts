import { PipelineRunner } from "../core/PipelineRunner";
import { IsUserConfig } from "../types";
import { readFile } from "fs";

const isJSON = (str: string) => {
  try {
    const json = JSON.parse(str);
    if (Object.prototype.toString.call(json).slice(8, -1) !== "Object") {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
};

describe("End to End test for pipeline that gets a xml file and converts into json file", () => {
  beforeAll(() => {
    const configInfo: IsUserConfig = { configFile: "./e2e-pack-config-1.js" };
    const runner = new PipelineRunner(configInfo);
    runner.run();
  });

  it("Should get a the xml file from folder, convert it into json and save it into folder", () => {
    readFile("./test.json", (err, data) => {
      expect(err).toBeNull();
      let content = JSON.parse(data.toString());
      expect(isJSON(content)).toBe(true);
    });
  });
});
