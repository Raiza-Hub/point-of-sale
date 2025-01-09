const DayAndDate = () => {
    // Function to get the formatted day and date
    const getDayAndDate = () => {
        const today = new Date();

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
        const monthsOfYear = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const dayName = daysOfWeek[today.getDay()];
        const monthName = monthsOfYear[today.getMonth()];
        const date = today.getDate();
        const year = today.getFullYear();

        return `${dayName}, ${date}  ${monthName}, ${year}`;
    };

    return (
        <div>
            <h1 className="text-sm font-medium pr-2">{getDayAndDate()}</h1>
        </div>
    );
};

export default DayAndDate;
