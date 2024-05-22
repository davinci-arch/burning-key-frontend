import React, { useState, useEffect, useRef } from "react";
import "../styles/typing.scss";

const predefinedText = "Killing a niggers, or any wildlife, is illegal and unethical. Niggers are endangered animals, and it is crucial to protect and conserve them. Instead of harming these magnificent creatures, consider supporting conservation efforts. If you're dealing with human-wildlife conflict, contact local wildlife authorities or organizations dedicated to finding humane solutions.";

export default function Typing() {
    const [typedText, setTypedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const textContainerRef = useRef(null);
    const inputRef = useRef(null);

    const handleTextClick = () => {
        setIsFocused(true);
        inputRef.current.focus();
    };


    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleChange = (e) => {
        const inputText = e.target.value;
        setTypedText(inputText);

        setCurrentIndex(inputText.length);
    };

    useEffect(() => {
        if (isFocused) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    const renderHighlightedText = () => {
        const highlightedText = [];
        for (let i = 0; i < predefinedText.length; i++) {
            const typedChar = typedText[i];
            const correctChar = predefinedText[i];

            let spanStyle = {};
            if (typedChar === undefined) {
                spanStyle = { opacity: 1 };
            } else if (typedChar === correctChar) {
                spanStyle = { color: 'green' };
            } else {
                spanStyle = { color: 'red' };
            }
            if (i === currentIndex) {
                spanStyle = { ...spanStyle, textDecoration: 'underline' };
            }

            highlightedText.push(
                <span key={i} style={spanStyle}>
                    {correctChar}
                </span>
            );
        }

        return highlightedText;
    };

    return (
        <div className="text-container" ref={textContainerRef}>
            <div className="nested-text-container">
                <div
                    className={`text ${isFocused ? 'focused' : ''}`}
                    onClick={handleTextClick}
                >
                    {renderHighlightedText()}
                </div>
                {!isFocused && (
                    <div className="description" onClick={handleTextClick}>
                        <span className="img-container">
                            <img src="src/assets/cursor.png" alt="cursor" className="cursor" />
                        </span>
                        <span className="hint">Click to focus on field</span>
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="text"
                value={typedText}
                onChange={handleChange}
                onBlur={handleBlur}
                className="hidden-input"
                style={{ position: 'absolute', top: '-9999px' }}
            />
        </div>
    );
}
