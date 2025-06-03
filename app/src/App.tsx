import './App.css';
import { EntrancePage } from './pages/EntrancePage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { Routes, Route } from 'react-router-dom';

export const App = () => {

  return (
    <>
        <Routes>
            <Route path='/' element={ <EntrancePage/> }/>
            <Route path='/nurture_nook' element={<HomePage/>}/>
        </Routes>
    </>
  )
}

