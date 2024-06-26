import React, { useState, useEffect } from 'react';
import { getWordSets, generateRandomWords } from "../api/WordsAPI.jsx";
import "../styles/textchoice.scss";
import { getRandomText } from "../api/TextAPI.jsx";

export default function TextChoice({ isDarkTheme }) {
    const [selectedOption, setSelectedOption] = useState(() => localStorage.getItem('selectedTextType') || 'Texts');
    const [savedSettings, setSavedSettings] = useState(() => JSON.parse(localStorage.getItem('wordChoiceSettings')) || {});
    const [textSavedSettings, setTextSavedSettings] = useState(() => JSON.parse(localStorage.getItem('textChoiceSettings')) || {});
    const [wordSets, setWordSets] = useState([]);
    const [selectedWordSet, setSelectedWordSet] = useState(savedSettings.selectedWordSet || '');
    const [numWords, setNumWords] = useState(savedSettings.numWords || 10);
    const [numSignsPercent, setNumSignsPercent] = useState(savedSettings.numSignsPercent || 0);
    const [numUpperCasePercent, setNumUpperCasePercent] = useState(savedSettings.numUpperCasePercent || 0);
    const [doubleEveryWord, setDoubleEveryWord] = useState(savedSettings.doubleEveryWord || false);
    const [generatedWords, setGeneratedWords] = useState('');
    const [textDifficulty, setTextDifficulty] = useState(() => textSavedSettings.textDifficulty || "Easy");
    const [textLanguage, setTextLanguage] = useState(() => textSavedSettings.textLanguage || "English");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);


    useEffect(() => {
        const fetchWordSets = async () => {
            try {
                const wordSets = await getWordSets();
                setWordSets(wordSets);
                if (wordSets.length > 0 && selectedWordSet === '') {
                    setSelectedWordSet(wordSets[0]);
                }
            } catch (error) {
                console.error('Failed to fetch word sets:', error);
            }
        };
        fetchWordSets();
    }, []);

    useEffect(() => {
        localStorage.setItem('selectedTextType', selectedOption);
    }, [selectedOption]);

    useEffect(() => {
        const settings = {
            textDifficulty,
            textLanguage,
        };
        localStorage.setItem('textChoiceSettings', JSON.stringify(settings));
    }, [textDifficulty, textLanguage]);

    useEffect(() => {
        const settings = {
            selectedWordSet,
            numWords,
            numSignsPercent,
            numUpperCasePercent,
            doubleEveryWord,
        };
        localStorage.setItem('wordChoiceSettings', JSON.stringify(settings));
    }, [selectedWordSet, numWords, numSignsPercent, numUpperCasePercent, doubleEveryWord]);


    const handleGenerateWords = async () => {
        const validNumWords = Math.max(1, Math.min(numWords, 999));
        setNumWords(validNumWords);

        try {
            const words = await generateRandomWords({
                wordSetName: selectedWordSet,
                numWords: validNumWords,
                numSignsPercent,
                numUpperCasePercent,
                doubleEveryWord
            });
            setGeneratedWords(words.content);
        } catch (error) {
            console.error('Failed to generate random words:', error);
        }
    };

    const handleGenerateText = async () => {
        try {
            const text = await getRandomText( textDifficulty, textLanguage);
            setGeneratedWords(text);
        } catch (error) {
            console.error('Failed to generate random text:', error);
        }
    };

    const openModal = () => {
        setIsModalVisible(true);
        setTimeout(() => setIsModalOpen(true), 0);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setIsModalVisible(false), 300);
    };

    const saveSettingsWord = () => {
        const settingsWord = {
            selectedWordSet,
            numWords,
            numSignsPercent,
            numUpperCasePercent,
            doubleEveryWord
        };
        localStorage.setItem('wordChoiceSettings', JSON.stringify(settingsWord));
        closeModal();
    };
    const saveSettingsText = () => {
        const settingsText = {
            textDifficulty,
            textLanguage
        };
        localStorage.setItem('textChoiceSettings', JSON.stringify(settingsText));
        closeModal();
    };

    const handleBackgroundClick = (e) => {
        if (e.target.className.includes('modal')) {
            closeModal();
        }
    };

    return (
        <div>
            <div className="settings-text">
                <div className={`settings-container ${isDarkTheme ? 'dark' : ''}`} onClick={openModal}>
                    <img src="/src/assets/settings.png" alt="settings" className="settings-img" />
                    <span className="settings-text">Text Settings</span>
                </div>
            </div>
            {isModalVisible && (
                <div className={`modal ${isModalOpen ? 'open' : ''} ${isDarkTheme ? 'dark' : ''}`} onClick={handleBackgroundClick}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h1 className='title'>Selected text type:</h1>
                        <div className="modal-grid">
                            <button
                                className={`selection-button ${selectedOption === 'Words' ? 'active' : ''}`}
                                onClick={() => setSelectedOption('Words')}
                            >
                                Words
                            </button>
                            <button
                                className={`selection-button ${selectedOption === 'Texts' ? 'active' : ''}`}
                                onClick={() => setSelectedOption('Texts')}
                            >
                                Texts
                            </button>
                        </div>
                        <div className="modal-grid">
                            {selectedOption === 'Words' && (
                                <div className="settings-column">
                                    <h1 className='title'>Word Settings</h1>
                                    <div>
                                        <label>Word Set:</label>
                                        <select
                                            className="custom-select"
                                            value={selectedWordSet}
                                            onChange={(e) => setSelectedWordSet(e.target.value)}
                                        >
                                            {wordSets.map((set) => (
                                                <option key={set} value={set}>
                                                    {set.toString().replace(".txt", "")}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Number of Words:</label>
                                        <div className="modal-grid">
                                            <input
                                                className="custom-input"
                                                type="number"
                                                value={numWords}
                                                max={999} min={1}
                                                onChange={(e) => {
                                                    let value = parseInt(e.target.value, 10);
                                                    if (value < 1 || isNaN(value)) value = 1;
                                                    if (value > 999) value = 999;
                                                    setNumWords(value);
                                                }}
                                            />
                                            <label style={{alignContent: "center"}}>(standard 10, limit from 1 to
                                                999)</label>
                                        </div>
                                    </div>
                                    <div>
                                        <label>Number of Signs Percent: {numSignsPercent}%</label>
                                        <input
                                            className="custom-slider"
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={numSignsPercent}
                                            onChange={(e) => setNumSignsPercent(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Number of Upper Case Percent: {numUpperCasePercent}%</label>
                                        <input
                                            className="custom-slider"
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={numUpperCasePercent}
                                            onChange={(e) => setNumUpperCasePercent(e.target.value)}
                                        />
                                    </div>
                                    <div className="modal-grid" style={{marginTop: "10px", marginBottom: "10px"}}>
                                        <label>Double Every Word:</label>
                                        <input
                                            className="custom-checkbox"
                                            type="checkbox"
                                            checked={doubleEveryWord}
                                            onChange={(e) => setDoubleEveryWord(e.target.checked)}
                                        />
                                    </div>
                                    <div className="modal-grid" style={{width: '95%'}}>
                                        <button className="custom-button" onClick={handleGenerateWords}>Test</button>
                                        <button className="custom-button" onClick={saveSettingsWord}>Submit</button>
                                    </div>
                                </div>
                            )}
                            {selectedOption === 'Texts' && (
                                <div className="settings-column">
                                    <h1 className='title'>Text Settings</h1>
                                    <p>Text difficulty:</p>
                                    <select
                                        className="custom-select"
                                        value={textDifficulty}
                                        onChange={(e) => setTextDifficulty(e.target.value)}
                                    >
                                        <option key={"Easy"} value={"Easy"}>Easy</option>
                                        <option key={"Medium"} value={"Medium"}>Medium</option>
                                        <option key={"Hard"} value={"Hard"}>Hard</option>
                                    </select>
                                    <p>Text language:</p>
                                    <select
                                        className="custom-select"
                                        value={textLanguage}
                                        onChange={(e) => setTextLanguage(e.target.value)}
                                    >
                                        <option key={"English"} value={"English"}>English</option>
                                        <option key={"Ukrainian"} value={"Ukrainian"}>Ukrainian</option>
                                    </select>
                                    <div className="modal-grid" style={{width: '95%'}}>
                                        <button className="custom-button" onClick={handleGenerateText}>Test</button>
                                        <button className="custom-button" onClick={saveSettingsText}>Submit</button>
                                    </div>
                                </div>
                            )}
                            <div className="output-column">
                                <h1 className='title'>Text Sample</h1>
                                <div className="generated-words-panel">
                                    <p>{generatedWords}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
