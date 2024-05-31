import {Link} from "react-router-dom";

export default function Header({isDarkTheme}) {

    return (
        <header className={`main-header ${isDarkTheme ? 'dark' : ''}`}>
            <div>
                <Link to="/" className="nav-link">
                <img src="src/assets/logo.png" alt="logo" className={`logo ${isDarkTheme ? 'dark' : ''}`}/>
                </Link>
            </div>
            <div className="user-panel">
                <span><Link to="/login" className={`nav-link ${isDarkTheme ? 'dark' : ''}`}>Sign in</Link></span>
            </div>
        </header>
    )
}