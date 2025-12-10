import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import CreateForm from '@/components/UI/Forms/CreateForm'

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    const slugified = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");   // replace spaces with hyphens

    setSlug(slugified);
  }, [name]);

  const inputs = [
    { 
      label: 'Name', 
      important: true, 
      type: 'text', 
      placeholder: 'Category name', 
      value: name, 
      setValue: setName 
    },
    { 
      label: 'Slug', 
      important: true, 
      type: 'text', 
      placeholder: 'Category slug', 
      value: slug,
      setValue: setSlug,
      disabled: true
    }
  ]
  return (
    <MainLayout>
      <CreateForm
        title='Create Category'
        inputs={inputs}
      />
    </MainLayout>
  )
}

export default CreateCategory