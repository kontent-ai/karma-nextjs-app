import { generateDeliveryModelsAsync, resolveCase } from "@kontent-ai/model-generator";

const { KONTENT_ENVIRONMENT_ID, KONTENT_MANAGEMENT_API_KEY } = process.env;

if (!KONTENT_ENVIRONMENT_ID) {
  throw new Error("KONTENT_ENVIRONMENT_ID cannot be empty!");
}

if (!KONTENT_MANAGEMENT_API_KEY) {
  throw new Error("KONTENT_MANAGEMENT_API_KEY cannot be empty!");
}

await generateDeliveryModelsAsync({
  environmentId: KONTENT_ENVIRONMENT_ID,
  managementApiKey: KONTENT_MANAGEMENT_API_KEY,
  addTimestamp: false,
  createFiles: true,
  outputDir: "./src/model",
  moduleFileExtension: "ts",
  fileResolvers: {
    taxonomy: (taxonomy) => resolveCase(taxonomy.codename, "camelCase"),
    contentType: (type) => resolveCase(type.codename, "camelCase"),
    snippet: (snippet) => resolveCase(snippet.codename, "camelCase"),
  },
  formatOptions: {
    formatter: {
      lineWidth: 120,
      indentWidth: 2,
      indentStyle: "space",
    },
    javascript: {
      formatter: {
        trailingCommas: "all",
      },
    },
  },
});
