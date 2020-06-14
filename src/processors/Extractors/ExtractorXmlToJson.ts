import { readFile, writeFile } from "fs";
import xml2js from "xml2js";

export default (xmlPath: string, outputFile: string) => {
  const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

  readFile(xmlPath, (err, data) => {
    parser.parseString(data, (err: {}, result: any) => {
      writeFile(outputFile, JSON.stringify(result, null, 2), err => {
        if (err) console.log(JSON.stringify(err, null, 2));
        else console.log("done");
      });
    });
  });
};
