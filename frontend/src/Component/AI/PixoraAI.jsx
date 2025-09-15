import '../../CSS/AI/ai.css'
import logo from '../../Images/logo.png'
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { customAlphabet } from 'nanoid';

const PixoraAI = ({setAi}) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nanoid = customAlphabet(alphabet, 20);

  const [prompt, setPrompt] = useState("");
  
  const [data , setData] = useState([])

//    const [data, setData] = useState([
//     { image: "", prompt: "hello world" },
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAyklEQVR4AeyVMQ6EMBADI/7/59C7sSwq7Dnpiihb4PEsPPecu/x/zvgPAOMCHAzAgHECrMC4ALwEWQFWYJwAKzAuwN5XQAtnBZTI2hkD1hrXvBigRNbOGLDWuObFACWydsaAtcY1LwYokbUzBrQ37vJhgCPUfo8B7Q27fBjgCLXfY0B7wy4fBjhC7fcY0N6wy4cBjlD7PQa0NZzmwYCUWNs8BrQ1mubBgJRY2zwGtDWa5sGAlFjbPAa0NZrmwYCUWNs8Bvy90a/P/wIAAP//it54IAAAAAZJREFUAwBODoABi7PBtwAAAABJRU5ErkJggg==",

//     { image: "https://picsum.photos/id/237/200/300", prompt: "random text 1" },
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAyElEQVR4AeyVMQ6EMBADo/z/z9C7sSwq7LmromyBx7Nwz7P9v2f8B4BxAQ4GYMA4AVZgXABegqwAKzBOgBUYF2DvK6CFswJKZO2MAWuNa14MUCJrZwxYa1zzYoASWTtjwFrjmhcDlMjaGQPaG3f5MMARar/HgPaGXT4McITa7zGgvWGXDwMcofZ7DGhv2OXDAEeo/R4D2hpO82BASqxtHgPaGk3zYEBKrG0eA9oaTfNgQEqsbR4D2hpN82BASqxtHgP+3ujX538BAAD//yuD06QAAAAGSURBVAMADk6AAWA9FEoAAAAASUVORK5CYII=",

//     { image: "", prompt: "sample prompt" },
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA0ElEQVR4AeySMQ7EMAzDgv7/z6lnL4LQqRIPucGwh4ric869zf8BcKp/AKiuf8JjwECofhhQXf+Ex4CBUP0woLr+CY8BA6H6YUBb/TsvBmwibTMGtDW+82LAJtI2Y0Bb4zsvBmwibTMGtDW+82LAJtI2Y0B64yofBihC6XsMSG9Y5cMARSh9jwHpDat8GKAIpe8xIL1hlQ8DFKH0PQakNezmwQCXWNo9BqQ16ubBAJdY2j0GpDXq5sEAl1jaPQakNermwQCXWNo9Bvy90a/f/wIAAP//5RYYxgAAAAZJREFUAwDOf4ABM9l16wAAAABJRU5ErkJggg==",

//     { image: "https://placehold.co/250x250.png?text=Test+Image", prompt: "test message" },
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAyklEQVR4AeyVMQ6EMBADI/7/59C7sSwq7Dnpiihb4PEsPPeeu/x/zvgPAOMCHAzAgHECrMC4ALwEWQFWYJwAKzAuwN5XQAtnBZTI2hkD1hrXvBigRNbOGLDWuObFACWydsaAtcY1LwYokbUzBrQ37vJhgCPUfo8B7Q27fBjgCLXfY0B7wy4fBjhC7fcY0N6wy4cBjlD7PQa0NZzmwYCUWNs8BrQ1mubBgJRY2zwGtDWa5sGAlFjbPAa0NZrmwYCUWNs8Bvy90a/P/wIAAP//sJvXOQAAAAZJREFUAwBMPb/BxC26eQAAAABJRU5ErkJggg==",

//     { image: "https://picsum.photos/seed/hello/300/300", prompt: "lorem ipsum" },
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAyklEQVR4AeyVMQ6EMBADI/7/59C7sSwq7Dnpiihb4PEsPOfeu/x/zvgPAOMCHAzAgHECrMC4ALwEWQFWYJwAKzAuwN5XQAtnBZTI2hkD1hrXvBigRNbOGLDWuObFACWydsaAtcY1LwYokbUzBrQ37vJhgCPUfo8B7Q27fBjgCLXfY0B7wy4fBjhC7fcY0N6wy4cBjlD7PQa0NZzmwYCUWNs8BrQ1mubBgJRY2zwGtDWa5sGAlFjbPAa0NZrmwYCUWNs8Bvy90a/P/wIAAP//AYdK5wAAAAZJREFUAwDMrr/B1iEK6wAAAABJRU5ErkJggg==",

//     { image: "", prompt: "another example" },
//     "error",

//     { image: "https://placehold.co/600x400?text=Final+Check", prompt: "final check" },
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAyklEQVR4AeyVMQ6EMBADI/7/59C7sSwq7Dnpiihb4PEsPPfcu/x/zvgPAOMCHAzAgHECrMC4ALwEWQFWYJwAKzAuwN5XQAtnBZTI2hkD1hrXvBigRNbOGLDWuObFACWydsaAtcY1LwYokbUzBrQ37vJhgCPUfo8B7Q27fBjgCLXfY0B7wy4fBjhC7fcY0N6wy4cBjlD7PQa0NZzmwYCUWNs8BrQ1mubBgJRY2zwGtDWa5sGAlFjbPAa0NZrmwYCUWNs8Bvy90a/P/wIAAP//r6+CBAAAAAZJREFUAwAMfb/BL6NvhAAAAABJRU5ErkJggg==",

//     { image: "", prompt: "empty case 1" },
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAzElEQVR4AeyVsQ2EQBADT/TfBnVC7sSyiLDnpQ9OtwEez8L13OdZ/l9n/AeAcQEOBmDAOAFWYFwAXoKsACswToAVGBdg7yughbMCSmTtjAFrjWteDFAia2cMWGtc82KAElk7Y8Ba45oXA5TI2hkD2ht3+TDAEWq/x4D2hl0+DHCE2u8xoL1hlw8DHKH2ewxob9jlwwBHqP0eA9oaTvNgQEqsbR4D2hpN82BASqxtHgPaGk3zYEBKrG0eA9oaTfNgQEqsbR4D/t7o1+d/AQAA//9/LF1jAAAABklEQVQDAJgoqUGG1sPbAAAAAElFTkSuQmCC",

//     { image: "https://picsum.photos/id/100/200/200", prompt: "dataset expansion" },
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAy0lEQVR4AeyVMQ6EMBADI17Oz6F3Y1lU2HPSFVG2wONZuO5zP8v/64z/ADAuwMEADBgnwAqMC8BLkBVgBcYJsALjAux9BbRwVkCJrJ0xYK1xzYsBSmTtjAFrjWteDFAia2cMWGtc82KAElk7Y0B74y4fBjhC7fcY0N6wy4cBjlD7PQa0N+zyYYAj1H6PAe0Nu3wY4Ai132NAW8NpHgxIibXNY0Bbo2keDEiJtc1jQFujaR4MSIm1zWNAW6NpHgxIibXNY8DfG/36/C8AAAD//zGes5oAAAAGSURBVAMA/y+AQWEuhQ8AAAAASUVORK5CYII=",

//     { image: "https://picsum.photos/seed/mix/300/150", prompt: "alternate mix" },
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAzElEQVR4AeyVsQ2EQBADEeXQN3VC7sSyiLDnpQ9OtwEez8J5X9ez/D+P8R8AxgU4MAADxgmwAuMC8BJkBViBcQKswLgAe18BLZwVUCJrZwxYa1zzYoASWTtjwFrjmhcDlMjaGQPWGte8GKBE1s4Y0N64y4cBjlD7PQa0N+zyYYAj1H6PAe0Nu3wY4Ai132NAe8MuHwY4Qu33GNDWcJoHA1JibfMY0NZomgcDUmJt8xjQ1miaBwNSYm3zGNDWaJoHA1JibfMY8PdGvz7/CwAA//9S23UXAAAABklEQVQDAIdufoGvpuQIAAAAAElFTkSuQmCC",

//     { image: "", prompt: "edge test" },
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAzUlEQVR4AeyVsQ2EQBADEf0XRU5RkDuxLCLseemD022Ax7NwPtf9LP/PY/wHgHEBDgzAgHECrMC4ALwEWQFWYJwAKzAuwN5XQAtnBZTI2hkD1hrXvBigRNbOGLDWuObFACWydsaAtcY1LwYokbUzBrQ37vJhgCPUfo8B7Q27fBjgCLXfY0B7wy4fBjhC7fcY0N6wy4cBjlD7PQa0NZzmwYCUWNs8BrQ1mubBgJRY2zwGtDWa5sGAlFjbPAa0NZrmwYCUWNs8Bvy90a/P/wIAAP//msHr+wAAAAZJREFUAwDcNuLBei2XJQAAAABJRU5ErkJggg==",

//     { image: "https://picsum.photos/seed/check/320/240", prompt: "prompt check" },
//     "https://placehold.co/380x220/00ff00/000000.png?text=Prompt+Check",

//     { image: "", prompt: "hello dataset" },
//     "https://picsum.photos/seed/hello2/360/240",

//     { image: "https://placehold.co/500x300?text=Random+Test+Data", prompt: "random test data" },
//     "https://picsum.photos/seed/random/200/400"
//   ]
//   );


  const [loader, setLoader] = useState(false)

  useEffect(()=>{
    document.body.style.overflow = "hidden"

    return ()=> document.body.style.overflow = "auto"
  },[])

  const generateImg = async () => {
    try {
      const obj = { image: img ? img : "", prompt };
      setData(prev => [...prev, obj]);
      setLoader(true)
      setPrompt("")
      setImg(null)

      let res = ""
      if (obj.prompt && obj.image) { //image + prompt -> background change
        res = await axios.post("http://localhost:8000/changebackground", { prompt: obj.prompt, image: obj.image.replace(/^data:image\/\w+;base64,/, "") })
      } else if (obj.prompt && !obj.image) { //only promt -> text to image
        res = await axios.post('http://localhost:8000/text-to-image', { prompt: obj.prompt });
      } else { // only image
        res = await axios.post('http://localhost:8000/creativeimage', { image: obj.image.replace(/^data:image\/\w+;base64,/, "") })
      }

      setData(prev => [...prev, res.data.image])
      console.log(res.data);
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
      const res = await axios.post('http://localhost:8000/uploadimage', { base64Image, userId: "temp" });

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
        <div onClick={()=>{setAi(false)}}><i className="ri-close-line"></i></div>
      </div>
    </div>
    <div className="bottom">
      {data.length !== 0 && <div className="main">
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