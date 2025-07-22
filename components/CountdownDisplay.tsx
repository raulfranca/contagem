import React from 'react';

interface CountdownDisplayProps {
    hours: number;
    minutes: number;
    seconds: number;
}

const TimeSegment: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <span className="text-6xl md:text-7xl font-black text-teal-400 tracking-tighter tabular-nums">
            {String(value).padStart(2, '0')}
        </span>
        <span className="mt-1 text-sm md:text-base font-semibold text-slate-400 uppercase tracking-widest">
            {label}
        </span>
    </div>
);


const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ hours, minutes, seconds }) => (
    <div className="flex justify-center items-center gap-4 md:gap-8 w-full">
        <TimeSegment value={hours} label="Horas" />
        <span className="text-5xl md:text-6xl font-thin text-slate-600 -mt-8">:</span>
        <TimeSegment value={minutes} label="Minutos" />
        <span className="text-5xl md:text-6xl font-thin text-slate-600 -mt-8">:</span>
        <TimeSegment value={seconds} label="Segundos" />
    </div>
);

export default CountdownDisplay;
