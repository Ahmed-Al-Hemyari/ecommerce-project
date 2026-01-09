import React from 'react'

const Input = ({
    width = 'w-full',
    label = '',
    additionalText = '',
    important = false,
    type = '',
    placeholder = '',
    value,
    setValue,
    formError,
    inputError,
    disabled = false,
    showPreview = false,
    // Number
    min,
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

            <input
                type={type}
                placeholder={placeholder}
                className={`${width} ${disabled && 'bg-gray-50'} px-4 py-2 rounded-lg border ${formError || inputError ? 'border-red-500' : 'border-(--color-light-gray)'} focus:outline-none focus:ring-2 focus:ring-(--color-green)`}
                onChange={handleChange}
                min={type = 'number' ? min : null}
                value={
                    type !== 'file' ? value : ''
                }
                disabled={disabled}
            />

            {showPreview && value && typeof value === "object" && (
                <img
                    src={URL.createObjectURL(value)}
                    alt="preview"
                    className="mt-2 h-20"
                />
            )}
        </div>
    );
};


export default Input