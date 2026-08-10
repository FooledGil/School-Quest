import React, { useRef } from 'react';
import { BookOpenIcon, ClockIcon } from '@heroicons/react/24/outline';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ScheduleTimeline({ schedule = [], currentTime = new Date() }) {
    const timelineRef = useRef(null);

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    useGSAP(() => {
        if (schedule.length > 0 && timelineRef.current) {
            const items = timelineRef.current.querySelectorAll('.timeline-item');
            gsap.fromTo(
                items,
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' }
            );
        }
    }, { dependencies: [schedule], scope: timelineRef });

    return (
        <div ref={timelineRef} className="relative border-l-2 border-slate-800 ml-3 py-2">
            {schedule.map((item, index) => {
                const isPast = item.endTime < currentTimeStr;
                const isActive = item.startTime <= currentTimeStr && item.endTime >= currentTimeStr;
                
                let dotColor = 'bg-slate-700 border-slate-600';
                let textColor = 'text-slate-500';
                let iconColor = 'text-slate-600';
                
                if (isActive) {
                    dotColor = 'bg-blue-500 border-white shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-pulse';
                    textColor = 'text-white font-bold';
                    iconColor = 'text-blue-400';
                } else if (!isPast) {
                    dotColor = 'bg-slate-900 border-slate-500';
                    textColor = 'text-slate-300';
                    iconColor = 'text-slate-400';
                }

                return (
                    <div key={index} className="timeline-item mb-6 ml-6 relative">
                        {/* Dot */}
                        <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 ${dotColor}`}></div>
                        
                        <div className={`flex flex-col sm:flex-row sm:items-center gap-2 ${isActive ? 'glass-card p-3 -mt-2 -ml-2 border-l-2 border-l-blue-500' : ''}`}>
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 w-24">
                                <ClockIcon className="w-4 h-4" />
                                <span>{item.startTime}</span>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${textColor}`}>
                                <BookOpenIcon className={`w-5 h-5 ${iconColor}`} />
                                <div>
                                    <p className="text-sm">{item.subject}</p>
                                    <p className="text-xs text-slate-400">{item.room}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
