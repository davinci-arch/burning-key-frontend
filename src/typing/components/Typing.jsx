
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import PressSound from "../../assets/pressSound3.wav"
import "../styles/typing.scss"
import { getText } from "../api/TextAPI"


const Typing = forwardRef((props, ref) => {
    const [textAPI, setTextAPI] = useState("");
    const [isFocused, setFocused] = useState(false);
    const [inputText, setInputText] = useState("");
    const [counterExtraLetter, setCounterExtraLetter] = useState(0);
    let regex = /.*?\s|.*?$/g;
    const [words, setWords] = useState(textAPI.match(regex));
    const [isCursorVisible, setCursorVisible] = useState(false);
    const [extraLetter, setExtraLetter] = useState([]);
    const [wordIndex, setWordIndex] = useState(0);
    const [letterIndex, setLetterIndex] = useState(0);
    const [lines, setLines] = useState([]);
    const [countCorrectTypingKeys, setCountCorrectTypingKeys] = useState(0);
    const [countTypingKeys, setCountTypingKeys] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const amountOfExtraLetters = 5;

    useEffect(() => {
        const fetchData = async () => {
            const result = await getText();
            setTextAPI(result);
            setWords(result.match(regex));
        }
        fetchData();
    }, []);

    useImperativeHandle(ref, () => ({
        resetText() {
            resetAllData();
        }
    }));

    const resetAllData = () => {
        setWords(textAPI.match(regex));
        setInputText("");
        setWordIndex(0);
        setCounterExtraLetter(0);
        setLetterIndex(0);
        setExtraLetter([]);
        setFocused(true);
        setCursorVisible(true);
        inputRef.current.focus();
    }

    const play = () => {
        if (props.isSoundOn) {
            var audio = new Audio(PressSound)
            audio.play();
        }
    }

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!isRunning && elapsedTime !== 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    const handleInput = (event) => {
        const value = event.target.value;
        const lastChar = value[value.length - 1];

        if (!isRunning) {
            setIsRunning(true);
        }

        if (lastChar == ' ' && extraLetter.length > 0) {
            return;
        }
        if (wordIndex == lines[1].endIndex && lastChar == ' ' && lines.length > 3) {
            setInputText(value);
            removeLineByIndex(0);
            setCountCorrectTypingKeys(countCorrectTypingKeys + 1);
            setCountTypingKeys(countTypingKeys + 1);
            return;
        }
        if (inputText.length < value.length && extraLetter.length >= amountOfExtraLetters) {
            return;
        }

        if (words[wordIndex][letterIndex] == lastChar) {
            setCountCorrectTypingKeys(countCorrectTypingKeys + 1);
            setCountTypingKeys(countTypingKeys + 1);
        }
        play();
        if (words[wordIndex].length - 1 == letterIndex && lastChar != ' ' && inputText.length < value.length && (wordIndex - 1) != lines[lines.length - 1].endIndex - 2) {
            setExtraLetter(prevExtraLetter => [...prevExtraLetter, letterIndex]);
            setCounterExtraLetter(counterExtraLetter + 1);
            setCountTypingKeys(countTypingKeys + 1);
            words[wordIndex] = words[wordIndex].slice(0, letterIndex) + lastChar + words[wordIndex].slice(letterIndex);
        }
        if (inputText.length > value.length) {

            if (extraLetter.length > 0) {
                const updateLetters = words[wordIndex].split('');
                updateLetters[extraLetter[counterExtraLetter - 1]] = '';
                words[wordIndex] = updateLetters.join('');
                setCounterExtraLetter(counterExtraLetter - 1);
                setExtraLetter(extraLetter.slice(0, -1));
                setLetterIndex(letterIndex - 1);
            } else if (letterIndex == 0) {
                setWordIndex(wordIndex - 1);
                setLetterIndex(words[wordIndex - 1].length - 1)
                setInputText(value);
            } else {
                setLetterIndex(letterIndex - 1);
            }
        } else {
            if (letterIndex == words[wordIndex].length - 1) {
                setLetterIndex(0);
                setWordIndex(wordIndex + 1);
            } else {
                setLetterIndex(letterIndex + 1);
            }
            setCountTypingKeys(countTypingKeys + 1);
        }
        setInputText(value);
        if ((wordIndex - 1) == lines[lines.length - 1].endIndex - 2 && letterIndex == words[wordIndex].length - 1) {
            setIsRunning(false);
            props.setNewSpeed((countCorrectTypingKeys / 5) / (elapsedTime / 60));
            console.log("correct:" + countCorrectTypingKeys + " uncorrect:" + countTypingKeys + " accuracy:" + ((countCorrectTypingKeys / countTypingKeys) * 100))
            props.newAccuracy((countCorrectTypingKeys / countTypingKeys) * 100)
            resetAllData();
            return;
        }
        // moveCursor(value.length);
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
    }, [words]);
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
                            if (letter == ' ') {
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
            <div className="nested-text-container">
                <div className={isFocused ? "text focused" : "text"}>
                    <div className="words" ref={containerRef}>
                        {letterComponents}
                    </div>
                    {/* {isCursorVisible ?
                        <div className="cursor"></div>
                        : <></>   
                    } */}
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
})

export default Typing;