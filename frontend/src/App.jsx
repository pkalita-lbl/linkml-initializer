import { useState } from 'react'
import { saveAs } from 'file-saver'
import schema from './schema.json'
import './App.css'
import { useForm } from 'react-hook-form';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { pickBy } from 'lodash'
import { MantineProvider, TextInput, Button, Box } from '@mantine/core';

// These fields violate Ajv's default strict mode setting
delete schema['metamodel_version'];
delete schema['version'];

function App() {
  const { 
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: async (data, context, options) => {
      // you can debug your validation schema here
      const cleanData = pickBy(data)
      // console.log('formData', cleanData)
      // console.log('validation result', await ajvResolver(schema)(cleanData, context, options))
      return ajvResolver(schema)(cleanData, context, options)
    },
  })
  const [filename, setFilename] = useState('')

  const handleGenerate = async (formData) => {
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
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box sx={{ maxWidth: 300 }} mx="auto">
        <form onSubmit={handleSubmit(handleGenerate)}>
          <TextInput 
            label='Name'
            error={errors.name?.message}
            {...register('name')}
          />
          <TextInput 
            label='Description'
            error={errors.description?.message}
            {...register('description')}
          />
          <TextInput
            label='Author'
            error={errors.author?.message}
            {...register('author')}
          />
          <Button type="submit" mt="md">Submit</Button>
        </form>
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
