import YAML from 'yaml'

export function ensureYamlMap(node, fieldName) {
  let field = node.get(fieldName, true)
  if (!field) {
    field = new YAML.Document(new YAML.YAMLMap())
    node.add({ key: fieldName, value: field })
  } else if (!YAML.isMap(field)) {
    node.delete(fieldName)
    field = new YAML.Document(new YAML.YAMLMap())
    node.add({ key: fieldName, value: field })
  }
  return field
}
