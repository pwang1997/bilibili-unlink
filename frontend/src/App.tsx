import { useCallback, useRef, useState } from 'react';
import { DissociateOrphanFav } from "../wailsjs/go/main/App";
import './App.css';

export default function App() {
    const [requestState, setRequestState] = useState<string>('');

    const jctRef = useRef();
    const fidRef = useRef();
    const mediumIdRef = useRef();

    const handleUpdateJct = useCallback((e: any) => {
        jctRef.current = e.target.value;
    }, [])

    const handleUpdateFid = useCallback((e: any) => {
        fidRef.current = e.target.value;
    }, []);

    const handleUpdateMediumIdRef = useCallback((e: any) => {
        mediumIdRef.current = e.target.value;
    }, []);

    const handleDissociateOrphanFav = async () => {
        await DissociateOrphanFav(jctRef.current ?? '', fidRef.current ?? '', mediumIdRef.current ?? '').then((res: any) => {
            console.log(res);
        })
    }
    const handleOnClick = () => {
        setRequestState("IN_PROGRESS");

        handleDissociateOrphanFav();
    }

    // get bili_jct from Cookies: https://space.bilibili.com

    // get fid from url

    // get mediumId from Url

    return (
        <div id="App">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px", margin: "auto" }}>
                <div id="bili-jct-input" className="input-box" style={{ display: "flex", justifyContent: "space-between" }}>
                    <label htmlFor='bili-jct'>Cookie Token[bili_jct]</label>
                    <input id="bili-jct" className="input" onChange={handleUpdateJct} autoComplete="off" name="input" type="text" />
                </div>

                <div id="bili-fid-input" className="input-box" style={{ display: "flex", justifyContent: "space-between" }}>
                    <label htmlFor='bili-fid'>Fid</label>

                    <input id="bili-fid" className="input" onChange={handleUpdateFid} autoComplete="off" name="input" type="text" />
                </div>

                <div id="bili-medium-id-input" className="input-box" style={{ display: "flex", justifyContent: "space-between" }}>
                    <label htmlFor='bili-medium-id'>Medium Id</label>

                    <input id="bili-medium-id" className="input" onChange={handleUpdateMediumIdRef} autoComplete="off" name="input" type="text" />
                </div>
            </div>

            <button className="btn" onClick={handleOnClick} disabled={requestState === 'IN_PROGRESS'}>Submit</button>

        </div>
    )
}
