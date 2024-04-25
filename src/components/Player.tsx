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

const colorArrayValuesMap = Object.values(IListCharacter)
    .map(value => ({ label: value, value }));

console.log(colorArrayValuesMap, "colorArrayValuesMap")
console.log(STEP_ACTION, "STEP_ACTION")
function Player({ idUser, nameCharacter, flipPlayer = false }: IPlayer) {
    const stepAction = STEP_ACTION[nameCharacter];
    const actionDetail = ACTION_DETAIL[nameCharacter];
    console.log(stepAction, "stepAction")
    const [action, setAction] = useState<IListValueAction>(IListValueAction.idle);
    const [stepIdle, setStepIdle] = useState<number>(stepAction[action]);
    let timeOut: ReturnType<typeof setTimeout>;
    const changeAction = (value: IListValueAction) => {
        setAction(() => value)
        setStepIdle(() => stepAction[value])
    }

    const changeActionImg = () => {
        const valueImg = `imgs/figure/${nameCharacter}/${action}.png`;
        let character = '--img1';
        if (idUser === 2) {
            character = '--img2';
        }
        const second = actionDetail[action]?.second || 1;

        if (action !== IListValueAction.idle) {
            timeOut = setTimeout(() => {
                changeAction(IListValueAction.idle)
            }, second * 1000);
        }
        else {
            console.log("------------")
            clearTimeout(timeOut);
        }

        document.documentElement.style.setProperty(character, `url(${valueImg})`);
        document.documentElement.style.setProperty("--second", `${second}s`);
    }

    const keydownFunc = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            console.log("Down")
            changeAction(IListValueAction.atk1)
        }
        else {
            console.log("Down")
        }
    }, []);

    const keyupFunc = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            console.log("Up")
            // changeAction(IListValueAction.idle)
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