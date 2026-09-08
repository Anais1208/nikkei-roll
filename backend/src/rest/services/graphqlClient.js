/**
 * Este módulo es la "flecha" del diagrama: REST -> GraphQL.
 * REST nunca accede a los datos directamente; siempre pide la información
 * a GraphQL (que vive en la red interna) mediante una petición HTTP normal.
 *
 * Supuesto de diseño: en este proyecto académico, GraphQL corre en el mismo
 * computador (http://localhost:4000). En un despliegue real, esta URL
 * apuntaría a un endpoint SOLO accesible desde dentro de la VPC/red privada
 * (ver documentación de arquitectura de despliegue en FASE6-REST.md).
 */

const GRAPHQL_INTERNAL_URL =
  process.env.GRAPHQL_INTERNAL_URL || "http://localhost:4000/";

async function ejecutarGraphQL(query, variables = {}) {
  const respuesta = await fetch(GRAPHQL_INTERNAL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await respuesta.json();

  if (json.errors && json.errors.length > 0) {
    const error = new Error(json.errors.map((e) => e.message).join("; "));
    error.status = 400;
    error.expose = true;
    throw error;
  }

  return json.data;
}

module.exports = { ejecutarGraphQL };
