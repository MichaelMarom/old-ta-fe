import React, {  useEffect } from 'react';
import UserRichTextEditor from './RichTextEditor/UserRichTextEditor';
import RichTextEditor from './RichTextEditor/RichTextEditor';

const DebounceInput = ({ delay, value, setInputValue, onChange, debouceCallback, element = 'input', ...rest }) => {
    // const [inputValue, setInputValue] = useState(value);
    // const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const delayInputTimeoutId = setTimeout(() => {
            // setDebouncedValue(value);
            debouceCallback()
        }, delay);
        return () => clearTimeout(delayInputTimeoutId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, delay]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };
    if (element === 'input')
        return <input className="form-control" type="text" value={value}
            onChange={handleInputChange}  {...rest} />;

    if (element === 'user-rich-editor')
        return <UserRichTextEditor
            value={value}
            onChange={(value) => setInputValue(value)}
            {...rest}
        />


    if (element === 'rich-editor')
        return <RichTextEditor
            value={value}
            onChange={(value) => setInputValue(value)}
            {...rest}
        />
};



export default DebounceInput;
