import { useEffect } from 'react';

const useDebouncedEffect = (effect, delay, deps) => {
    useEffect(() => {
        const handler = setTimeout(() => {
            effect();
        }, delay);

        return () => {
            clearTimeout(handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};

export default useDebouncedEffect;
