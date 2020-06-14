import { readFile, writeFile } from "fs";
import xml2js from "xml2js";

const convertXmlTojSon = (xmlPath: string) => {
  const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

  readFile(xmlPath, (err, data) => {
    parser.parseString(data, (err: {}, result: any) => {
      writeFile("./src/test.json", JSON.stringify(result, null, 2), err => {
        if (err) console.log(JSON.stringify(err, null, 2));
        else console.log("done");
      });
    });
  });
};

convertXmlTojSon("./src/test.xml");
