// Footer.js

import React from 'react';

export default function Footer({ isSoundOn, toggleSound, isDarkTheme, toggleTheme }) {

    return (
        <footer className={`main-footer ${isDarkTheme ? 'dark' : ''}`}>
            <div className="link-container">
                <div className="link">
                    <img src="src/assets/discord.png" alt="discord" className={`img ${isDarkTheme ? 'dark' : ''}`}/>
                    <span>discord</span>
                </div>
                <div className="link">
                    <img src="src/assets/instagram.png" alt="instagram" className={`img ${isDarkTheme ? 'dark' : ''}`}/>
                    <span>instagram</span>
                </div>
                <div className="link">
                    <img src="src/assets/donation.png" alt="donation" className={`img ${isDarkTheme ? 'dark' : ''}`}/>
                    <span>donation</span>
                </div>
            </div>
            <div className="link-container">
                <div className="change-button" onClick={toggleTheme}>
                    {isDarkTheme ? <img src="./src/assets/sun.png" alt="soundOn"
                                        className={`img ${isDarkTheme ? 'dark' : ''}`}/> :
                        <img src="./src/assets/moon.png" alt="soundOn"/>}
                </div>
                <div className="change-button" onClick={toggleSound} style={{marginRight: "49px"}}>
                    {isSoundOn ? <img src="./src/assets/sound-on.svg" alt="soundOn"
                                      className={`img ${isDarkTheme ? 'dark' : ''}`}/> :
                        <img src="./src/assets/sound-off.svg" alt="soundOn"
                             className={`img ${isDarkTheme ? 'dark' : ''}`}/>}
                </div>
            </div>
        </footer>
    );
}
