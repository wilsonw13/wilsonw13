import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { userRegistry } from "@/types/user.types";
import { env } from "@/common/utils/envConfig";

export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>;

export function generateOpenAPIDocument(): OpenAPIDocument {
  const registry = new OpenAPIRegistry([userRegistry]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const servers = [];
  if (env.isDev) {
    servers.push({ url: `http://localhost${env.BASE_PATH}` });
  }
  if (env.isProd) {
    servers.push({ url: `https://willcontact.me${env.BASE_PATH}` });
  }

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    servers,
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
