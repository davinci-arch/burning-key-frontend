import {Link} from "react-router-dom";
export default function Header() {

    return (
        <header className="main-header">
            <div>
                <Link to="/" className="nav-link">
                <img src="/src/assets/logo.png" alt="logo" className="logo" />
                </Link>
            </div>
            <div className="user-panel">
                <span><Link to="/login" className="nav-link">Sign in</Link></span>
            </div>
        </header>
    )
}