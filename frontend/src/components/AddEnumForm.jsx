import React from "react";
import { Button, Stack, Text, Textarea, TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { ensureYamlMap } from '../utils'
import YAML from 'yaml'

function makePermissibleValueKey(name) {
  return name.toUpperCase().replace(/\W+/g, '_');
}

function AddEnumForm({ handleParsedDoc }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  function handleAddEnum(formData) {
    handleParsedDoc(parsed => {
      const enums = ensureYamlMap(parsed, 'enums')

      if (enums.has(formData.name)) {
        throw new Error(`Schema already has a class named ${formData.name}. Try removing the existing one first.`)
      }

      const permissibleValuesMap = new YAML.YAMLMap()
      formData.permissibleValues.trim().split('\n').forEach(pv => {
        permissibleValuesMap.add({ key: makePermissibleValueKey(pv), value: { text: pv } })
      })

      const newEnum = {
        name: formData.name,
        description: formData.description || undefined,
        permissible_values: permissibleValuesMap
      }
      enums.add({ key: formData.name, value: newEnum })
      reset()
    })
  }

  return (
    <form onSubmit={handleSubmit(handleAddEnum)} autoComplete="off">
      <Text size="sm" mb="lg">
        Enums represent a constrained set of options. See the <a href="https://linkml.io/linkml/schemas/models.html#enums" target="_blank" rel="noreferrer">documentation</a> for 
        more information.
      </Text>
      <Stack spacing="sm">
        <TextInput 
          label='Name' 
          description='This is how you will refer to this enum in other parts of your schema. We recommend using UpperCamelCase.'
          error={errors.name?.message}
          {...register("name", { required: 'A name is required' })} 
        />
        <TextInput 
          label='Description' 
          description='A description can help other schema authors and users understand what this enum represents.'
          {...register("description")} 
        />
        <Textarea
          label='Permissible Values'
          description='List the permissible values for this enum, one per line.'
          autosize
          minRows={3}
          maxRows={10}
          {...register("permissibleValues")}
        />
        <Button type="submit">Add</Button>
      </Stack>
    </form>
  );
}

export default AddEnumForm;
