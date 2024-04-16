import { useState, useEffect } from 'react';
import moment from 'moment';

function useClock() {
    const [currentTime, setCurrentTime] = useState(moment().format('dddd, MMMM D, HH:mm'));

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newTime = moment().format('dddd, MMMM D, HH:mm');
            setCurrentTime(newTime);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return currentTime;
}

export default useClock;
