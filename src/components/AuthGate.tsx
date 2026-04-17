import * as React from 'react';
import {useEffect, useState} from 'react';
import './AuthGate.css';
import {sha256} from "js-sha256";

const STORAGE_KEY = 'cake-emi-auth';

const CORRECT_HASH = 'f3383a2c10b394ba40e0e0202d26d3b42b8ef5330c4858961af26c0d6ed65552';

export default function AuthGate({children}: { children: React.ReactNode }) {
    const [unlocked, setUnlocked] = useState(false);
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem(STORAGE_KEY) === CORRECT_HASH) {
            setUnlocked(true);
        }
    }, []);

    const attempt = () => {
        if (sha256(input) === CORRECT_HASH) {
            sessionStorage.setItem(STORAGE_KEY, CORRECT_HASH);
            setUnlocked(true);
        } else {
            setError(true);
            setShake(true);
            setInput('');
            setTimeout(() => setShake(false), 600);
        }
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') attempt();
    };

    if (unlocked) return <>{children}</>;

    return (
        <div className="auth">
            <div className={`auth__card ${shake ? 'shake' : ''}`}>
                <div className="auth__icon">🎂</div>
                <h1 className="auth__title">Cake Emi</h1>
                <p className="auth__sub">This site is under construction.<br/>Enter the password to continue.</p>
                <input
                    className={`auth__input ${error ? 'error' : ''}`}
                    type="password"
                    placeholder="Password"
                    value={input}
                    autoFocus
                    onChange={e => {
                        setInput(e.target.value);
                        setError(false);
                    }}
                    onKeyDown={handleKey}
                />
                {error && <p className="auth__error">Incorrect password</p>}
                <button className="auth__btn" onClick={attempt}>Enter →</button>
            </div>
        </div>
    );
}