import {
  SSMClient,
  PutParameterCommand,
  GetParametersByPathCommand,
  DeleteParameterCommand
} from "@aws-sdk/client-ssm";
import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";

/**
 * Clase encargada de leer, validar y extraer las variables del archivo .env local.
 */
class EnvFile {
  constructor(path) {
    this.path = path;
  }

  async read() {
    let source;
    try {
      // Leemos el archivo de entorno proporcionado en formato de texto UTF-8
      source = await readFile(this.path, "utf8");
    } catch (error) {
      if (error.code === "ENOENT") fail(`No file found for ${this.path}`);
      throw error;
    }

    // Parseamos el contenido del .env a un objeto con pares clave-valor
    const entries = Object.entries(parseEnv(source));

    // Validamos obligatoriamente la existencia de la variable "ENVIRONMENT"
    const environment = entries.find(([key]) => key === "NODE_ENV")?.[1];
    if (!environment) {
      fail("Environment variable missing (NODE_ENV)");
    }

    // Filtramos para asegurar que el archivo contenga variables además del ambiente
    const serviceEntries = entries.filter(([key]) => key !== "NODE_ENV");
    if (serviceEntries.length === 0) {
      fail("The environment variables are missing");
    }

    // Retorna el prefijo jerárquico de AWS (ej: /mi-proyecto/dev) y las variables
    return {
      prefix: `/system-manager-parameter-store/${environment}`,
      entries: serviceEntries,
    };
  }
}

/**
 * Clase encargada de conectarse con AWS mediante el SDK oficial, sincronizar, actualizar y eliminar variables huérfanas.
 */
class AwsUpload {
  constructor() {
    this.ssm = new SSMClient();
  }

  async upload(prefix, entries) {
    // 1. Listamos los parámetros existentes actualmente en AWS bajo ese prefijo
    const existingParameters = await this.listParametersByPath(prefix);

    // Creamos un mapa/set de las llaves locales esperadas (ej: ["DATABASE_URL", "PORT"])
    const localKeysMap = new Map(entries.map(([key, value]) => [key, value]));

    // 2. Identificamos cuáles están en AWS pero ya no en el archivo local para eliminarlos
    for (const paramName of existingParameters) {
      const variableName = paramName.replace(`${prefix}/`, "");
      if (!localKeysMap.has(variableName)) {
        console.log(`Deleting obsolete parameter: ${paramName}`);
        await this.ssm.send(
            new DeleteParameterCommand({
              Name: paramName,
            })
        );
      }
    }

    // 3. Iteramos y subimos/actualizamos cada variable actual hacia AWS Systems Manager Parameter Store
    console.log(`Uploading ${entries.length} parameters...`);

    for (const [key, value] of entries) {
      const parameterName = `${prefix}/${key}`;

      await this.ssm.send(
          new PutParameterCommand({
            Name: parameterName,          // Construye la ruta final: /mi-proyecto/dev/MI_VARIABLE
            Value: value,
            Type: "SecureString",         // Cifra el valor automáticamente en reposo utilizando AWS KMS
            Tier: "Standard",
            Overwrite: true,              // Actualiza el valor creando una nueva versión y conservando el historial
          })
      );

      console.log(`Updated: ${parameterName}`);
    }
  }

  /**
   * Método auxiliar para paginar y listar todos los parámetros bajo una ruta jerárquica
   */
  async listParametersByPath(prefix) {
    const parameters = [];
    let nextToken = undefined;

    do {
      const response = await this.ssm.send(
          new GetParametersByPathCommand({
            Path: prefix,
            Recursive: true,
            WithDecryption: false, // Solo necesitamos los nombres y rutas, no el valor desencriptado
            NextToken: nextToken,
          })
      );

      if (response.Parameters) {
        for (const param of response.Parameters) {
          if (param.Name) {
            parameters.push(param.Name);
          }
        }
      }
      nextToken = response.NextToken;
    } while (nextToken);

    return parameters;
  }
}

/**
 * Función principal que coordina la lectura del archivo por consola y ejecuta la subida.
 */
async function main() {
  // Captura el archivo pasado como argumento en la terminal (ej: node upload-env.js .env.dev)
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: node config/upload-env.js <filename>");
    process.exit(1);
  }

  const envFile = new EnvFile(file);
  const { prefix, entries } = await envFile.read();
  console.log(`Route: ${prefix}`);
  console.log(`File: ${file} (${entries.length} variables)`);

  const upload = new AwsUpload();
  await upload.upload(prefix, entries);
  console.log(`Successfully synchronized ${entries.length} parameters`);
}

// Función auxiliar para registrar errores críticos y abortar la ejecución del proceso
function fail(message) {
  console.error(message);
  process.exit(1);
}

// Ejecución global del script con captura de excepciones no controladas
main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});