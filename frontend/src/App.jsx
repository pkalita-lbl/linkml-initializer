import { useState } from 'react'
import { saveAs } from 'file-saver'
import Form from '@rjsf/core'
import schema from './schema.json'
import './App.css'

function App() {
  const [formData, setFormData] = useState(null)
  const [filename, setFilename] = useState('')

  const handleGenerate = async (e) => {
    setFilename('')
    const filename = formData.name + '.zip'
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
    <>
      <Form 
        schema={schema} 
        formData={formData}
        onChange={e => {
          setFilename('')
          setFormData(e.formData)
        }}
        onSubmit={handleGenerate}
        noHtml5Validate
        uiSchema={{
          "ui:title": "",
          "ui:order": ["name", "description", "author"]
        }}
      />

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

export default App
