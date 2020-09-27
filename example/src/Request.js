import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';

const RequestContext = React.createContext(null);
const RequestInfoContext = React.createContext(null);

/** @typedef {{
 *   id: number,
 *   duration: number,
 *   startTime: number,
 *   endTime: number,
 *   value: any,
 *   state: 'waiting' | 'success' | 'error',
 *   cancel: () => void
 * }} RequestInfo 
 */

/** @type {RequestInfo[]} */
const initReqs = [];

export function RequestProvider({ children }) {
    const idRef = useRef(1);
    const [reqs, setReqs] = useState(initReqs);

    const request = useCallback((value, time) => {
        if (typeof time !== 'number') {
            time = Math.ceil(Math.random() * 3000);
        }
        const id = idRef.current;
        idRef.current += 1;
        console.log(`Request ${id} start`);
        const response = new Promise((fulfill, reject) => {
            setReqs(reqs => [...reqs, {
                id,
                duration: time,
                startTime: Date.now(),
                endTime: Date.now() + time,
                value,
                state: 'waiting',
                cancel: () => reject(new Error("Simulated Network Error")),
            }]);
            setTimeout(() => fulfill(value), time);
        });
        
        response.then(() => {
            setReqs(reqs => {
                console.log(`Request ${id} complete`);
                const index = reqs.findIndex(req => req.id === id);
                if (index < 0) {
                    return reqs;
                }
                const n = [...reqs];
                n[index] = {
                    ...n[index],
                    state: 'success',
                    cancel: () => {},
                }
                return n;
            });
        }, () => {
            setReqs(reqs => {
                console.log(`Request ${id} error`);
                const index = reqs.findIndex(req => req.id === id);
                if (index < 0) {
                    return reqs;
                }
                const n = [...reqs];
                n[index] = {
                    ...n[index],
                    state: 'error',
                    cancel: () => {},
                }
                return n;
            });
        })
        return response;
    }, []);

    const clear = useCallback((id) => {
        if (typeof id !== "number") {
            setReqs(reqs => {
                reqs.forEach(req => req.cancel());
                return [];
            });
        }
    }, []);

    const r = useMemo(() => [request, clear], [request, clear]);

    return <RequestContext.Provider value={r}>
        <RequestInfoContext.Provider value={reqs}>
            {children}
        </RequestInfoContext.Provider>
    </RequestContext.Provider>
}

/**
 * @template T
 * @typedef { (v?: T | Promise<T>, t?: number) => Promise<T> } RequestFunction
 */

/**
 * @template T
 * @returns {[RequestFunction<T>, () => void]}
 */
export function useRequest() {
    return useContext(RequestContext);
}

/**
 * @returns {RequestInfo[]}
 */
export function useRequestInfo() {
    return useContext(RequestInfoContext);
}