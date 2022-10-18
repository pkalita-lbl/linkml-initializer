import React, { useState, useRef } from "react";

import Editor from "@monaco-editor/react";
import { Box, Grid, Accordion,  Alert, Button, Group } from "@mantine/core";
import YAML from 'yaml'
import AddSlotForm from "../components/AddSlotForm";
import AddClassForm from "../components/AddClassForm";
import AddEnumForm from "../components/AddEnumForm";
import Ajv from "ajv";
import addFormats from "ajv-formats"
import metaSchema from '../meta.schema.json'

function initialize(schema, projectMetadata) {
  if (schema) {
    const doc = YAML.parseDocument(schema)
    const obj = doc.toJS()
    return [
      doc,
      Object.keys(obj.slots || {}),
      Object.keys(obj.classes || {}),
      Object.keys(obj.enums || {})
    ]
  } else {
    const doc = new YAML.Document({})
    doc.commentBefore = ' ' + projectMetadata.project_name
    doc.add({ key: 'id', value: `http://example.org/${projectMetadata.project_name}` })
    doc.add({ key: 'name', value: projectMetadata.project_name })
    if (projectMetadata.project_description) {
      doc.add({ key: 'description', value: `\n${projectMetadata.project_description.trim()}`})
    }
    doc.add({ key: 'prefixes', value: { linkml: 'https://w3id.org/linkml/' } })
    doc.add({ key: 'imports', value: [ 'linkml:types' ]})
    doc.add({ key: 'default_range', value: 'string' })
    return [doc, [], [], []]
  }
}

function Edit({ defaultSchema, projectMetadata, onAdvance }) {
  const [ initialDoc, initialSlots, initialClasses, initialEnums ] = initialize(defaultSchema, projectMetadata)

  const editorRef = useRef(null)
  const [slotNames, setSlotNames] = useState(initialSlots)
  const [classNames, setClassNames] = useState(initialClasses)
  const [enumNames, setEnumNames] = useState(initialEnums)
  const [doc, setDoc] = useState(initialDoc)
  const [docErrors, setDocErrors] = useState(null)

  function handleEditorDidMount(editor) {
    editorRef.current = editor
  }

  function handleDocumentUpdate(updater) {
    const parsed = YAML.parseDocument(editorRef.current.getValue())
    if (parsed.errors.length) {
      setDocErrors(parsed.errors)
      return
    }
    
    setDocErrors(null)
    try {
      updater(parsed)
    } catch (e) {
      setDocErrors([e])
    }

    setDoc(parsed)

    const parsedObj = parsed.toJS()
    setSlotNames(Object.keys(parsedObj.slots || {}))
    setClassNames(Object.keys(parsedObj.classes || {}))
    setEnumNames(Object.keys(parsedObj.enums || {}))
  }

  function handleAdvance() {
    const schema = editorRef.current.getValue()
    const schemaObj = YAML.parse(schema)
    const ajv = new Ajv({ strict: false, allErrors: true })
    addFormats(ajv)
    ajv.validate(metaSchema, schemaObj)
    const errors = ajv.errors && ajv.errors.filter(err => !(err.instancePath === '/prefixes/linkml' && err.keyword === 'type'))
    if (errors && errors.length) {
      setDocErrors(errors.map(err => ({message: `In ${err.instancePath}: ${err.message}`})))
    } else {
      onAdvance(schema)
    }
  }

  return (
    <Box sx={(theme) => ({
      borderWidth: '1px',
      // borderStyle: 'solid',
      borderColor: theme.colors.gray,
      borderRadius: theme.radius.sm,
      padding: theme.spacing.sm
    })}>
      <Grid>
        <Grid.Col span={8}>
          <Editor
            height="600px"
            defaultLanguage="yaml"
            onMount={handleEditorDidMount}
            options={{
              minimap: {
                enabled: false
              },
              renderLineHighlight: 'none',
              detectIndentation: false,
              tabSize: 2
            }}
            value={doc.toString({ nullStr: '' })}
          />
          {docErrors && docErrors.map(err => (
              <Alert title="Error" color="red" key={err} mt="sm"><pre>{err.message}</pre></Alert>
          ))}
        </Grid.Col>
        <Grid.Col span={4}>
          <Accordion>
            <Accordion.Item value="add-slot">
              <Accordion.Control>Add Slot</Accordion.Control>
              <Accordion.Panel>
                <AddSlotForm 
                  handleParsedDoc={handleDocumentUpdate} 
                  classOptions={classNames} 
                  enumOptions={enumNames}
                />
              </Accordion.Panel>
            </Accordion.Item> 

            <Accordion.Item value="add-class">
              <Accordion.Control>Add Class</Accordion.Control>
              <Accordion.Panel>
                <AddClassForm handleParsedDoc={handleDocumentUpdate} slotOptions={slotNames} />
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="add-enum">
              <Accordion.Control>Add Enum</Accordion.Control>
              <Accordion.Panel>
                <AddEnumForm handleParsedDoc={handleDocumentUpdate} />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Grid.Col>
      </Grid>
      <Group position="right">
        <Button onClick={handleAdvance}>Next</Button>
      </Group>
    </Box>
  )
}

export default Edit;