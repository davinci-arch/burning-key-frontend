
export default function Footer({ isSoundOn, setSoundState }) {


    const handleSound = () => {
        setSoundState(!isSoundOn);
    }

    return (
        <footer className="main-footer">
            <div className="link-container">
                <div className="link">
                    <img src="/src/assets/discord.png" alt="discord" />
                    <span>discord</span>
                </div>
                <div className="link">
                    <img src="/src/assets/instagram.png" alt="instagram" />
                    <span>instagram</span>
                </div>
                <div className="link">
                    <img src="/src/assets/donation.png" alt="donation" />
                    <span>donation</span>
                </div>
            </div>

            <div className="sound-button" onClick={handleSound}>
                {isSoundOn ? <img src="/src/assets/sound-on.svg" alt="soundOn" /> : <img src="/src/assets/sound-off.svg" alt="soundOn" />}
            </div>
        </footer>


    )
}