import { useCallback, useEffect, useRef, useState } from "react";
import { IListCharacter } from "../constants/listCharacter";
import { STEP_ACTION } from "../constants/stepAction";
import { IListValueAction } from "../constants/interface";
import { ACTION_DETAIL } from "../constants/actionDetail";

interface IPlayer {
    idUser: number,
    nameCharacter: IListCharacter,
    flipPlayer?: boolean,
}

const actionClassic = IListValueAction.run;
// Maximum wait time for next lock
const delta = 500;

function Player({ idUser, nameCharacter, flipPlayer = false }: IPlayer) {
    // Number of photos per frame
    const stepAction = STEP_ACTION[nameCharacter];

    // Second, dmg, range, hp
    const actionDetail = ACTION_DETAIL[nameCharacter];

    // Current action
    const [action, setAction] = useState<IListValueAction>(actionClassic);

    // Current number of photos per frame
    const [stepIdle, setStepIdle] = useState<number>(stepAction[action]);

    // Save prev key code
    const prevKey = useRef<string | null>(null);

    // Reset action => clearTimeout
    let timeOut: ReturnType<typeof setTimeout>;

    // Time of last key press
    // const lastKeypressTime = useRef<number>(Date.now());

    // console.log(lastKeypressTime, "lastKeypressTime")

    const changeAction = (value: IListValueAction) => {
        setAction(() => value)
        setStepIdle(() => stepAction[value])
    }

    const changeActionImg = () => {

        // Check user action
        const valueImg = `imgs/figure/${nameCharacter}/${action}.png`;
        let character = '--img1';
        if (idUser === 2) {
            character = '--img2';
        }

        // ClearTimeout time
        const second = actionDetail[action]?.second || 1;

        // Once done will reset the action
        if (action !== actionClassic) {
            timeOut = setTimeout(() => {
                changeAction(actionClassic)
                prevKey.current = null;
            }, second * 1000);
            // console.log(second, "second------------")
        }
        else {
            // console.log("------------")
            clearTimeout(timeOut);
        }

        // Change --img
        document.documentElement.style.setProperty(character, `url(${valueImg})`);
        // Change --second
        document.documentElement.style.setProperty("--second", `${second}s`);
    }



    useEffect(() => {
        changeActionImg()
    }, [action]);

    useEffect(() => {
        const keydownFunc = (event: KeyboardEvent) => {
            console.log(event, "event")
            console.log(prevKey, "prevKey")
            // atk
            if (event.key === "ArrowDown" && prevKey.current === "q" || prevKey.current === "ArrowDown" && event.key.toLowerCase() === "q") {
                changeAction(IListValueAction.atk2)
            }
            else if (event.key.toLowerCase() === "q") {
                changeAction(IListValueAction.atk1)
            }
            else {
                // console.log("Down")
            }
            prevKey.current = event.key;
        }

        const keyupFunc = (event: KeyboardEvent) => {
            // console.log(event, "event.key")
            // atk
            if (event.key.toLowerCase() === "q") {
                // console.log("Up")
            }
            else {
                // console.log("Up")
            }
        }

        document.addEventListener("keydown", keydownFunc, false);
        document.addEventListener("keyup", keyupFunc, false);

        return () => {
            document.removeEventListener("keydown", keydownFunc, false);
            document.removeEventListener("keyup", keyupFunc, false);
        };
    }, []);

    return (
        <div id={`player${idUser}`} className={`player steps-${stepIdle} ${flipPlayer ? "flip-player" : ""}`}></div>
    )
}

export default Player