import '../styles/typingresult.scss';
export default function TypingResult({ speed, prevSpeed, accuracy, prevAccuracy,isDarkTheme }) {
    const getColorClass = (current, previous) => {
        if (current > previous) {
            return 'positive';
        } else if (current < previous) {
            return 'negative';
        }
        return '';
    };

    return (
        <div className="empty-middle">
            <div>
                <span className={`span-name ${isDarkTheme ? 'dark' : ''}`}>
                    Speed:
                </span>
                <span className="speed-value">{speed.toFixed(1)}wpm</span> (
                <span className={getColorClass(speed, prevSpeed)}>
                    {speed - prevSpeed >= 0 ? '↑+' : '↓'}{(speed - prevSpeed).toFixed(1)}wpm
                </span>)
            </div>
            <div>
                <span className={`span-name ${isDarkTheme ? 'dark' : ''}`}>
                    Accuracy:
                </span>
                <span className="accuracy-value">{accuracy.toFixed(1)}%</span> (
                <span className={getColorClass(accuracy, prevAccuracy)}>
                    {accuracy - prevAccuracy >= 0 ? '↑+' : '↓'}{(accuracy - prevAccuracy).toFixed(1)}%
                </span>)
            </div>
        </div>
    )
}