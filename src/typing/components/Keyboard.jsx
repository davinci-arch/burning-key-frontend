import React, { useEffect, useState } from 'react';
import '../styles/keyboard.scss';

const UkrainianLayout = {
    Backquote: ['~', '₴'],
    Digit1:  ["!", "1"],
    Digit2: ['@', '2'],
    Digit3: ['#', '3'],
    Digit4: ['$', '4'],
    Digit5: ['%', '5'],
    Digit6: ['^', '6'],
    Digit7: ['&', '7'],
    Digit8: ['*', '8'],
    Digit9: ['(', '9'],
    Digit0: [')', '0'],
    Minus: ["_", '-'],
    Equal: ["+", '='],
    Backspace: ['Backspace'],
    KeyQ: ['Q', 'Й'],
    KeyW: ['W', 'Ц'],
    KeyE: ['E', 'У'],
    KeyR: ['R', 'К'],
    KeyT: ['T', 'Е'],
    KeyY: ['Y', 'Н'],
    KeyU: ['U', 'Г'],
    KeyI: ['I', 'Ш'],
    KeyO: ['O', 'Щ'],
    KeyP: ['P', 'З'],
    BracketLeft: ['[', 'Х'],
    BracketRight: [']', 'Ї'],
    Backslash: ['\\', '|'],
    CapsLock: ['Caps Lock'],
    KeyA: ['A', 'Ф'],
    KeyS: ['S', 'І'],
    KeyD: ['D', 'В'],
    KeyF: ['F', 'А'],
    KeyG: ['G', 'П'],
    KeyH: ['H', 'Р'],
    KeyJ: ['J', 'О'],
    KeyK: ['K', 'Л'],
    KeyL: ['L', 'Д'],
    Semicolon: [';', 'Ж'],
    Quote: ['\'', 'Є'],
    Enter: ['Enter'],
    ShiftLeft: ['Shift'],
    KeyZ: ['Z', 'Я'],
    KeyX: ['X', 'Ч'],
    KeyC: ['C', 'С'],
    KeyV: ['V', 'М'],
    KeyB: ['B', 'И'],
    KeyN: ['N', 'Т'],
    KeyM: ['M', 'Ь'],
    Comma: [',', 'Б'],
    Period: ['.', 'Ю'],
    Slash: ['/', '.'],
    ShiftRight: ['Shift'],
    ControlLeft: ['Ctrl'],
    AltLeft: ['Alt'],
    Space: ['Space'],
    AltRight: ['Alt'],
    ControlRight: ['Ctrl']
};

const Keyboard = ({ isDarkTheme }) => {
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
                case 'Backspace':
                    handleBackspace();
                    break;
                case 'Shift':
                    toggleShift();
                    break;
                default:
                    handleKeyInput(keyLabel);
                    break;
            }
            setTimeout(() => {
                keyElement.classList.remove('active');
            }, 150);
        }
    };

    const toggleShift = () => {
        setIsShiftPressed((prevShift) => !prevShift);
    };

    const handleKeyInput = (keyLabel) => {
        const adjustedLabel = isShiftPressed ? UkrainianLayout[keyLabel][1] : UkrainianLayout[keyLabel][0];
        setInputText((prevInputText) => prevInputText + adjustedLabel);
    };

    const handleSpace = () => {
        setInputText((prevInputText) => prevInputText + ' ');
    };

    const handleBackspace = () => {
        setInputText((prevInputText) => prevInputText.slice(0, -1));
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
                    {createKey("Backquote", UkrainianLayout.Backquote, 'key-small col1')}
                    {createKey("Digit1", UkrainianLayout.Digit1, 'key-small col1')}
                    {createKey("Digit2", UkrainianLayout.Digit2, 'key-small col2')}
                    {createKey("Digit3", UkrainianLayout.Digit3, 'key-small col3')}
                    {createKey("Digit4", UkrainianLayout.Digit4, 'key-small col4')}
                    {createKey("Digit5", UkrainianLayout.Digit5, 'key-small col4')}
                    {createKey("Digit6", UkrainianLayout.Digit6, 'key-small col5')}
                    {createKey("Digit7", UkrainianLayout.Digit7, 'key-small col5')}
                    {createKey("Digit8", UkrainianLayout.Digit8, 'key-small col3')}
                    {createKey("Digit9", UkrainianLayout.Digit9, 'key-small col2')}
                    {createKey("Digit0", UkrainianLayout.Digit0, 'key-small col1')}
                    {createKey("Minus", UkrainianLayout.Minus, 'key-small col1')}
                    {createKey("Equal", UkrainianLayout.Equal, 'key-small col1')}
                    {createKey("Backspace", UkrainianLayout.Backspace, 'key-large col1')}
                </div>
                <div className="row">
                    {createKey("Tab", "Tab", 'key-medium col1')}
                    {createKey("KeyQ", UkrainianLayout.KeyQ, 'key-small col1')}
                    {createKey("KeyW", UkrainianLayout.KeyW, 'key-small col2')}
                    {createKey("KeyE", UkrainianLayout.KeyE, 'key-small col3')}
                    {createKey("KeyR", UkrainianLayout.KeyR, 'key-small col4')}
                    {createKey("KeyT", UkrainianLayout.KeyT, 'key-small col4')}
                    {createKey("KeyY", UkrainianLayout.KeyY, 'key-small col5')}
                    {createKey("KeyU", UkrainianLayout.KeyU, 'key-small col5')}
                    {createKey("KeyI", UkrainianLayout.KeyI, 'key-small col3')}
                    {createKey("KeyO", UkrainianLayout.KeyO, 'key-small col2')}
                    {createKey("KeyP", UkrainianLayout.KeyP, 'key-small col1')}
                    {createKey("BracketLeft", UkrainianLayout.BracketLeft, 'key-small col1')}
                    {createKey("BracketRight", UkrainianLayout.BracketRight, 'key-small col1')}
                    {createKey("Backslash", UkrainianLayout.Backslash, 'key-medium col1')}
                </div>
                <div className="row">
                    {createKey("CapsLock", UkrainianLayout.CapsLock, 'key-large col1')}
                    {createKey("KeyA", UkrainianLayout.KeyA, 'key-small col1')}
                    {createKey("KeyS", UkrainianLayout.KeyS, 'key-small col2')}
                    {createKey("KeyD", UkrainianLayout.KeyD, 'key-small col3')}
                    {createKey("KeyF", UkrainianLayout.KeyF, 'key-small col4')}
                    {createKey("KeyG", UkrainianLayout.KeyG, 'key-small col4')}
                    {createKey("KeyH", UkrainianLayout.KeyH, 'key-small col5')}
                    {createKey("KeyJ", UkrainianLayout.KeyJ, 'key-small col5')}
                    {createKey("KeyK", UkrainianLayout.KeyK, 'key-small col3')}
                    {createKey("KeyL", UkrainianLayout.KeyL, 'key-small col2')}
                    {createKey("Semicolon", UkrainianLayout.Semicolon, 'key-small col1')}
                    {createKey("Quote", UkrainianLayout.Quote, 'key-small col1')}
                    {createKey("Enter", UkrainianLayout.Enter, 'key-large col1')}
                </div>
                <div className="row">
                    {createKey("ShiftLeft", UkrainianLayout.ShiftLeft, 'key-xlarge col1')}
                    {createKey("KeyZ", UkrainianLayout.KeyZ, 'key-small col1')}
                    {createKey("KeyX", UkrainianLayout.KeyX, 'key-small col2')}
                    {createKey("KeyC", UkrainianLayout.KeyC, 'key-small col3')}
                    {createKey("KeyV", UkrainianLayout.KeyV, 'key-small col4')}
                    {createKey("KeyB", UkrainianLayout.KeyB, 'key-small col4')}
                    {createKey("KeyN", UkrainianLayout.KeyN, 'key-small col5')}
                    {createKey("KeyM", UkrainianLayout.KeyM, 'key-small col5')}
                    {createKey("Comma", UkrainianLayout.Comma, 'key-small col3')}
                    {createKey("Period", UkrainianLayout.Period, 'key-small col2')}
                    {createKey("Slash", UkrainianLayout.Slash, 'key-small col1')}
                    {createKey("ShiftRight", UkrainianLayout.ShiftRight, 'key-xlarge col1')}
                </div>
                <div className="row">
                    {createKey("ControlLeft", UkrainianLayout.ControlLeft, 'key-medium col1')}
                    {createKey("AltLeft", UkrainianLayout.AltLeft, 'key-medium col1')}
                    {createKey("Space", UkrainianLayout.Space, 'key-space col6')}
                    {createKey("AltRight", UkrainianLayout.AltRight, 'key-medium col1')}
                    {createKey("ControlRight", UkrainianLayout.ControlRight, 'key-medium col1')}
                </div>
            </div>
        </main>
    );
};

export default Keyboard;
