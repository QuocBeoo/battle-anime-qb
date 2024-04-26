import { useCallback, useEffect, useState } from "react";
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

function Player({ idUser, nameCharacter, flipPlayer = false }: IPlayer) {
    // Number of photos per frame
    const stepAction = STEP_ACTION[nameCharacter];

    // Second, dmg, range, hp
    const actionDetail = ACTION_DETAIL[nameCharacter];

    // Current action
    const [action, setAction] = useState<IListValueAction>(actionClassic);

    // Current number of photos per frame
    const [stepIdle, setStepIdle] = useState<number>(stepAction[action]);

    // Reset action => clearTimeout
    let timeOut: ReturnType<typeof setTimeout>;

    // Maximum wait time for next lock
    const [delta, setDelta] = useState<number>(500);

    // Time of last key press
    const [lastKeypressTime, setLastKeypressTime] = useState<number>(0);

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
            }, second * 1000);
            console.log(second, "second------------")
        }
        else {
            console.log("------------")
            clearTimeout(timeOut);
        }

        // Change --img
        document.documentElement.style.setProperty(character, `url(${valueImg})`);
        // Change --second
        document.documentElement.style.setProperty("--second", `${second}s`);
    }

    const keydownFunc = useCallback((event: KeyboardEvent) => {
        console.log(event, "event.key")
        // atk
        if (event.key.toLowerCase() === "q") {
            console.log("Down")

            let keypressTime: any = new Date();
            if (keypressTime - lastKeypressTime <= delta) {

                console.log("Double---------")
                keypressTime = 0;
            }
            setLastKeypressTime(keypressTime);

            changeAction(IListValueAction.atk1)
        }
        else {
            console.log("Down")
        }
    }, []);

    const keyupFunc = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            console.log("Up")
            // changeAction(actionClassic)
        }
        else {
            console.log("Up")
        }
    }, []);

    useEffect(() => {
        changeActionImg()
    }, [action]);

    useEffect(() => {
        document.addEventListener("keydown", keydownFunc, false);
        document.addEventListener("keyup", keyupFunc, false);

        return () => {
            document.removeEventListener("keydown", keydownFunc, false);
            document.removeEventListener("keyup", keyupFunc, false);
        };
    }, [keydownFunc, keyupFunc]);

    return (
        <div id={`player${idUser}`} className={`player steps-${stepIdle} ${flipPlayer ? "flip-player" : ""}`}></div>
    )
}

export default Player