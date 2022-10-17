import React, { useState, useRef } from "react";

import Editor from "@monaco-editor/react";
import { Box, Grid, Accordion,  Alert } from "@mantine/core";
import YAML from 'yaml'
import AddSlotForm from "../components/AddSlotForm";
import AddClassForm from "../components/AddClassForm";
import AddEnumForm from "../components/AddEnumForm";

const initialDoc = new YAML.Document({})
initialDoc.commentBefore = ' My LinkML schema'
initialDoc.add({ key: 'id', value: 'http://example.org/my-schema' })
initialDoc.add({ key: 'name', value: 'my-schema' })
initialDoc.add({ key: 'prefixes', value: { linkml: 'https://w3id.org/linkml/' } })
initialDoc.add({ key: 'imports', value: [ 'linkml:types' ]})
initialDoc.add({ key: 'default_range', value: 'string' })

function Edit() {
  const editorRef = useRef(null)
  const [doc, setDoc] = useState(initialDoc)
  const [docErrors, setDocErrors] = useState(null)
  const [slotNames, setSlotNames] = useState([])
  const [classNames, setClassNames] = useState([])
  const [enumNames, setEnumNames] = useState([])

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

  return (
    <Box sx={(theme) => ({
      borderWidth: '1px',
      borderStyle: 'solid',
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
              <Alert title="YAML Error" color="red" key={err}><pre>{err.message}</pre></Alert>
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
    </Box>
  )
}

export default Edit;