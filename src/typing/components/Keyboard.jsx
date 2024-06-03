// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import '../styles/keyboard.scss';

export default  function Keyboard({isDarkTheme }) {

    const [inputText, setInputText] = useState('');
    const [isShiftPressed, setIsShiftPressed] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === 'Tab' || event.key === 'Alt') {
            event.preventDefault();
        }

        const keyElement = document.getElementById(event.code);
        if (keyElement) {
            keyElement.classList.add('active');
        }
        if (isShiftPressed) {
            keyElement.classList.add('active');
        }
    };

    const handleKeyUp = (event) => {
        const keyElement = document.getElementById(event.code);
        if (keyElement) {
            keyElement.classList.remove('active');
        }
    };


    const handleMouseClick = (code) => {
        const keyElement = document.getElementById(code);
        if (keyElement) {
            keyElement.classList.add('active');
            const keyLabel = keyElement.textContent.trim();

            switch (keyLabel) {
                case 'Space':
                    handleSpace();
                    break;
                case "Backspace":
                    handleBackspace();
                    break;
                case 'Shift':
                    toggleShift();
                    break;
                default:
                    handleKeyInput(keyLabel);
                    break;
            }
            // Simulate keyup event after a short delay to remove 'active' class
            setTimeout(() => {
                keyElement.classList.remove('active');
            }, 150);
        }
    };

    const toggleShift = () => {
        setIsShiftPressed((prevShift) => !prevShift);
    };

    const handleKeyInput = (keyLabel) => {
        const adjustedLabel = isShiftPressed ? keyLabel.toUpperCase() : keyLabel.toLowerCase();
        setInputText(prevInputText => prevInputText + adjustedLabel);
    };

    const handleSpace = () => {
        // Perform action for Space key
        setInputText(prevInputText => prevInputText + ' ');
    };

    const handleBackspace = () => {
        // Perform action for Backspace key
        setInputText(prevInputText => prevInputText.slice(0, -1));
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
        <button
            id={id}
            className={`key ${extraClass} ${isDarkTheme ? 'dark' : ''}`}
            onClick={() => handleMouseClick(id)}
        >
            {Array.isArray(labels) ? labels.map((label, index) => (
                <span key={index} className="key-label">{label}</span>
            )) : labels}
        </button>
    );

    return (
        <main className="main">
            <div className={`keyboard ${isDarkTheme ? 'dark' : ''}`}>
                <div className="row">
                    {createKey("Backquote", ["~", "`"], 'key-small col1', isDarkTheme)}
                    {createKey("Digit1", ["!", "1"], 'key-small col1', isDarkTheme)}
                    {createKey("Digit2", ["@", "2"], 'key-small col2', isDarkTheme)}
                    {createKey("Digit3", ["#", "3"], 'key-small col3', isDarkTheme)}
                    {createKey("Digit4", ["$", "4"], 'key-small col4', isDarkTheme)}
                    {createKey("Digit5", ["%", "5"], 'key-small col4', isDarkTheme)}
                    {createKey("Digit6", ["^", "6"], 'key-small col5', isDarkTheme)}
                    {createKey("Digit7", ["&", "7"], 'key-small col5', isDarkTheme)}
                    {createKey("Digit8", ["*", "8"], 'key-small col3', isDarkTheme)}
                    {createKey("Digit9", ["(", "9"], 'key-small col2', isDarkTheme)}
                    {createKey("Digit0", [")", "0"], 'key-small col1', isDarkTheme)}
                    {createKey("Minus", ["_", "-"], 'key-small col1', isDarkTheme)}
                    {createKey("Equal", ["+", "="], 'key-small col1', isDarkTheme)}
                    {createKey("Backspace", "Backspace", 'key-large col1', isDarkTheme)}
                </div>
                <div className="row">
                    {createKey("Tab", "Tab", 'key-medium col1', isDarkTheme)}
                    {createKey("KeyQ", "Q", 'key-small col1', isDarkTheme)}
                    {createKey("KeyW", "W", 'key-small col2', isDarkTheme)}
                    {createKey("KeyE", "E", 'key-small col3', isDarkTheme)}
                    {createKey("KeyR", "R", 'key-small col4', isDarkTheme)}
                    {createKey("KeyT", "T", 'key-small col4', isDarkTheme)}
                    {createKey("KeyY", "Y", 'key-small col5', isDarkTheme)}
                    {createKey("KeyU", "U", 'key-small col5', isDarkTheme)}
                    {createKey("KeyI", "I", 'key-small col3', isDarkTheme)}
                    {createKey("KeyO", "O", 'key-small col2', isDarkTheme)}
                    {createKey("KeyP", "P", 'key-small col1', isDarkTheme)}
                    {createKey("BracketLeft", ["{", "["], 'key-small col1', isDarkTheme)}
                    {createKey("BracketRight", ["}", "]"], 'key-small col1', isDarkTheme)}
                    {createKey("Backslash", ["|", "\\"], 'key-medium col1', isDarkTheme)}
                </div>
                <div className="row">
                    {createKey("CapsLock", "Caps Lock", 'key-large col1', isDarkTheme)}
                    {createKey("KeyA", "A", 'key-small col1', isDarkTheme)}
                    {createKey("KeyS", "S", 'key-small col2', isDarkTheme)}
                    {createKey("KeyD", "D", 'key-small col3', isDarkTheme)}
                    {createKey("KeyF", "F", 'key-small col4', isDarkTheme)}
                    {createKey("KeyG", "G", 'key-small col4', isDarkTheme)}
                    {createKey("KeyH", "H", 'key-small col5', isDarkTheme)}
                    {createKey("KeyJ", "J", 'key-small col5', isDarkTheme)}
                    {createKey("KeyK", "K", 'key-small col3', isDarkTheme)}
                    {createKey("KeyL", "L", 'key-small col2', isDarkTheme)}
                    {createKey("Semicolon", [":", ";"], 'key-small col1', isDarkTheme)}
                    {createKey("Quote", ['"', "'"], 'key-small col1', isDarkTheme)}
                    {createKey("Enter", "Enter", 'key-large col1', isDarkTheme)}
                </div>
                <div className="row">
                    {createKey("ShiftLeft", "Shift", 'key-xlarge col1', isDarkTheme)}
                    {createKey("KeyZ", "Z", 'key-small col1', isDarkTheme)}
                    {createKey("KeyX", "X", 'key-small col2', isDarkTheme)}
                    {createKey("KeyC", "C", 'key-small col3', isDarkTheme)}
                    {createKey("KeyV", "V", 'key-small col4', isDarkTheme)}
                    {createKey("KeyB", "B", 'key-small col4', isDarkTheme)}
                    {createKey("KeyN", "N", 'key-small col5', isDarkTheme)}
                    {createKey("KeyM", "M", 'key-small col5', isDarkTheme)}
                    {createKey("Comma", ["<", ","], 'key-small col3', isDarkTheme)}
                    {createKey("Period", [">", "."], 'key-small col2', isDarkTheme)}
                    {createKey("Slash", ["?", "/"], 'key-small col1', isDarkTheme)}
                    {createKey("ShiftRight", "Shift", 'key-xlarge col1', isDarkTheme)}
                </div>
                <div className="row">
                    {createKey("ControlLeft", "Ctrl", 'key-medium col1', isDarkTheme)}
                    {createKey("AltLeft", "Alt", 'key-medium col1', isDarkTheme)}
                    {createKey("Space", "Space", 'key-space col6', isDarkTheme)}
                    {createKey("AltRight", "Alt", 'key-medium col1', isDarkTheme)}
                    {createKey("ControlRight", "Ctrl", 'key-medium col1', isDarkTheme)}
                </div>
            </div>
        </main>
    )

}


