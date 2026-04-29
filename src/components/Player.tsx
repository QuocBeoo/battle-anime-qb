import { useEffect, useRef, useState } from "react";
import { IListCharacter } from "../constants/listCharacter";
import { CHARACTER_SPRITE_INSET } from "../constants/characterVisualBounds";
import { STEP_ACTION } from "../constants/stepAction";
import { IListValueAction } from "../constants/interface";
import { ACTION_DETAIL } from "../constants/actionDetail";

interface IPlayer {
    idUser: number,
    nameCharacter: IListCharacter,
    flipPlayer?: boolean,
}

const actionClassic = IListValueAction.idle;

function Player({ idUser, nameCharacter, flipPlayer = false }: IPlayer) {
    // Number of photos per frame
    const stepAction = STEP_ACTION[nameCharacter];

    // Second, dmg, range, hp
    const actionDetail = ACTION_DETAIL[nameCharacter];

    // Current action
    const [action, setAction] = useState<IListValueAction>(actionClassic);

    // Current number of photos per frame
    const [stepIdle, setStepIdle] = useState<number>(stepAction[action]);

    // Horizontal offset (px); player has left:0, translateX moves along container width
    const [offsetX, setOffsetX] = useState(0);

    // Sprite faces left on screen when true (combined with flipPlayer for P2-style spawn)
    const [facingLeft, setFacingLeft] = useState(false);

    const playerRef = useRef<HTMLDivElement>(null);
    const spriteInsetRef = useRef(CHARACTER_SPRITE_INSET[nameCharacter]);
    spriteInsetRef.current = CHARACTER_SPRITE_INSET[nameCharacter];

    // Save prev key code
    const prevKey = useRef<string | null>(null);

    const rightHeld = useRef(false);
    const leftHeld = useRef(false);
    const runRaf = useRef<number | null>(null);
    const holdStartMs = useRef(0);
    const lastFrameMs = useRef(0);

    // Reset action => clearTimeout
    let timeOut: ReturnType<typeof setTimeout>;

    // Time of last key press
    // const lastKeypressTime = useRef<number>(Date.now());

    // console.log(lastKeypressTime, "lastKeypressTime")

    const changeAction = (value: IListValueAction) => {
        setAction(() => value)
        setStepIdle(() => stepAction[value])
    }

    const changeActionRef = useRef(changeAction);
    changeActionRef.current = changeAction;

    const changeActionImg = () => {

        // Check user action
        const valueImg = `imgs/figure/${nameCharacter}/${action}.png`;
        let character = '--img1';
        if (idUser === 2) {
            character = '--img2';
        }

        // ClearTimeout time
        const second = actionDetail[action]?.second || 1;

        // Once done will reset the action (run is cleared on keyup, not by timer)
        if (action !== actionClassic && action !== IListValueAction.run) {
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
        const clampOffsetX = (next: number) => {
            const el = playerRef.current;
            const parent = el?.offsetParent as HTMLElement | undefined;
            const pw = el?.offsetWidth ?? 375;
            const cw = parent?.clientWidth ?? window.innerWidth;
            const { left: insL, right: insR } = spriteInsetRef.current;
            const minX = -insL;
            const maxX = Math.max(minX, cw - pw + insR);
            return Math.max(minX, Math.min(maxX, next));
        };

        const stopRunMove = () => {
            rightHeld.current = false;
            leftHeld.current = false;
            lastFrameMs.current = 0;
            if (runRaf.current != null) {
                cancelAnimationFrame(runRaf.current);
                runRaf.current = null;
            }
        };

        const tick = (t: number) => {
            const dir = leftHeld.current ? -1 : rightHeld.current ? 1 : 0;
            if (dir === 0) {
                runRaf.current = null;
                return;
            }
            if (lastFrameMs.current === 0) {
                lastFrameMs.current = t;
                runRaf.current = requestAnimationFrame(tick);
                return;
            }
            const dt = Math.min(40, t - lastFrameMs.current);
            lastFrameMs.current = t;
            const held = t - holdStartMs.current;
            const pxPerSec = Math.min(420, 150 + held * 0.35);
            const dx = (pxPerSec * dt) / 1000;
            setOffsetX((x) => clampOffsetX(x + dir * dx));
            runRaf.current = requestAnimationFrame(tick);
        };

        const startRun = (dir: 1 | -1) => {
            if (dir === 1) {
                rightHeld.current = true;
                leftHeld.current = false;
                setFacingLeft(false);
            } else {
                leftHeld.current = true;
                rightHeld.current = false;
                setFacingLeft(true);
            }
            holdStartMs.current = performance.now();
            lastFrameMs.current = 0;
            setOffsetX((x) => clampOffsetX(x + dir * 5));
            changeActionRef.current(IListValueAction.run);
            if (runRaf.current == null) {
                runRaf.current = requestAnimationFrame(tick);
            }
        };

        const keydownFunc = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                if (event.repeat) return;
                startRun(1);
                prevKey.current = event.key;
                return;
            }
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                if (event.repeat) return;
                startRun(-1);
                prevKey.current = event.key;
                return;
            }

            if (event.key === "ArrowDown" && prevKey.current === "q" || prevKey.current === "ArrowDown" && event.key.toLowerCase() === "q") {
                changeActionRef.current(IListValueAction.atk2)
            }
            else if (event.key.toLowerCase() === "p") {
                if (!event.repeat) changeActionRef.current(IListValueAction.atk2)
            }
            else if (event.key.toLowerCase() === "o") {
                if (!event.repeat) changeActionRef.current(IListValueAction.atk1)
            }
            else if (event.key.toLowerCase() === "q") {
                changeActionRef.current(IListValueAction.atk1)
            }
            prevKey.current = event.key;
        }

        const keyupFunc = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                rightHeld.current = false;
                if (!leftHeld.current) {
                    if (runRaf.current != null) {
                        cancelAnimationFrame(runRaf.current);
                        runRaf.current = null;
                    }
                    lastFrameMs.current = 0;
                    changeActionRef.current(IListValueAction.idle);
                } else {
                    setFacingLeft(true);
                    lastFrameMs.current = 0;
                    holdStartMs.current = performance.now();
                }
                return;
            }
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                leftHeld.current = false;
                if (!rightHeld.current) {
                    if (runRaf.current != null) {
                        cancelAnimationFrame(runRaf.current);
                        runRaf.current = null;
                    }
                    lastFrameMs.current = 0;
                    changeActionRef.current(IListValueAction.idle);
                } else {
                    setFacingLeft(false);
                    lastFrameMs.current = 0;
                    holdStartMs.current = performance.now();
                }
                return;
            }
            if (event.key.toLowerCase() === "q") {
                // reserved
            }
        }

        document.addEventListener("keydown", keydownFunc, false);
        document.addEventListener("keyup", keyupFunc, false);

        return () => {
            stopRunMove();
            document.removeEventListener("keydown", keydownFunc, false);
            document.removeEventListener("keyup", keyupFunc, false);
        };
    }, []);

    const spriteFlipped = flipPlayer !== facingLeft;
    const playerTransform = spriteFlipped
        ? `translateX(${offsetX}px) scaleX(-1)`
        : `translateX(${offsetX}px)`;

    return (
        <div
            ref={playerRef}
            id={`player${idUser}`}
            className={`player steps-${stepIdle}`}
            style={{ transform: playerTransform }}
        />
    )
}

export default Player