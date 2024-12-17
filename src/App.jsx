import { HashRouter, Routes, Route } from 'react-router-dom';
import { Background } from './UI/Background';
import { Game } from './Routes/Game';
import { Home } from './Routes/Home';
import { GameProvider } from './Context';

function App() {

  return (
    <>
      <GameProvider>
        <HashRouter>

          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/game' element={<Game/>} />
            <Route path='*' element={<p>Not found</p>} />
          </Routes>

          <Background/>

        </HashRouter>
      </GameProvider>
    </>
  )
}

export default App
