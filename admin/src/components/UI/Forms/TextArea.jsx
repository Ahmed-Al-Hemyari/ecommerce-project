import React from 'react'

const TextArea = ({
    width = 'w-full',
    label = '',
    important = false,
    placeholder = '',
    value,
    setValue,
    formError,
}) => {

    const handleChange = (e) => {
        if (type === 'file') {
            setValue(e.target.files[0]); // <== THIS IS CORRECT
        } else {
            setValue(e.target.value);
        }
    };

    return (
        <div className='mb-4'>
            <label className="block mb-1 font-medium">{label}{' '}
                {important && <span className='text-red-500'>*</span>}
            </label>

            <textarea
                placeholder={placeholder}
                className={`${width} px-4 py-2 h-30 rounded-lg border ${formError ? 'border-red-500' : 'border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
                onChange={handleChange}
            />
        </div>
    );
};


export default TextArea