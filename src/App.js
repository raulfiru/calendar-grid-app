import React from 'react';
import ReactDOM from 'react-dom';
import CalendarGrid from './CalendarGrid'; // Ensure the path is correct

const App = () => {
    return (
        <div className="App">
            <h1>Monthly Availability Calendar</h1>
            {/* You can dynamically set the year and month or use static values */}
            <CalendarGrid year={2023} month={5} />
        </div>
    );
}

export default App;
