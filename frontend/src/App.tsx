import { useCallback, useRef, useState } from 'react';
import { DissociateOrphanFav } from "../wailsjs/go/main/App";
import './App.css';

export default function App() {
    const [requestState, setRequestState] = useState<string>('');

    const mediumIdRef = useRef();

    const handleUpdateMediumIdRef = useCallback((e: any) => {
        mediumIdRef.current = e.target.value;
    }, []);

    const handleDissociateOrphanFav = async () => {
        await DissociateOrphanFav(mediumIdRef.current ?? '').then((res: any) => {
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
                <div id="bili-medium-id-input" className="input-box" style={{ display: "flex", justifyContent: "space-between" }}>
                    <label htmlFor='bili-medium-id'>Medium Id</label>

                    <input id="bili-medium-id" className="input" onChange={handleUpdateMediumIdRef} autoComplete="off" name="input" type="text" />
                </div>
            </div>

            <button className="btn" onClick={handleOnClick}>Submit</button>

        </div>
    )
}
