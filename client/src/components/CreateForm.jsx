import React, { useState } from 'react';
import Input from './Input';
import { Link, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import Dropdown from './Dropdown';
import { Loader2 } from 'lucide-react';

const CreateForm = ({
    inputs = [],
    title = '', // Main title
    link, // redirect link after submit
    loading,
    formError,
    handleSubmit,
    resetForm,
    showCreateAndAddAnother = true
}) => {

    const navigate = useNavigate();
    const [clickedButton, setClickedButton] = useState(null);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const action = e.nativeEvent.submitter?.value;
        setClickedButton(action);
        const result = await handleSubmit();

        if (!result) {
            setClickedButton(null);
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
            setClickedButton('');
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
                    className="px-4 py-2 rounded-md border border-(--color-light-gray) bg-gray-200 text-(--color-dark-gray) cursor-pointer"
                >
                    Reset
                </button>
            </div>

            <form onSubmit={handleFormSubmit}>
                <p className='text-sm text-red-500 my-2'>{formError}</p>

                {inputs.map((input, index) => {

                    if (input.type === 'dropdown') {
                        return (
                            <Dropdown
                                key={index}
                                label={input.label}
                                important={input.important}
                                options={input.options}
                                fullWidth={input.fullWidth}
                                disabled={input.disabled}
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
                            className={`px-4 py-2 rounded-md border flex flex-row items-center border-(--color-green) cursor-pointer ${
                            (loading && clickedButton === 'create')
                                ? 'bg-(--color-green)/50 cursor-not-allowed'
                                : 'bg-(--color-green) hover:bg-(--color-green)/80'
                            }`}
                            disabled={clickedButton === 'create'}
                        >
                            {(loading && clickedButton === 'create') && <Loader2 className='w-4 h-4 animate-spin mr-2'/>}
                            Create
                        </button>
                        {showCreateAndAddAnother && (
                            <button
                                type='submit'
                                name='action'
                                value='create_add'
                                className={`px-4 py-2 rounded-md border border-(--color-green) flex flex-row items-center cursor-pointer ${
                                (loading && clickedButton === 'create_add')
                                    ? 'bg-(--color-green)/50 cursor-not-allowed'
                                    : 'bg-(--color-green) hover:bg-(--color-green)/80'
                                }`}
                                disabled={clickedButton === 'create_add'}
                            >
                                {(loading && clickedButton === 'create_add') && <Loader2 className='w-4 h-4 animate-spin mr-2'/>}
                                Create & Add Another
                            </button>
                        )}
                    </div>
                    <Link
                        to={link}
                        className="px-4 py-2 rounded-md bg-(--color-light-gray) border border-(--color-light-gray)"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default CreateForm;
