import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"

import PressSound from "../../assets/sfx/pressSound.wav"
import EraseSound from "../../assets/sfx/eraseSound.wav"
import ErrorSound from "../../assets/sfx/errorSound.mp3"
import SpaceSound from "../../assets/sfx/spaceSound.wav"
import "../styles/typing.scss"
import { getText } from "../api/TextAPI"

const Typing = forwardRef((props, ref) => {
    const [inputText, setInputText] = useState("");
    const [counterExtraLetter, setCounterExtraLetter] = useState(0);
    const [words, setWords] = useState(props.textAPI);
    const [isCursorVisible, setCursorVisible] = useState(false);
    const [extraLetter, setExtraLetter] = useState([]);
    const [wordIndex, setWordIndex] = useState(0);
    const [letterIndex, setLetterIndex] = useState(0);
    const [lines, setLines] = useState([]);
    const [countCorrectTypingKeys, setCountCorrectTypingKeys] = useState(0);
    const [countTypingKeys, setCountTypingKeys] = useState(0);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const amountOfExtraLetters = 5;

    useImperativeHandle(ref, () => ({
        resetText() {
            resetAllData();
        },
        timer() {
            resetAllData();
            results();
        },
        focusedField() {
            inputRef.current.focus();
            setCursorVisible(true);
        },
        getCorrectLetter() {
            return countCorrectTypingKeys;
        },
        getAllLetter() {
            return countTypingKeys;
        }
    }));

    const resetAllData = () => {
        setWords(props.textAPI);
        setInputText("");
        setWordIndex(0);
        setCounterExtraLetter(0);
        setCountCorrectTypingKeys(0);
        setCountTypingKeys(0);
        setLetterIndex(0);
        setExtraLetter([]);
        setCursorVisible(true);
        inputRef.current.focus();
    }

    const playSound = (sound) => {
        if (props.isSoundOn) {
            var audio = new Audio(sound);
            audio.play();
        }
    }

    const handleInput = (event) => {
        const value = event.target.value;
        const lastChar = value[value.length - 1];

        if (!props.isRunning) {
            if (props.type != "multiplayer") {
                props.setIsRunning(true);
            }
        } else {
            if (props.type == "multiplayer" && wordIndex == 0 && letterIndex == 0) {
                props.setNewData(wordIndex, words[wordIndex])
            }
        }

        if (lastChar === ' ' && counterExtraLetter > 0 && inputText.length < value.length) {
            return;
        }
        if (wordIndex == lines[lines.length == 1 ? 0 : 1].endIndex && (words[wordIndex].length - 1) == letterIndex && lastChar == ' ' && lines.length > 3) {
            setInputText(value);
            removeLineByIndex(0);
            setCountCorrectTypingKeys(countCorrectTypingKeys + 1);
            setCountTypingKeys(countTypingKeys + 1);
            playSound(SpaceSound);
            return;
        }
        if (inputText.length < value.length && extraLetter.length >= amountOfExtraLetters) {
            return;
        }

        if (words[wordIndex][letterIndex] == lastChar) {
            if (lastChar === ' ') {
                    playSound(SpaceSound);
                } else {
                    setCountCorrectTypingKeys(countCorrectTypingKeys + 1);
                    setCountTypingKeys(countTypingKeys + 1);
                    playSound(PressSound);
                }
        } else if (inputText.length < value.length) {
             playSound(ErrorSound);

                const incorrectKeyElement = document.getElementById(`Key${lastChar.toUpperCase()}`);
                if (incorrectKeyElement) {
                    incorrectKeyElement.classList.add('pulsate');
                    setTimeout(() => {
                        incorrectKeyElement.classList.remove('pulsate');
                    }, 500);
                }
        }
        if (words[wordIndex].length - 1 == letterIndex &&
            lastChar != ' ' &&
            inputText.length < value.length &&
            (wordIndex - 1) != lines[lines.length - 1].endIndex - 2) {

          setExtraLetter(prevExtraLetter => [...prevExtraLetter, letterIndex]);
            setCounterExtraLetter(counterExtraLetter + 1);
            setCountTypingKeys(countTypingKeys + 1);
            words[wordIndex] = words[wordIndex].slice(0, letterIndex) + lastChar + words[wordIndex].slice(letterIndex);
        }

        if (inputText.length > value.length) {
            playSound(EraseSound);
            if (extraLetter.length > 0) {
                const updateLetters = words[wordIndex].split('');
                updateLetters[extraLetter[counterExtraLetter - 1]] = '';
                words[wordIndex] = updateLetters.join('');
                setCounterExtraLetter(counterExtraLetter - 1);
                setExtraLetter(extraLetter.slice(0, -1));
                setLetterIndex(letterIndex - 1);
            } else if (letterIndex === 0) {
                setWordIndex(wordIndex - 1);
                if (props.type == "multiplayer") {
                    props.setNewData(wordIndex - 1, words[wordIndex - 1])
                }
                setLetterIndex(words[wordIndex - 1].length - 1)
                setInputText(value);
            } else {
                setLetterIndex(letterIndex - 1);
            }
        } else {
            if (letterIndex === words[wordIndex].length - 1) {
                setLetterIndex(0);
                setWordIndex(wordIndex + 1);
                if (props.type == "multiplayer") {
                    props.setNewData(wordIndex + 1, words[wordIndex + 1])

                }
            } else {
                setLetterIndex(letterIndex + 1);
            }
            setCountTypingKeys(countTypingKeys + 1);
        }
        setInputText(value);

        if ((wordIndex - 1) == lines[lines.length - 1].endIndex - 2 && letterIndex == words[wordIndex].length - 1 && inputText.length < value.length) {
            results();
            return;
        }
    }

    // const moveCursor = (position) => {
    //     const letters = containerRef.current.querySelectorAll('.letter');
    //     let leftOffset = 0;
    //     for (let i = 0; i < position; i++) {
    //         leftOffset += letters[i].offsetWidth;
    //     }
    //     const cursor = containerRef.current.querySelector('.cursor');
    //     cursor.style.transform = `translateX(${leftOffset}px)`;
    // }
    const results = () => {
        if (props.type != "multiplayer") {
            props.setIsRunning(false);
        }
        props.setCountKeys(countTypingKeys);
        props.setCorrectKeys(countCorrectTypingKeys);
    }
    useEffect(() => {
        const container = containerRef.current;
        const updateLines = () => {
            setLines(getLineEndIndices(container));
        };
        window.addEventListener('resize', updateLines);
        updateLines();

        return () => {
            window.removeEventListener('resize', updateLines);
        };
    }, [words, props.selectedSize, props.selectedFont]);

    const getLineEndIndices = (container) => {
        const items = container.children;
        const lines = [];
        let currentLineTop = null;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemTop = item.getBoundingClientRect().top;

            if (currentLineTop === null || itemTop > currentLineTop) {
                currentLineTop = itemTop;
                if (lines.length > 0) {
                    const previousLine = lines[lines.length - 1];
                    previousLine.endIndex = i - 1;
                    previousLine.length = calculateLineLength(previousLine.startIndex, previousLine.endIndex);
                    previousLine.wordCount = countWords(previousLine.startIndex, previousLine.endIndex);
                }
                lines.push({ startIndex: i });
            }
        }
        if (lines.length > 0) {
            const lastLine = lines[lines.length - 1];
            lastLine.endIndex = items.length - 1;
            lastLine.length = calculateLineLength(lastLine.startIndex, lastLine.endIndex);
            lastLine.wordCount = countWords(lastLine.startIndex, lastLine.endIndex);
        }
        return lines;
    };

    const calculateLineLength = (startIndex, endIndex) => {
        let length = 0;
        for (let i = startIndex; i <= endIndex; i++) {
            length += words[i].length;
        }
        return length;
    };

    const countWords = (startIndex, endIndex) => {
        let count = 0;
        for (let i = startIndex; i <= endIndex; i++) {
            if (words[i].trim() !== '') {
                count++;
            }
        }
        return count;
    };

    const removeLineByIndex = (lineIndex) => {
        if (lineIndex < 0 || lineIndex >= lines.length) {
            console.warn('Invalid line index');
            return;
        }
        const { startIndex, endIndex } = lines[lineIndex];
        const updatedWords = [
            ...words.slice(0, startIndex),
            ...words.slice(endIndex + 1)
        ];
        setInputText(prevText => prevText.slice(lines[0].length));
        setWords(updatedWords);
        setWordIndex(wordIndex - (lines[0].wordCount - 1));
        setLetterIndex(0);
    };

    let globalIndex = 0;
    const letterComponents = words.map((word, wordI) => {
        return (
            <div key={wordI}>
                <div className="word">
                    {
                        word.split('').map((letter, letteri) => {
                            const global = globalIndex;
                            globalIndex++;

                            let style = "letter";
                            if (inputText[global] == undefined) {
                                style = "letter";
                            } else if (inputText[global] != word[letteri]) {
                                style = "wrongLetter letter";
                            } else if (inputText[global] == word[letteri]) {
                                style = "correctLetter letter";
                            }
                            if (wordIndex == wordI && extraLetter.length > 0) {
                                if (extraLetter.includes(letteri)) {
                                    style = "wrongLetter letter"
                                }
                            }
                            if (letter === ' ') {
                                letter = '\u00a0';
                            }
                            if (letterIndex == letteri && wordIndex == wordI && isCursorVisible) {
                                style += wordIndex == 0 && letterIndex == 0 ? " activeLetter blink" : " activeLetter"
                            }
                            return (
                                <span key={letteri} className={style}>
                                    {letter}
                                </span>
                            );
                        })
                    }
                </div>
            </div>
        )
    });

    return (
        <div className="text-container">
            <div className="nested-text-container" style={{fontSize: props.selectedSize, fontFamily: props.selectedFont}}>
                <div className={props.isFocused ? "text focused" : "text"}>
                    <div className={`words ${props.isDarkTheme ? 'dark' : ''}`} ref={containerRef}>
                        {letterComponents}
                    </div>
                    {/* {isCursorVisible ?
                        <div className="cursor"></div>
                        : <></>   
                    } */}
                </div>
                {props.children}
            </div>
            <input type="text" className="text-input"
                ref={inputRef}
                value={inputText}
                onChange={handleInput}
                onBlur={() => {
                    props.changeFocuse();
                    setCursorVisible(false);
                }}
            />
        </div>
    )
})

export default Typing;
