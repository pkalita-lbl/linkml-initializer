import React from "react";

import Editor from "@monaco-editor/react";
import { Box } from "@mantine/core";

const defaultValue = `# my linkml schema

name: whatever
id: something
`

function Edit() {
  return (
    <Box sx={(theme) => ({
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme.colors.gray,
      borderRadius: theme.radius.sm,
      padding: theme.spacing.sm
    })}>
      <Editor
        height="600px"
        defaultLanguage="yaml"
        defaultValue={defaultValue}
        options={{
          minimap: {
            enabled: false
          },
          renderLineHighlight: 'none',
          detectIndentation: false,
          tabSize: 2
        }}
      />
    </Box>
  )
}

export default Edit;