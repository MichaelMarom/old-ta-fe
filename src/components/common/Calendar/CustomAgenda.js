import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function CustomAgenda({ event }) {
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
