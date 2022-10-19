import { Alert, Center, Title } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { saveAs } from 'file-saver';

function ProjectDownload({ projectMetadata, projectSchema, onSubmit, onReady }) {
  const projectRef = useRef({
    ...projectMetadata,
    project_schema: projectSchema
  })
  const [filename, setFilename] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      onSubmit()
      setError('')
      setFilename(null)
      const { project_name } = projectRef.current
      const filename = project_name + '.zip'
      try {
        const response = await fetch('http://localhost:8000/ws', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(projectRef.current)
        })

        if (!response.ok) {
          throw new Error('API error')
        }

        const blob = await response.blob()
        saveAs(blob, filename)
        setFilename(filename)
      } catch (e) {
        setError('Something went wrong')
      } finally {
        onReady()
      }
    })()
  }, [])

  if (error) {
    return <Alert color="red">{error}</Alert>
  }

  if (!filename) {
    return <Center>Loading...</Center>
  }

  return (
    <>
      <Title order={2}>Your LinkML project is ready</Title>
      <p>Using the downloaded file, complete your project setup with these steps:</p>
          <pre>{
`unzip ${filename}
cd ${filename.replace('.zip', '')}
make setup`
          }</pre>
    </>
  )
}

export default ProjectDownload
