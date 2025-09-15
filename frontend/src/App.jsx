import Page1 from './Component/Page1/Page1'
import './App.css'
import Page2 from './Component/Page2/Page2'
import { useEffect, useState } from 'react';
import { createContext } from 'react';
import Page3 from './Component/Page3/Page3';
import Error from './Component/Error/Error';
import Page2Search from './Component/Page2Search/Page2Search'

import { Route, Routes, useParams } from 'react-router-dom';
import CleanSlash from './Component/CleanSlash';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Component/Firebase';
import Collection from './Component/AI/Collections'
import axios from 'axios';

const GlobalContext = createContext();
const App = () => {

  const backendURL = 'http://localhost:8000'

  //notification
  const notify = (message, method) => {
    toast[method](message, {
      position: `${method === "error" ? "bottom-right" : "top-right"}`,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
      toastId: `${method}`
    });
  }

  const Page1Wrapper = () => {
    const { cat } = useParams()
    if (cat) {
      const isValidCat = ["videos", "photos", "vectors", "illustrations"].includes(cat)
      return isValidCat ? <Page1 /> : <Error />
    } else {
      return <Page1 />
    }

  }

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (userGen) => {
      if (userGen) {
        setUser(userGen);
      } else {
        setUser(null);
      }
    })

    return () => unSubscribe();
  }, [])

  return <GlobalContext.Provider value={{ notify, user, backendURL }}>
    <ToastContainer />
    <CleanSlash>
      <Routes>
        <Route path='/' element={<Page1Wrapper />} />
        {user && <Route path='/collection' element={<Collection />} />}
        <Route path='/:cat' element={<Page1Wrapper />} />
        <Route path='/:cat/search/' element={
          (() => {
            const Wrapper = () => {
              const { cat } = useParams()
              const isValidCat = ["videos", "photos", "vectors", "illustrations", "images"].includes(cat)
              return isValidCat ? <Page2 /> : <Error />;
            }
            return <Wrapper />
          })()
        } />
        <Route path='/:cat/search/:text/' element={
          (() => {
            const Wrapper = () => {
              const { cat } = useParams();
              const isValidCat = ["videos", "photos", "vectors", "illustrations", "images"].includes(cat);
              return isValidCat ? <Page2Search /> : <Error />
            }
            return <Wrapper />
          })()

        } />
        <Route path='/:cat/:id' element={
          (() => {
            const Wrapper = () => {
              const { cat, id } = useParams()
              if (!isNaN(id.split('-').pop())) {
                const isValidCat = ["videos", "photos", "vectors", "illustrations", "images"].includes(cat);

                return isValidCat ? <Page3 /> : <Error />
              } else {
                return <Error />
              }
            }
            return <Wrapper />
          })()
        } />
        <Route path='/*' element={<Error />} />
      </Routes>
    </CleanSlash>
  </GlobalContext.Provider>
}

export default App
export { GlobalContext }