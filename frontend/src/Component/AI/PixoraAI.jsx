import '../../CSS/AI/ai.css'
import logo from '../../Images/logo.png'
import { useContext, useEffect, useRef, useState } from 'react';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { customAlphabet } from 'nanoid';
import { GlobalContext } from '../../App';

const PixoraAI = ({ setAi }) => {

  const { backendURL, user , notify } = useContext(GlobalContext);

  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nanoid = customAlphabet(alphabet, 20);

  const [prompt, setPrompt] = useState("");

  const [data, setData] = useState([])

  const [loader, setLoader] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"

    return () => document.body.style.overflow = "auto"
  }, [])


  const refMain = useRef(null);

  const scrollTop = () => {
    if (refMain.current) {
      refMain.current.scrollTo({
        top: refMain.current.scrollHeight + 87,
        behavior: "smooth"  // <-- correct spelling
      });
    }
  };


  const generateImg = async () => {
    try {
      const obj = { image: img ? img : "", prompt };
      setData(prev => [...prev, obj]);
      setLoader(true)
      setPrompt("")
      setImg(null)
      scrollTop();

      let res = ""
      if (obj.prompt && obj.image) { //image + prompt -> background change
        res = await axios.post(`${backendURL}/changebackground`, { prompt: obj.prompt, image: obj.image.replace(/^data:image\/\w+;base64,/, "") })
      } else if (obj.prompt && !obj.image) { //only promt -> text to image
        res = await axios.post(`${backendURL}/text-to-image`, { prompt: obj.prompt });
      } else { // only image
        res = await axios.post(`${backendURL}/creativeimage`, { image: obj.image.replace(/^data:image\/\w+;base64,/, "") })
      }

      setData(prev => [...prev, res.data.image])
      scrollTop();
      setLoader(false)
    } catch (error) {
      setLoader(false)
      setData(prev => [...prev, "error"]);
      console.log("Error: ", error.message);
    }
  }

  const [img, setImg] = useState(null);

  const [collectionLoaderSet, setCollectionLoaderSet] = useState(new Set());

  const [downloadLoaderSet, setDownloadLoaderSet] = useState(new Set());

  const handleDownload = async (url, idx) => {
    try {
      setDownloadLoaderSet(prev => {
        const newSet = new Set(prev);
        newSet.add(idx);
        return newSet;
      })

      const link = document.createElement("a");
      link.href = url;
      link.download = `Pixora_Ai_Generated-Image_${nanoid()}`
      link.click();

      setDownloadLoaderSet(prev => {
        const newSet = new Set(prev);
        newSet.delete(idx);
        return newSet
      })
    } catch (error) {
      setDownloadLoaderSet(prev => {
        const newSet = new Set(prev);
        newSet.delete(idx);
        return newSet
      })
      console.log("Error: ", error.message);
    }
  }

  const AddCollection = async (base64Image, idx) => {
    try {
      setCollectionLoaderSet(prev => {
        const newSet = new Set(prev);
        newSet.add(idx);
        return newSet;
      })

      if (user) {
        const res = await axios.post(`${backendURL}/uploadimage`, { base64Image, userId: user.uid });
      }else{
        notify("Please Login to save your collection" , "success");
      }

      setCollectionLoaderSet(prev => {
        const newSet = new Set(prev);
        newSet.delete(idx);
        return newSet;
      })
    } catch (error) {
      setCollectionLoaderSet(prev => {
        const newSet = new Set(prev);
        newSet.delete(idx);
        return newSet;
      })
      console.log("Error: ", error.message);
    }
  }

  return <section className='pixora-ai-con'>
    <div className="header">
      <div>
        <div className="ai-name">
          <div>
            <img src={logo} alt="ai-image" height={10} />
          </div>
          <div>
            Pixora AI
          </div>
        </div>
        <div onClick={() => { setAi(false) }}><i className="ri-close-line"></i></div>
      </div>
    </div>
    <div className="bottom">
      {data.length !== 0 && <div className="main" ref={refMain}>
        {data.map((ele, idx) => {
          if (idx % 2 === 0) {
            return <div className="right" key={idx}>
              {ele.image && <div className="image">
                <img src={ele.image} alt="image" loading='lazy' />
              </div>}
              {ele.prompt && <div className='prompt'>
                <div className="prompt">
                  {ele.prompt}
                </div>
              </div>}
            </div>
          } else {
            return <div className="left" key={idx}>
              {ele !== "error" ? <>
                <div className='generated-image'>
                  <img src={ele} alt="image" loading='lazy' />
                </div>
                <div className='buttons'>
                  <div>
                    {!downloadLoaderSet.has(idx) ? <i className="ri-download-line" onClick={() => { handleDownload(ele, idx) }}></i> :
                      <span>
                        <CircularProgress size={15} className='circularloader' />
                      </span>}
                  </div>
                  <div>
                    {
                      !collectionLoaderSet.has(idx) ? <i className="ri-bookmark-line" onClick={() => { AddCollection(ele, idx) }}></i> : <span>
                        <CircularProgress size={15} className='circularloader' />
                      </span>
                    }
                    <i className="ri-corner-up-right-fill" onClick={() => { setImg(ele) }}></i>
                  </div>
                </div>
              </> : <div className='error'>An Error is Occured</div>}
            </div>
          }
        })}
        {loader && <div className="loader">
          <CircularProgress className='circularloader' size={25} />
        </div>}
      </div>}
      <div className={`prompt-bar ${!data.length && "not-main"}`}>
        <form className="bar" onSubmit={(e) => { e.preventDefault(); if (!loader) { generateImg() } }}>
          {img && <div className="image">
            <i className="ri-close-line" onClick={() => { setImg(null) }}></i>
            <img src={img} alt="image" height={30} />
          </div>}
          <div>
            <textarea placeholder='Type a prompt...' onChange={(e) => { setPrompt(e.target.value) }} value={prompt} onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!loader) {
                  generateImg();
                }
              }
            }}></textarea>
            {(prompt || img) && <button type='submit'><i className="ri-arrow-up-line"></i>
            </button>}
          </div>
        </form>
      </div>
    </div>
  </section>
}

export default PixoraAI