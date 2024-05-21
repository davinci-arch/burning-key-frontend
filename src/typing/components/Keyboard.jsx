// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import '../styles/keyboard.css';

const Keyboard = () => {
    const handleKeyDown = (event) => {
        //щоб воно не гуляло по елементах браузера
        if (event.key === 'Tab' || event.key === 'Alt') {
            event.preventDefault();
        }

        const keyElement = document.getElementById(event.code);
        if (keyElement) {
            keyElement.classList.add('active');
        }
    };

    const handleKeyUp = (event) => {
        const keyElement = document.getElementById(event.code);
        if (keyElement) {
            keyElement.classList.remove('active');
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const createKey = (id, labels, extraClass = '') => (
        <button id={id} className={`key ${extraClass}`}>
            {Array.isArray(labels) ? labels.map((label, index) => (
                <span key={index} className="key-label">{label}</span>
            )) : labels}
        </button>
    );

    return (
        <main>
            <div className="keyboard">
                <div className="row">
                    {createKey("Backquote", ["~", "`"], 'key-small col1')}
                    {createKey("Digit1", ["!", "1"], 'key-small col1')}
                    {createKey("Digit2", ["@", "2"], 'key-small col2')}
                    {createKey("Digit3", ["#", "3"], 'key-small col3')}
                    {createKey("Digit4", ["$", "4"], 'key-small col4')}
                    {createKey("Digit5", ["%", "5"], 'key-small col4')}
                    {createKey("Digit6", ["^", "6"], 'key-small col5')}
                    {createKey("Digit7", ["&", "7"], 'key-small col5')}
                    {createKey("Digit8", ["*", "8"], 'key-small col3')}
                    {createKey("Digit9", ["(", "9"], 'key-small col2')}
                    {createKey("Digit0", [")", "0"], 'key-small col1')}
                    {createKey("Minus", ["_", "-"], 'key-small col1')}
                    {createKey("Equal", ["+", "="], 'key-small col1')}
                    {createKey("Backspace", "Backspace", 'key-large col1')}
                </div>
                <div className="row">
                    {createKey("Tab", "Tab", 'key-medium col1')}
                    {createKey("KeyQ", "Q", 'key-small col1')}
                    {createKey("KeyW", "W", 'key-small col2')}
                    {createKey("KeyE", "E", 'key-small col3')}
                    {createKey("KeyR", "R", 'key-small col4')}
                    {createKey("KeyT", "T", 'key-small col4')}
                    {createKey("KeyY", "Y", 'key-small col5')}
                    {createKey("KeyU", "U", 'key-small col5')}
                    {createKey("KeyI", "I", 'key-small col3')}
                    {createKey("KeyO", "O", 'key-small col2')}
                    {createKey("KeyP", "P", 'key-small col1')}
                    {createKey("BracketLeft", ["{", "["], 'key-small col1')}
                    {createKey("BracketRight", ["}", "]"], 'key-small col1')}
                    {createKey("Backslash", ["|", "\\"], 'key-medium col1')}
                </div>
                <div className="row">
                    {createKey("CapsLock", "Caps Lock", 'key-large col1')}
                    {createKey("KeyA", "A", 'key-small col1')}
                    {createKey("KeyS", "S", 'key-small col2')}
                    {createKey("KeyD", "D", 'key-small col3')}
                    {createKey("KeyF", "F", 'key-small col4')}
                    {createKey("KeyG", "G", 'key-small col4')}
                    {createKey("KeyH", "H", 'key-small col5')}
                    {createKey("KeyJ", "J", 'key-small col5')}
                    {createKey("KeyK", "K", 'key-small col3')}
                    {createKey("KeyL", "L", 'key-small col2')}
                    {createKey("Semicolon", [":", ";"], 'key-small col1')}
                    {createKey("Quote", ['"', "'"], 'key-small col1')}
                    {createKey("Enter", "Enter", 'key-large col1')}
                </div>
                <div className="row">
                    {createKey("ShiftLeft", "Shift", 'key-xlarge col1')}
                    {createKey("KeyZ", "Z", 'key-small col1')}
                    {createKey("KeyX", "X", 'key-small col2')}
                    {createKey("KeyC", "C", 'key-small col3')}
                    {createKey("KeyV", "V", 'key-small col4')}
                    {createKey("KeyB", "B", 'key-small col4')}
                    {createKey("KeyN", "N", 'key-small col5')}
                    {createKey("KeyM", "M", 'key-small col5')}
                    {createKey("Comma", ["<", ","], 'key-small col3')}
                    {createKey("Period", [">", "."], 'key-small col2')}
                    {createKey("Slash", ["?", "/"], 'key-small col1')}
                    {createKey("ShiftRight", "Shift", 'key-xlarge col1')}
                </div>
                <div className="row">
                    {createKey("ControlLeft", "Ctrl", 'key-medium col1')}
                    {createKey("AltLeft", "Alt", 'key-medium col1')}
                    {createKey("Space", "Space", 'key-space col6')}
                    {createKey("AltRight", "Alt", 'key-medium col1')}
                    {createKey("ControlRight", "Ctrl", 'key-medium col1')}
                </div>
            </div>
        </main>
    );
};

export default Keyboard;
