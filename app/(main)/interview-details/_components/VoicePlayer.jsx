'use client';
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function VoicePlayer({ audioUrl }) {
    const waveformRef = useRef(null); // ✅ correct ref
    const wavesurfer = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        if (waveformRef.current && !wavesurfer.current) {
            wavesurfer.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#cbd5e1',
                progressColor: '#0ea5e9',
                height: 50,
                barWidth: 2,
                responsive: true,
            });

            wavesurfer.current.load(audioUrl);

            wavesurfer.current.on('ready', () => {
                setDuration(wavesurfer.current.getDuration());
            });

            wavesurfer.current.on('audioprocess', () => {
                setCurrentTime(wavesurfer.current.getCurrentTime());
            });

            wavesurfer.current.on('finish', () => {
                setIsPlaying(false);
                setCurrentTime(0);
            });
        }
    }, [audioUrl]);

    const togglePlay = () => {
        if (wavesurfer.current) {
            wavesurfer.current.playPause();
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = String(Math.floor(time % 60)).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="flex items-center space-x-4 bg-white p-3 rounded-xl shadow-md w-[200px] md:w-[300px]">
            <button
                onClick={togglePlay}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center cursor-pointer hover:bg-sky-600 transition"
            >
                {isPlaying ? '⏸' : '▶️'}
            </button>
            <div className="flex-1">
                <div ref={waveformRef} />
            </div>
            <div className="text-sm text-slate-600 w-12 text-right">
                {formatTime(duration - currentTime)}
            </div>
        </div>
    );
}

// Use this where you need player
{/* <div className="flex items-center justify-center bg-slate-100">
    <VoicePlayer audioUrl="https://storage.vapi.ai/851c513f-9921-4f40-acfa-b00999d1f282-1745600361669-d6e432c6-f843-4f62-b7cb-aa013fdddec9-stereo.mp3" />
</div>; */}