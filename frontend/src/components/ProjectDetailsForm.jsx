import React from 'react'
import { useForm } from 'react-hook-form';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { pickBy } from 'lodash'
import { TextInput, Button, Title, Box, NativeSelect, Textarea } from '@mantine/core';

import schema from '../schema.json'

// These fields violate Ajv's default strict mode setting
delete schema['metamodel_version'];
delete schema['version'];

function ProjectDetailsForm({ onSubmit, defaultValues }) {
  const { 
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues,
    resolver: async (data, context, options) => {
      // you can debug your validation schema here
      const cleanData = pickBy(data)
      // console.log('formData', cleanData)
      // console.log('validation result', await ajvResolver(schema)(cleanData, context, options))
      return ajvResolver(schema)(cleanData, context, options)
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box mb="md">
        <Title order={3}>Author</Title>
        <TextInput 
          label='Name'
          error={errors.full_name?.message}
          placeholder='Your Name'
          {...register('full_name')}
        />
        <TextInput 
          label='Email'
          error={errors.email?.message}
          placeholder='you@example.com'
          {...register('email')}
        />
        <TextInput
          label='GitHub username or organization'
          error={errors.github_org?.message}
          {...register('github_org')}
        />
      </Box>
      
      <Box mb="md">
        <Title order={3}>Project</Title>
        <TextInput 
          label='Name'
          error={errors.project_name?.message}
          placeholder='my-schema'
          {...register('project_name')}
        />
        <Textarea 
          label='Description'
          error={errors.project_description?.message}
          {...register('project_description')}
        />
        <NativeSelect 
          label='License'
          error={errors.license?.message}
          data={schema.$defs.Licenses.enum}
          {...register('license')}
        />
      </Box>
      
      <Button type="submit">Next</Button>
    </form>
  )
}

export default ProjectDetailsForm
