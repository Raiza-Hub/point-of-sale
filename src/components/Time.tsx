"use client"

import React, { useState, useEffect } from 'react';

const CurrentTime = () => {
    const [time, setTime] = useState({ hoursMinutes: '', period: '' });

    // Function to get the current time
    const getCurrentTime = () => {
        const now = new Date();

        let hours = now.getHours();
        const minutes = now.getMinutes();

        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        const hoursMinutes = `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}`;

        return { hoursMinutes, period };
    };

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(getCurrentTime());
        }, 60000); // Update every 60 seconds

        // Set initial time
        setTime(getCurrentTime());

        // Cleanup interval on unmount
        return () => clearInterval(timer);
    }, []);

    return (
        <div className='flex items-center gap-1 text-sm font-medium'>
            <div>{time.hoursMinutes}</div>
            <div className='text-gray-400'>{time.period}</div>
        </div>
    );
};

export default CurrentTime;
