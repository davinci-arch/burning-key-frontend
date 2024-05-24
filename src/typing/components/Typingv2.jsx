
import { useState, useRef, useEffect } from "react"

const textAPI = "Walter White, an African American man from Albuquerque, New Mexico, lived a life marked by struggle and perseverance. Born into a community where opportunities were scarce, Walter worked tirelessly to carve out a path of success for himself and his family. A gifted chemist, he once harbored dreams of making groundbreaking contributions to science, hoping to uplift his community and provide a better future for his loved ones. Walter's academic brilliance led him to co-found a promising startup, Gray Matter Technologies. However, feeling marginalized and unappreciated by his co-founders, who often overlooked his contributions, he left the company early on. This decision, driven by a sense of injustice and pride, haunted him as Gray Matter grew into a billion-dollar enterprise without him. His departure from the company marked the beginning of a series of missed opportunities and unfulfilled dreams. Years later, Walter was working as an overqualified high school chemistry teacher, struggling to make ends meet. His wife, Skyler, worked as a bookkeeper, and they had two children: Walter Jr., who had cerebral palsy, and their infant daughter, Holly. The family’s financial situation was dire, and the burden weighed heavily on Walter. When he was diagnosed with terminal lung cancer, the prognosis was a death sentence that came with a final, crushing blow to his hopes and dreams."


export default function Typingv2() {

    const [isFocused, setFocused] = useState(false);
    const [inputText, setInputText] = useState("");

    const [wordIndex, setWordIndex] = useState(0);
    const [letterIndex, setLetterIndex] = useState(0);
    const [typingCount, setTypingCount] = useState(0);
    const [extraLetter, setExtraLetter] = useState([]);
    const [words, setWords] = useState(textAPI.split(' '));

    const [isCursorVisible, setCursorVisible] = useState(false);
    const inputRef = useRef(null);
    const textRef = useRef(null);

    const handleInput = (event) => {
        const value = event.target.value;


        const lastChar = value[value.length - 1];

        if (words[wordIndex].length == letterIndex) {
            if (lastChar != ' ' && inputText.length < value.length) {
                setExtraLetter(prevExtraLetter => [...prevExtraLetter, letterIndex]);
                words[wordIndex] = words[wordIndex].slice(0, letterIndex) + lastChar + words[wordIndex].slice(letterIndex);
            } else if (inputText.length > value.length) {
                keyHandler(event);
            } else if (lastChar == ' ') {
                setWordIndex(wordIndex + 1);
                setLetterIndex(0);
                return;
            }
            else {
                return;
            }
        }
        keyHandler(event);
    }

    const keyHandler = (event) => {
        const value = event.target.value;

        if (inputText.length > value.length && inputText.length >= 0) {
            if (extraLetter[0] < letterIndex) {
                words[wordIndex] = words[wordIndex].slice(0, letterIndex - 1);
            } else {
                setExtraLetter([]);
            }
            setLetterIndex(letterIndex - 1);
            setTypingCount(typingCount - 1);
        } else if (letterIndex == words[wordIndex].length) {
            setWordIndex(wordIndex + 1);
            setLetterIndex(0);
        } else {
            setLetterIndex(letterIndex + 1);
        }

        setTypingCount(typingCount + 1);
        setInputText(value);
    }


    const focusedField = (event) => {
        setFocused(true);
        inputRef.current.focus();
        event.stopPropagation();
        setCursorVisible(true);
    }

    const changeFocuse = () => {
        setFocused(false);
        setCursorVisible(false);

    }

    let globalLetterIndex = 0;

    const letterComponents = words.map((word, wordIndex) => (
        <div key={wordIndex}>
            <div className="word">
                {
                    word.split('').map((letter, letterIndex) => {
                        const currentLetterIndex = globalLetterIndex;
                        globalLetterIndex++;
                        let style = "hello letter";

                        if (inputText[currentLetterIndex] == undefined) {
                            style = "letter";
                        } else if (extraLetter.includes(letterIndex)) {
                            style = "extraWord letter";
                        } else if (inputText[currentLetterIndex] != letter) {
                            style = "wrongLetter letter";
                        } else {
                            style = "correctLetter letter";
                        }
                        return (
                            <span key={letterIndex} className={style}>
                                {letter}
                            </span>
                        );
                    })
                }
            </div>
        </div>
    ));

   
    return (
        <div className="text-container">
            <div className="nested-text-container">
                <div className={isFocused ? "text focused" : "text"} ref={textRef}>
                    <div className="words">
                        {letterComponents}
                    </div>
                    {isCursorVisible ?
                        <div className="cursor"></div>
                        : <></>   
                    }
                </div>
                {!isFocused ?
                    <div className="description"
                        onClick={focusedField}
                    >
                        <span className="img-container">
                            <img src="src/assets/cursor.png" alt="cursor" className="cursor-pointer" />
                        </span>
                        <span className="hint">Click to focus on field</span>
                    </div> : ""
                }


            </div>
            <input type="text" className="text-input"
                ref={inputRef}
                value={inputText}
                onChange={handleInput}
                onBlur={changeFocuse}
            />
        </div>
    )
}