import React from 'react';
import { BookOpenIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function ScheduleTimeline({ schedule, currentTime = new Date() }) {
    // Simple mock logic to determine current subject based on time
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    return (
        <div className="relative border-l-2 border-gray-700 ml-3 py-2">
            {schedule.map((item, index) => {
                // Determine state: past, active, future
                const isPast = item.endTime < currentTimeStr;
                const isActive = item.startTime <= currentTimeStr && item.endTime >= currentTimeStr;
                
                let dotColor = 'bg-gray-600 border-gray-500';
                let textColor = 'text-gray-500';
                let iconColor = 'text-gray-600';
                
                if (isActive) {
                    dotColor = 'bg-accent-cyan border-white shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse';
                    textColor = 'text-white font-bold';
                    iconColor = 'text-accent-cyan';
                } else if (!isPast) {
                    dotColor = 'bg-gray-800 border-gray-400';
                    textColor = 'text-gray-300';
                    iconColor = 'text-gray-400';
                }

                return (
                    <div key={index} className="mb-6 ml-6 relative">
                        {/* Dot */}
                        <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 ${dotColor}`}></div>
                        
                        <div className={`flex flex-col sm:flex-row sm:items-center gap-2 ${isActive ? 'glass-card p-3 -mt-2 -ml-2' : ''}`}>
                            <div className="flex items-center gap-2 text-xs font-game text-gray-400 w-24">
                                <ClockIcon className="w-4 h-4" />
                                <span>{item.startTime}</span>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${textColor}`}>
                                <BookOpenIcon className={`w-5 h-5 ${iconColor}`} />
                                <div>
                                    <p className="text-sm">{item.subject}</p>
                                    <p className="text-xs text-gray-500">{item.room}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
