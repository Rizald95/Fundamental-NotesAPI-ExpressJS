import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load swagger document
const swaggerDocument = YAML.load(join(__dirname, '../swagger.yaml'));

// Swagger UI options
const swaggerOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Notes API Documentation",
  customfavIcon: "/favicon.ico"
};

export { swaggerUi, swaggerDocument, swaggerOptions };