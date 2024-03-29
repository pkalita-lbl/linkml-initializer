import React, { forwardRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextInput, Text, Checkbox, Select, Stack } from "@mantine/core";

import types from '../types.json'
import { ensureYamlMap } from "../utils";

const DEFAULT_TYPES = Object.entries(types.types).map(([type, definition]) => ({
  label: type,
  value: type,
  description: definition.description
}))

const SelectTypeItem = forwardRef(function selectTypeItem({ label, description, ...rest }, ref) {
  return (
    <div ref={ref} {...rest}>
      <Text size="sm">{label}</Text>
      <Text size="xs" color="dimmed">{description}</Text>
    </div>
  )
})

function AddSlotForm({ handleParsedDoc, classOptions, enumOptions }) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm()

  function handleAddSlot(formData) {
    handleParsedDoc(parsed => {
      const slots = ensureYamlMap(parsed, 'slots')

      if (slots.has(formData.name)) {
        throw new Error(`Schema already has a slot named ${formData.name}. Try removing the existing one first.`)
      }

      const newSlot = {
        name: formData.name,
        description: formData.description || undefined,
        range: formData.range,
        multivalued: formData.multivalued || undefined,
        required: formData.required || undefined
      }
      slots.add({ key: formData.name, value: newSlot })
      reset()
    })
  }

  const types = classOptions
    .map(cls => ({
      label: cls,
      value: cls,
      description: 'A class defined by your schema'
    }))
    .concat(enumOptions.map(enm => ({
      label: enm,
      value: enm,
      description: 'An enum defined by your schema'
    })))
    .concat(DEFAULT_TYPES)

  return (
    <form onSubmit={handleSubmit(handleAddSlot)} autoComplete="off">
      <Text size="sm" mb="lg">
        LinkML encourages you to define class attributes outside of class definitions. We call those standalone 
        attributes &quot;slots&quot; and they can be reused in many classes. See the <a href="https://linkml.io/linkml/schemas/models.html#slots" target="_blank" rel="noreferrer">documentation</a> for 
        more information.
      </Text>
      <Stack spacing="sm">
        <TextInput 
          label='Name' 
          description='This is how you will refer to this slot in other parts of your schema. We recommend using snake_case.'
          error={errors.name?.message}
          {...register("name", { required: 'A name is required' })} 
        />
        <TextInput 
          label='Description' 
          description='A description can help other schema authors and users understand what this slot is for.'
          {...register("description")} 
        />
        <Controller
          name="range"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select 
              label='Range' 
              data={types} 
              itemComponent={SelectTypeItem}
              searchable
              maxDropdownHeight={400}
              filter={(value, item) => {
                const { label, description } = item;
                const search = value.toLowerCase().trim()
                return label.toLowerCase().includes(search) || description.toLowerCase().includes(search)
              }}
              value={value || null}
              onChange={onChange}
              description='The range defines the kind of values this slot can hold. Commonly used ranges like strings and integers are available by importing linkml:types. Classes and Enums you define can also be used.'
            />
          )}
        />
        <Checkbox 
          label='Multivalued' 
          {...register("multivalued")} 
        />
        <Checkbox 
          label='Required' 
          {...register("required")} 
        />
        <Button type="submit">Add</Button>
      </Stack>
    </form>
  )
}

export default AddSlotForm;
