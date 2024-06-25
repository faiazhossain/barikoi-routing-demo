// utils/config.js
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const configPath = path.resolve(process.cwd(), "config.yaml");
const fileContents = fs.readFileSync(configPath, "utf8");
const config = yaml.load(fileContents);

export default config;
