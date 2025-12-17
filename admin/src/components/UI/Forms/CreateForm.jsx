import React from 'react';
import Input from './Input';
import { Link, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import TextArea from './TextArea';
import PhoneInput from './PhoneInput';
import SearchableDropdown from './SearchableDropDown';
import Dropdown from './Dropdown';

const CreateForm = ({
    inputs = [],
    title = '', // Main title
    link, // redirect link after submit
    formError,
    handleSubmit,
    resetForm,
}) => {

    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const action = e.nativeEvent.submitter?.value; // which button was clicked
        const result = await handleSubmit();

        if (!result) {
            enqueueSnackbar('Failed to add', {
                variant: 'error'
            });
            return;
        }

        // Create behavior
        if (action === 'create') {
            navigate(link, {
                state: {
                    message: 'Added successfully',
                    status: 'success'
                }
            });
        } else if (action === 'create_add') {
            enqueueSnackbar('Added successfully', { variant: 'success' });
            resetForm();
        }
    };

    return (
        <div>
            <div className='flex flex-row justify-between mb-5 px-2 py-3'>
                <h1 className='text-3xl font-medium'>{title}</h1>
            </div>

            <div className='flex flex-row justify-end my-5'>
                <button
                    onClick={resetForm}
                    type="button"
                    className="px-4 py-2 rounded-md border qb-border bg-gray-200 text-(--color-dark-gray) cursor-pointer"
                >
                    Reset
                </button>
            </div>

            <form onSubmit={handleFormSubmit}>
                <p className='text-sm text-red-500 my-2'>{formError}</p>

                {inputs.map((input, index) => {
                    if (input.type === 'select' || input.type === 'searchable') {
                        return (
                            <SearchableDropdown
                                key={index}
                                label={input.label}
                                important={input.important}
                                options={input.options}
                                placeholder={input.placeholder}
                                value={input.value}
                                setValue={input.setValue}
                                formError={formError}
                            />
                        );
                    }

                    if (input.type === 'dropdown' || input.type === 'searchable') {
                        return (
                            <Dropdown
                                key={index}
                                label={input.label}
                                important={input.important}
                                options={input.options}
                                placeholder={input.placeholder}
                                value={input.value}
                                setValue={input.setValue}
                                formError={formError}
                            />
                        );
                    }

                    if (input.type === 'phone') {
                        return (
                            <PhoneInput 
                                key={index}
                                phoneLogin={true}
                                countryCode={input.countryCode}
                                setCountryCode={input.setCountryCode}
                                phone={input.phone}
                                setPhone={input.setPhone}
                                phoneError={input.phoneError}
                                formError={input.formError}
                            />
                        );
                    }

                    if (input.type === 'textarea') {
                        return (
                            <TextArea
                                key={index}
                                label={input.label}
                                important={input.important}
                                placeholder={input.placeholder}
                                value={input.value}
                                setValue={input.setValue}
                                formError={formError}
                            />
                        );
                    }

                    return (
                        <Input
                            key={index}
                            label={input.label}
                            important={input.important}
                            type={input.type}
                            placeholder={input.placeholder}
                            additionalText={input.additionalText}
                            value={input.value}
                            setValue={input.setValue}
                            disabled={input.disabled}
                            formError={formError}
                            showPreview={input.showPreview}
                        />
                    );
                })}

                <div className='flex flex-row justify-between mt-5'>
                    <div className='flex gap-2'>
                        <button
                            type='submit'
                            name='action'
                            value='create'
                            className="px-4 py-2 rounded-md bg-(--color-green) border qb-border cursor-pointer"
                        >
                            Create
                        </button>
                        <button
                            type='submit'
                            name='action'
                            value='create_add'
                            className="px-4 py-2 rounded-md bg-(--color-green) border qb-border cursor-pointer"
                        >
                            Create & Add Another
                        </button>
                    </div>
                    <Link
                        to={link}
                        className="px-4 py-2 rounded-md bg-(--color-light-gray) border qb-border"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default CreateForm;
