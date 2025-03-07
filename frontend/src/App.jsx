import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [text, setText] = useState('');
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        const populateVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        // Populate voices immediately and when they change
        populateVoices();
        window.speechSynthesis.onvoiceschanged = populateVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null; // Cleanup
        };
    }, []);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleVoiceChange = (e) => {
        setSelectedVoice(e.target.value);
    };

    const speakText = () => {
        if (!text) return;

        // Stop any currently speaking utterances
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Find the selected voice object
        const voice = voices.find((v) => v.name === selectedVoice);
        if (voice) {
            utterance.voice = voice;
        }

        utterance.onstart = () => {
            setIsSpeaking(true);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const stopText = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };


    return (
        <div className="app-container">
            <h1>Text to Speech</h1>
            <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter text to speak..."
            />
            <select value={selectedVoice} onChange={handleVoiceChange}>
                <option value="">Select a Voice</option>
                {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                    </option>
                ))}
            </select>
            <div className="button-container">
                <button className="speak-button" onClick={speakText} disabled={isSpeaking}>
                    {isSpeaking ? 'Speaking...' : 'Speak'}
                </button>
                <button className="stop-button" onClick={stopText} disabled={!isSpeaking}>
                    Stop
                </button>
            </div>
        </div>
    );
}

export default App;
