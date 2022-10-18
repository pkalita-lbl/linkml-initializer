import React from "react";

import { useState } from 'react';
import saveAs from 'file-saver'
import { Box, Stepper } from '@mantine/core';
import ProjectDetailsForm from '../components/ProjectDetailsForm';
import Edit from "./Edit";

function Root() {
  const [filename, setFilename] = useState('')
  const [projectMetadata, setProjectMetadata] = useState(null)
  const [projectSchema, setProjectSchema] = useState('')
  const [active, setActive] = useState(0)

  function handleSaveProjectMetadata(data) {
    setProjectMetadata(data);
    setActive(1)
  }

  function handleSaveSchema(schema) {
    setProjectSchema(schema)
    setActive(2)
  }

  // const handleGenerate = async (formData) => {
  //   setFilename('')
  //   const filename = formData.project_name + '.zip'
  //   const response = await fetch('http://localhost:8000/ws', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(formData)
  //   })
  //   const blob = await response.blob()
  //   saveAs(blob, filename)
  //   setFilename(filename)
  // }

  return (
    <>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step label="Project details">
          <Box sx={{ maxWidth: 300 }} mx="auto">
            <ProjectDetailsForm 
              defaultValues={projectMetadata}
              onSubmit={handleSaveProjectMetadata}
            />
          </Box>
        </Stepper.Step>
        <Stepper.Step label="Schema" allowStepSelect={active > 1}>
          <Edit projectMetadata={projectMetadata} defaultSchema={projectSchema} onAdvance={handleSaveSchema} />
        </Stepper.Step>
        <Stepper.Step label="Download" allowStepSelect={active > 2}>
          <pre>{JSON.stringify(projectMetadata, null, 2)}</pre>
          <pre>{projectSchema}</pre>
        </Stepper.Step>
      </Stepper>


      {filename && (
        <div>
          <h2>You're almost there!</h2>
          <p>Using the downloaded file, complete your project setup with these steps:</p>
          <pre>{
`unzip ${filename}
cd ${filename.replace('.zip', '')}
make setup`
          }</pre>
        </div>
      )}
    </>
  )
}

export default Root;