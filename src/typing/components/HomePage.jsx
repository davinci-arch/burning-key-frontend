
import Header from "./Header"
import Footer from "./Footer"

import "../styles/mainpage.scss"
import Typing from "./Typing"
import Keyboard from "./Keyboard"
export default function HomePage() {

    return (
        <div className="home">
            <Header />
            <div className="toolbar-container">
                <div className="toolbar">
                    <div className="navigation">
                        <p>multiplayer</p>
                        <p>test</p>
                        <p>text</p>
                        <p>single</p>
                        <div className="animation move">navigation</div>
                    </div>
                    <span className="separator"></span>
                    <div className="empty-middle"></div>
                    <span className="separator"></span>
                    <div className="text-config">
                        <p>font</p>
                        <p>size</p>
                        <div className="animation move">style</div>
                    </div>
                </div>
            </div>
            <Typing />
            <div className="reset-text">
                <div className="reset-container">
                    <img src="src/assets/refresh-button.png" alt="refresh" className="reset-img" />
                    <span>reset text</span>
                </div>
            </div>
            <Keyboard />
            <Footer />
        </div>
    )

}