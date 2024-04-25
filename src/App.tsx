import './root.css'
import './stepAction.css'
import './App.css'
import Player from './components/Player'
import { IListCharacter } from './constants/listCharacter'

function App() {

  return (
    <>
      <div className="container-main">
        <Player idUser={1} nameCharacter={IListCharacter["marco"]} />
        <Player idUser={2} flipPlayer nameCharacter={IListCharacter["marco"]} />
      </div>
    </>
  )
}

export default App
