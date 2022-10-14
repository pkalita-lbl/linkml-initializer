import { useState } from 'react';
import saveAs from 'file-saver'
import { MantineProvider, Box } from '@mantine/core';
import ProjectDetailsForm from './components/ProjectDetailsForm';

function App() {
  const [filename, setFilename] = useState('')

  const handleGenerate = async (formData) => {
    setFilename('')
    const filename = formData.project_name + '.zip'
    const response = await fetch('http://localhost:8000/ws', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    const blob = await response.blob()
    saveAs(blob, filename)
    setFilename(filename)
  }
  
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box sx={{ maxWidth: 300 }} mx="auto">
        <ProjectDetailsForm onSubmit={handleGenerate} />
      </Box>

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
    </MantineProvider>
  )
}

export default App
