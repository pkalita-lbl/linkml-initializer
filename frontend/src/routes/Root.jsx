import React from "react";

import { useState } from 'react';
import { Box, Stepper } from '@mantine/core';
import ProjectDetailsForm from '../components/ProjectDetailsForm';
import SchemaEditor from "../components/SchemaEditor";
import ProjectDownload from "../components/ProjectDownload";
import { saveAs } from 'file-saver';

function Root() {
  const [projectMetadata, setProjectMetadata] = useState(null)
  const [projectSchema, setProjectSchema] = useState('')
  const [downloadProcessing, setDownloadProcessing] = useState(false)
  const [downloadFilename, setDownloadFilename] = useState(null)
  const [downloadError, setDownloadError] = useState(null)
  const [active, setActive] = useState(0)

  function handleStepChange(stepIndex) {
    setActive(stepIndex)
  }

  function handleSaveProjectMetadata(data) {
    setProjectMetadata(data);
    setActive(1)
  }

  async function handleSaveSchema(schema) {
    setProjectSchema(schema)
    setDownloadProcessing(true)
    setDownloadFilename('')
    setActive(2)
    
    const { project_name } = projectMetadata
    const filename = project_name + '.zip'
    try {
      const response = await fetch('http://localhost:8000/ws', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...projectMetadata,
          project_schema: schema
        })
      })

      if (!response.ok) {
        throw new Error('API error')
      }

      const blob = await response.blob()
      saveAs(blob, filename)
      setDownloadFilename(filename)
    } catch (e) {
      setDownloadError('Something went wrong')
    } finally {
      setDownloadProcessing(false)
    }
  }

  return (
    <>
      <Stepper active={active} onStepClick={handleStepChange} breakpoint="sm">
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
          <ProjectDownload filename={downloadFilename} error={downloadError} />
        </Stepper.Step>
      </Stepper>
    </>
  )
}

export default Root;