
export default function TypingResult({speed, prevSpeed, accuracy, prevAccuracy}) {
    const getColorClass = (current, previous) => {
        if (current > previous) {
            return 'positive';
        } else if (current < previous) {
            return 'negative';
        }
        return '';
    };

    return (
        <div>
            <div className="speed-container">
                <span style={{ marginLeft: '25px', marginRight: '3px', color: 'indigo', fontSize: '17px' }}>
                    Speed:
                </span>
                <span className="speed-value">{speed.toFixed(1)}wpm</span> (
                <span className={getColorClass(speed, prevSpeed)}>
                    {speed - prevSpeed >= 0 ? '↑+' : '↓'}{(speed - prevSpeed).toFixed(1)}wpm
                </span>)
            </div>
            <div className="accuracy-container">
                <span style={{ marginLeft: '30px', marginRight: '3px', color: 'indigo', fontSize: '17px' }}>
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