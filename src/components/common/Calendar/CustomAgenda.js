import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function CustomAgenda({ event }) {
    useEffect(() => { console.log('render blah balhsw') }, [])
    return (
        <div>
            <span>
                <em style={{ color: 'magenta' }}>{event.title}</em>
            </span>
            <p>{event.description}</p>
        </div>
    );
}

CustomAgenda.propTypes = {
    event: PropTypes.object,
};
