import { useCallback, useEffect, useState } from "react";

interface IPlayer {
    idUser: number,
}

const INDEX_RESET = 1;

function Player({ idUser }: IPlayer) {
    // const [index, setIndex] = useState(INDEX_RESET);
    // console.log(index, "index")

    // const changeIndex = (value: number) => {
    //     setIndex(() => value)
    // }

    // const changeAction = () => {
    //     const valueImg1 = `imgs/figure/marco/player1-${index}.png`
    //     document.documentElement.style.setProperty('--img1', `url(${valueImg1})`);
    // }

    // const keydownFunc = useCallback((event: KeyboardEvent) => {
    //     if (event.key === "Escape") {
    //         console.log("Down")
    //         changeIndex(2)
    //     }
    //     else {
    //         console.log("Down")
    //         changeIndex(3)
    //     }
    // }, []);

    // const keydownUp = useCallback((event: KeyboardEvent) => {
    //     if (event.key === "Escape") {
    //         console.log("Up")
    //         changeIndex(INDEX_RESET)
    //     }
    //     else {
    //         console.log("Up")
    //         changeIndex(INDEX_RESET)
    //     }
    // }, []);

    // useEffect(() => {
    //     changeAction()
    // }, [index]);

    // useEffect(() => {
    //     document.addEventListener("keydown", keydownFunc, false);
    //     document.addEventListener("keyup", keydownUp, false);

    //     return () => {
    //         document.removeEventListener("keydown", keydownFunc, false);
    //         document.removeEventListener("keyup", keydownUp, false);
    //     };
    // }, [keydownFunc, keydownUp]);


    return (
        <div id={`player${idUser}`} className="player steps-6"></div>
    )
}

export default Player