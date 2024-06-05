import "../styles/signinpage.scss";
import { useState } from "react";
import Header from "./Header"
import Footer from "./Footer"

export default function SigninPage({ isDarkTheme, toggleTheme, isSoundOn, toggleSound }) {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (

        <div className={`signin ${isDarkTheme ? 'dark' : ''}`}>
            <Header isDarkTheme={isDarkTheme} />
            <div className="signin-container">
                <form onSubmit={handleSubmit} className="signin-form">
                    <label htmlFor="email">Sign-In with E-mail</label>
                    <input
                        type="email"
                        id="email"
                        placeholder={"Your e-mail address..."}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className={`submit-button ${isDarkTheme ? 'dark' : ''}`}>
                        <img src="src/assets/inputcursor.png" alt="donation" className={`img ${isDarkTheme ? 'dark' : ''}`} />
                        Sign-n In with E-mail
                    </button>
                </form>
                <div className="info-label">
                    <img src="src/assets/question.png" alt="Info" className={`info-icon ${isDarkTheme ? 'dark' : ''}`} />
                    <span className="info-text">Info</span>
                </div>
                <p className={`info-description ${isDarkTheme ? 'dark' : ''}`}>
                    Simple sign-in that does not use passwords. Just enter your e-mail address,
                    and we will send you a login link. Go to your inbox, click the link to create a new account or to open an existing account
                    for the e-mail address given. The link is temporary and expires in a few hours.
                    To sign-in again later, enter the same e-mail address, and we will send a new link for the same account.
                </p>
            </div>
            <Footer isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} isSoundOn={isSoundOn} toggleSound={toggleSound} />
        </div>
    );
}
