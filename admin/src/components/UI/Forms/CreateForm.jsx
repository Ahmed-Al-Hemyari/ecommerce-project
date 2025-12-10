import React from 'react'
import Input from './Input'
import { Link } from 'react-router-dom'

const CreateForm = ({
    inputs = [],
    title = '',
    handleSubmit,
}) => {
  return (
    <div>
        <div className='flex flex-row justify-between mb-5 px-2 py-3'>
            <h1 className='text-3xl font-medium'>{title}</h1>
        </div>

        <form action="">
            {inputs.map((input) => (
                <>
                    <Input
                        label={input.label}
                        important={input.important}
                        type={input.type}
                        placeholder={input.placeholder}
                        additionalText={input.additionalText}
                        value={input.value}
                        setValue={input.setValue}
                        disabled={input.disabled}
                    />
                    <div className="h-4"></div>
                </>
            ))}
            <div className='flex flex-row justify-between'>
                <div>
                    <button
                        className="px-4 py-2 mr-2 rounded-md bg-(--color-green) border qb-border"
                    >
                        Create
                    </button>
                    <button
                        className="px-4 py-2 rounded-md bg-(--color-green) border qb-border"
                    >
                        Create & Add Another
                    </button>
                </div>
                <Link
                    to={'/categories'}
                    className="px-4 py-2 rounded-md bg-(--color-light-gray) border qb-border"
                >
                    Cancel
                </Link>
            </div>
        </form>
    </div>
  )
}

export default CreateForm