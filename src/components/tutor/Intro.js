import { useState } from 'react';
import { useEffect } from 'react';
import RichTextEditor from '../common/RichTextEditor/RichTextEditor';
import Actions from '../common/Actions';
import { get_adminConstants, post_termsOfUse } from '../../axios/admin';
import Loading from '../common/Loading';

const Intro = () => {
    const [unSavedChanges, setUnsavedChanges] = useState(false);

    const [db_intro, set_db_intro] = useState('');

    const [intro, set_intro] = useState('');
    const userRole = localStorage.getItem("user_role")
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await get_adminConstants();
                if (!!result?.data?.[0]?.IntroContent) {
                    set_intro(result.data[0].IntroContent);
                    set_db_intro(result.data[0].IntroContent);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setFetching(false)
        };

        fetchData();
    }, []);

    useEffect(() => {
        setUnsavedChanges(intro !== undefined && db_intro !== undefined &&
            intro !== db_intro)
    }, [intro, db_intro]);

    const handleEditorChange = (value) => {
        set_intro(value);
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true)
        const response = await post_termsOfUse({ IntroContent: intro });
        set_db_intro(response.data.IntroContent);
        setEditMode(false);
        setLoading(false)
    };

    if (fetching)
        return <Loading />
    return (
        <form onSubmit={handleSave}>
            <div className='px-4'>
                <RichTextEditor
                    value={intro}
                    onChange={handleEditorChange}
                    readOnly={!editMode}
                    placeholder="Enter Your Work Experience"
                    style={{ height: "100vh" }}
                />
            </div>
            <Actions
                backDisabled={true}
                loading={loading}
                saveDisabled={!userRole || userRole !== 'admin'} // Disable save if user role is not admin
                editDisabled={!userRole || userRole !== 'admin'} // Disable edit if user role is not admin
                onEdit={handleEditClick}
                unSavedChanges={unSavedChanges}
            />
        </form>
    );
}

export default Intro;