import React from "react";

import { useState } from 'react';
import { Box, Stepper } from '@mantine/core';
import ProjectDetailsForm from '../components/ProjectDetailsForm';
import SchemaEditor from "../components/SchemaEditor";
import ProjectDownload from "../components/ProjectDownload";

function Root() {
  const [projectMetadata, setProjectMetadata] = useState(null)
  const [projectSchema, setProjectSchema] = useState('')
  const [downloadProcessing, setDownloadProcessing] = useState(false)
  const [active, setActive] = useState(0)

  function handleSaveProjectMetadata(data) {
    setProjectMetadata(data);
    setActive(1)
  }

  function handleSaveSchema(schema) {
    setProjectSchema(schema)
    setActive(2)
  }

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
          <SchemaEditor projectMetadata={projectMetadata} defaultSchema={projectSchema} onAdvance={handleSaveSchema} />
        </Stepper.Step>
        <Stepper.Step label="Download" allowStepSelect={active > 2} loading={downloadProcessing}>
          <ProjectDownload 
            projectMetadata={projectMetadata} 
            projectSchema={projectSchema} 
            onSubmit={() => setDownloadProcessing(true)}
            onReady={() => setDownloadProcessing(false)}
          />
        </Stepper.Step>
      </Stepper>
    </>
  )
}

export default Root;