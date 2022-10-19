import React from "react";
import { Button, MultiSelect, Stack, Text, TextInput } from '@mantine/core'
import { useForm, Controller } from 'react-hook-form'
import { ensureYamlMap } from '../utils'

function AddClassForm({ handleParsedDoc, slotOptions }) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm()

  function handleAddClass(formData) {
    handleParsedDoc(parsed => {
      const classes = ensureYamlMap(parsed, 'classes')

      if (classes.has(formData.name)) {
        throw new Error(`Schema already has a class named ${formData.name}. Try removing the existing one first.`)
      }

      const newClass = {
        name: formData.name,
        description: formData.description || undefined,
        slots: formData.slots,
      }
      classes.add({ key: formData.name, value: newClass })
      reset()
    })
  }

  return (
    <form onSubmit={handleSubmit(handleAddClass)} autoComplete="off">
      <Text size="sm" mb="lg">
        Classes represent the main entities that you want to describe with your schema. The attributes of the class
        are described by slots. See the <a href="https://linkml.io/linkml/schemas/models.html#classes" target="_blank" rel="noreferrer">documentation</a> for 
        more information.
      </Text>
      <Stack spacing="sm">
        <TextInput 
          label='Name' 
          description='This is how you will refer to this class in other parts of your schema. We recommend using UpperCamelCase.'
          error={errors.name?.message}
          {...register("name", { required: 'A name is required' })} 
        />
        <TextInput 
          label='Description' 
          description='A description can help other schema authors and users understand what this class represents.'
          {...register("description")} 
        />
        <Controller
          name="slots"
          control={control}
          render={({ field: { onChange, value } }) => (
            <MultiSelect
              data={slotOptions}
              label='Slots'
              description='These are you classes attributes. If none are available, use the Add Slot section to add a few first.'
              onChange={onChange}
              value={value || []}
            />
          )}
        />
        <Button type="submit">Add</Button>
      </Stack>
    </form>
  )
}

export default AddClassForm;
