import { useEffect, useState } from 'react';

/**
 * A custom hook that allows storing data in the browser's localStorage and syncing it with the component state.
 *
 * @template T The type of the value to be stored in localStorage.
 * @param {string} key The key to be used for storing the value in localStorage.
 * @param {(T | (() => T))} initialValue The initial value to be stored in localStorage. Can also be a function that returns the initial value.
 * @returns {[typeof value, typeof setValue]} An array containing the current value and a function to update the value.
 */

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
	const [value, setValue] = useState<T>(() => {
		const jsonValue = localStorage.getItem(key);
		if (jsonValue !== null) return JSON.parse(jsonValue);

		if (typeof initialValue === 'function') {
			return (initialValue as () => T)();
		} else {
			return initialValue;
		}
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue] as [typeof value, typeof setValue];
}
