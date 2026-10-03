import type { ApiModel, ApiParameter, ApiSchema, SchemaNode } from "@leemour/cli-core/codegen"

interface Field {
  name: string
  types: string[]
  required: boolean
  description: string
}
interface Type {
  name: string
  description: string[]
  fields?: Field[]
  subtypes?: string[]
}
interface Method {
  name: string
  description: string[]
  returns: string[]
  fields?: Field[]
}
export interface BotApiSource {
  version: string
  types: Record<string, Type>
  methods: Record<string, Method>
}

const secrets = new Set(["secret_token", "provider_token"])

export const adaptBotApi = (
  source: BotApiSource,
  provenance: { sourceUrl: string; sourceRevision: string },
): ApiModel => {
  const typeOf = (type: string, field?: Field): SchemaNode => {
    if (type.startsWith("Array of ")) return { type: "array", items: typeOf(type.slice(9)) }
    if (type === "String") {
      const literal = field?.description.match(/(?:must be|always) [“"']?([a-z_]+)[”"']?[.]?$/)?.[1]
      return {
        type: "string",
        ...(field?.description.includes("attach://") ? { format: "file-reference" as const } : {}),
        ...(literal ? { enum: [literal] } : {}),
      }
    }
    if (type === "InputFile") return { type: "string", format: "binary" }
    if (type === "Integer")
      return { type: "integer", ...(field && /(?:^id$|_id$)/.test(field.name) ? { format: "int64" as const } : {}) }
    if (type === "Float") return { type: "number" }
    if (type === "Boolean") return { type: "boolean" }
    if (type === "True") return { type: "boolean", enum: [true] }
    if (!source.types[type]) throw new Error(`unknown Bot API type: ${type}`)
    return { type: "ref", ref: type }
  }
  const typesOf = (types: string[], field?: Field): SchemaNode => {
    if (types.length === 0) throw new Error("Bot API type has no alternatives")
    return types.length === 1
      ? typeOf(types[0] ?? "", field)
      : { type: "union", of: types.map((type) => typeOf(type, field)) }
  }
  const fieldOf = (field: Field): SchemaNode => ({
    ...typesOf(field.types, field),
    description: field.description,
    ...(secrets.has(field.name) ? { sensitive: true } : {}),
  })
  const objectOf = (fields: Field[]): SchemaNode => ({
    type: "object",
    properties: Object.fromEntries(fields.map((field) => [field.name, fieldOf(field)])),
    required: fields.filter((field) => field.required).map((field) => field.name),
  })
  const schemas: ApiSchema[] = Object.values(source.types).map((type) => ({
    id: type.name,
    schema:
      type.name === "InputFile"
        ? typeOf("InputFile")
        : type.subtypes?.length
          ? { type: "union", of: type.subtypes.map((type) => typeOf(type)) }
          : objectOf(type.fields ?? []),
  }))
  const byId = new Map(schemas.map((schema) => [schema.id, schema.schema]))
  const sensitive = (node: SchemaNode, seen = new Set<string>()): boolean => {
    if (node.sensitive) return true
    if (node.type === "ref") {
      if (seen.has(node.ref)) return false
      const target = byId.get(node.ref)
      if (!target) throw new Error(`unknown Bot API schema: ${node.ref}`)
      return sensitive(target, new Set([...seen, node.ref]))
    }
    if (node.type === "array") return sensitive(node.items, seen)
    if (node.type === "object") return Object.values(node.properties).some((child) => sensitive(child, seen))
    if (node.type === "union" || node.type === "allOf") return node.of.some((child) => sensitive(child, seen))
    return false
  }
  return {
    source: { kind: "other", version: source.version, ...provenance },
    schemas,
    operations: Object.values(source.methods).map((method) => {
      const fields = method.fields ?? []
      const parameters: ApiParameter[] = fields.map((field) => {
        const schema = fieldOf(field)
        return {
          name: field.name,
          in: "body",
          required: field.required,
          description: field.description,
          schema,
          ...(sensitive(schema) ? { sensitive: true } : {}),
        }
      })
      const credential = method.name === "getManagedBotToken" || method.name === "replaceManagedBotToken"
      return {
        id: method.name,
        binding: { kind: "rpc", name: method.name },
        summary: method.description[0],
        description: method.description.join("\n\n"),
        tags: [],
        parameters,
        ...(fields.length
          ? {
              requestBody: {
                required: fields.some((field) => field.required),
                confidence: "contract",
                schema: objectOf(fields),
              } as const,
            }
          : {}),
        response: {
          required: true,
          confidence: "contract",
          schema: { ...typesOf(method.returns), ...(credential ? { sensitive: true } : {}) },
        },
        source: { location: `#/methods/${method.name}` },
      }
    }),
  }
}
