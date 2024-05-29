import Header from './Header';
import Footer from './Footer';
import '../styles/mainpage.scss';
import Navigation from './Navigation';
import { useState } from 'react';
export default function HomePage() {
    const [isSoundOn, setSoundState] = useState(true);


    return (
        <div className="home">
            <Header />
            <Navigation isSoundOn={isSoundOn} />
            <Footer isSoundOn={isSoundOn} setSoundState={setSoundState} />
        </div>
    );
}
