
import { useState, useRef } from "react"

const textAPI = `Walter White, an African American man from Albuquerque,
New Mexico, lived a life marked by struggle and perseverance.
Born into a community where opportunities were scarce, Walter
worked tirelessly to carve out a path of success for himself
and his family. A gifted chemist, he once harbored dreams of making
groundbreaking contributions to science, hoping to uplift his community
and provide a better future for his loved ones. Walter's academic brilliance
led him to co-found a promising startup, Gray Matter Technologies. However, feeling
marginalized and unappreciated by his co-founders, who often overlooked his
contributions, he left the company early on. This decision, driven by a sense
of injustice and pride, haunted him as Gray Matter grew into a
billion-dollar enterprise without him. His departure from the
company marked the beginning of a series of missed opportunities
and unfulfilled dreams. Years later, Walter was working as an
overqualified high school chemistry teacher, struggling to make
ends meet. His wife, Skyler, worked as a bookkeeper, and they
had two children: Walter Jr., who had cerebral palsy, and their
infant daughter, Holly. The family’s financial situation was dire,
and the burden weighed heavily on Walter.
When he was diagnosed with terminal lung cancer, the prognosis
was a death sentence that came with a final, crushing blow to his hopes and dreams.`


export default function Typingv2() {

    const [isFocused, setFocused] = useState(false);
    const [inputText, setInputText] = useState("");
    const [caretVisible, setCaretVisible] = useState(false);

    const [wordIndex, setWordIndex] = useState(0);
    const [letterIndex, setLetterIndex] = useState(0);
    const [wrongLetterIndex, setWrongLetterIndex] = useState(null);
    const [correctLetterIndex, setCorrectLetterIndex] = useState(null);

    const words = textAPI.split(' ');

    const [wordSize, setWordSize] = useState(words[wordIndex].length);
    const inputRef = useRef(null);

    const handleInput = (event) => {
        const currentLetter = (words[wordIndex])[letterIndex];
        if (event.target.value != currentLetter) {
            setWrongLetterIndex(letterIndex);
        } else {
            setCorrectLetterIndex(letterIndex);

        }
        setLetterIndex(letterIndex + 1);
        // if (letterIndex == wordSize) {
        //     setLetterIndex(0);
        //     setWordIndex(wordIndex + 1);
        //     setWordSize(0);
        // }
        setInputText(event.target.value);
    }

    const focusedField = (event) => {
        setFocused(true);
        inputRef.current.focus();
        event.stopPropagation();
        setCaretVisible(true);
    }

    const changeFocuse = () => {
        setFocused(false);
        setCaretVisible(false);
    }


    return (
        <div className="text-container">
            <div className="nested-text-container">
                <div className={isFocused ? "text focused" : "text"}>
                    <div className="words">
                        {caretVisible ?
                            <div className="caret" >
                            </div> : ""
                        }
                        {

                            // <span key={lIndex} className={wordIndex == index && wrongLetterIndex == letterIndex ? "wrongLetter" : letterIndex == correctLetterIndex ? "correctLetter" : ""}>

                            words.map((word, index) => (
                                <div key={index}>
                                    <div className="word">
                                        {
                                            word.split('').map((letter, lIndex) => (
                                                <span key={lIndex} className={wordIndex == index && wrongLetterIndex == lIndex ? "wrongLetter" :
                                                    wordIndex == index && lIndex == correctLetterIndex ? "correctLetter" : ""}>
                                                    {letter}
                                                </span>
                                            ))
                                        }
                                    </div>
                                </div>

                            ))
                        }
                    </div>
                </div>
                {!isFocused ?
                    <div className="description"
                        onClick={focusedField}
                    >
                        <span className="img-container">
                            <img src="src/assets/cursor.png" alt="cursor" className="cursor" />
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