import React, { useState } from 'react';
import Layout from './Layout';
import TextArea from '../../../components/common/TextArea';
import { MandatoryFieldLabel } from '../../../components/tutor/TutorSetup';
import TAButton from '../../../components/common/TAButton'
import { FaPlus } from 'react-icons/fa';

function AddSMSTemps() {
    const [smsSamples, setSmsSamples] = useState([]);
    const [currentSms, setCurrentSms] = useState('');
    const [editMode, setEditMode] = useState(false); // Track edit mode for button text

    const handleAddSms = (e) => {
        e.preventDefault();

        if (currentSms.trim()) { // Check for empty input before adding
            setSmsSamples([...smsSamples, currentSms]);
            setCurrentSms(''); // Clear input field after adding
            setEditMode(true); // Switch to edit mode after first addition
        } else {
            alert('Please enter an SMS sample.');
        }
    };

    const handleEditSms = (index) => {
        const newSmsSamples = [...smsSamples];
        newSmsSamples[index] = currentSms;
        setSmsSamples(newSmsSamples);
        setCurrentSms(''); // Clear input field after editing
        setEditMode(false); // Exit edit mode after saving
    };

    const handleDeleteSms = (index) => {
        const newSmsSamples = [...smsSamples];
        newSmsSamples.splice(index, 1);
        setSmsSamples(newSmsSamples);
    };

    const handlePlusClick = () => {
        setSmsSamples([...smsSamples, '']); // Add a new empty input for next SMS
    };

    const handleInputChange = (e) => {
        setCurrentSms(e.target.value);
    };

    return (
        <Layout>
            <div className="container">
                <h2>SMS Samples</h2>
                <form onSubmit={editMode ? handleEditSms : handleAddSms}>
                    <div className="form-group mb-3 d-flex">
                        <TextArea 
                        value={currentSms}
                        setValue={setCurrentSms}
                        label={<MandatoryFieldLabel text={"Write SMS Text"} />}
                        editMode={editMode}
                        height={50}
                        />

                        <TAButton buttonText={"Save"} />
                        
                        <div className='rounded-circle shadow border' onClick={handlePlusClick}>
                            <FaPlus size="30"/>
                        </div>
                    </div>
                </form>
                {smsSamples.map((sms, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                        <p className="me-auto">{sms}</p>
                        {smsSamples.length > 1 && ( // Only show delete button if there are multiple SMS samples
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteSms(index)}>
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </Layout>
    );
}

export default AddSMSTemps;
