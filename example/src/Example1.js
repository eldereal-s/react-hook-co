import React, { useEffect, useState } from 'react';
import { useRequest } from './Request';
import { useCoEffect } from './useCo';

export default function Example1(){
    const [mountCoEffect, setMountCoEffect] = useState(true);
    const [mountEffect, setMountEffect] = useState(true);
    return <div>
        <h2>Handle component mount & unmount</h2>
        <p>useCoEffect will cancel async process once component is unmounted. Fastly toggle the follow checkbox to see the difference. </p>
        <div style={{borderRadius: 5, background: '#f0f0f0', padding: 10, margin: '10px 0'}}>
            <div>I am <b>useCoEffect</b>. Unmounting me before complete will cancel the async process and everything goes right.</div>
            <div>
                <input type="checkbox" checked={mountCoEffect} onChange={e => setMountCoEffect(e.target.checked)}/> Mount me
            </div>
            {
                mountCoEffect && <CompUseCoEffect />
            }
        </div>
        <div style={{borderRadius: 5, background: '#f0f0f0', padding: 10, margin: '10px 0x'}}>
            <div>I am <b>useEffect</b>. Unmounting me before complete will cause <span style={{color:'red'}}>Warning: Can't perform a React state update on an unmounted component</span> in your console.</div>
            <div>
                <input type="checkbox" checked={mountEffect} onChange={e => setMountEffect(e.target.checked)}/> Mount me
            </div>    
            {
                mountEffect && <CompUseEffect />
            }
        </div>
    </div>
}

function CompUseCoEffect() {
    const [req] = useRequest();
    const [complete, setComplete] = useState(false);
    useCoEffect(function*(){
        yield req(null, 3000);
        setComplete(true);
    }, []);
    return <div>
        Request sent, completed: { complete ? 'true' : 'false' }
    </div>
}

function CompUseEffect() {
    const [req] = useRequest();
    const [complete, setComplete] = useState(false);
    useEffect(() => {
        (async () => {
            await req(null, 3000);
            setComplete(true);
        })();
    }, []);
    return <div>
        Request sent, completed: { complete ? 'true' : 'false' }
    </div>
}