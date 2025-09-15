import { useEffect, useState } from 'react'
import '../../CSS/Page1/main.css'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import useWindowSize from '../useWindowSize'
import PixoraAI from '../AI/PixoraAI'
import AiButton from '../AI/AiButton'

const Main = ({ data }) => {
  const size = useWindowSize();

  const loc = useLocation();

  const [searchParam, setSearchParam] = useSearchParams();

  const AddParam = (order) => {
    let param = new URLSearchParams(searchParam);
    param.set("order", order);
    setSearchParam(param);
  }

  const [count, setCount] = useState(window.innerWidth > 1280 ? 4 : window.innerWidth > 1024 ? 3 : window.innerWidth > 769 ? 2 : 1)

  useEffect(() => {
    setCount(size > 1280 ? 4 : size > 1024 ? 3 : size > 769 ? 2 : 1);
  }, [size]);

  const [ai, setAi] = useState(false)

  return <>
    <div className='main-con'>
      <div className={size < 1000 ? "main-header ver" : "main-header"} style={size <= 750 ? { alignItems: "flex-start" } : null}>
        {size < 1000 && <h1>Stunning royalty-free images & royalty-free stock</h1>}
        <p>Over 5.5 million+ high quality stock images, videos and music shared by our talented community.</p>
        <div className="cat-opt" style={size <= 750 ? { width: "100%" } : null}>
          <div className={!searchParam.has("order") || (searchParam.get("order") !== "latest" && searchParam.get("order") !== "popular") ? "active" : ""} onClick={() => {
            if (searchParam.has("order") && (searchParam.get("order") === "latest" || searchParam.get("order") === "popular")) {
              AddParam("ec")
            }
          }}>Editor's Choice</div>
          <div className={searchParam.get("order") === 'latest' ? "active" : ""} onClick={() => { AddParam("latest") }}>Latest</div>
          <div className={searchParam.get("order") === 'popular' ? "active" : ""} onClick={() => AddParam("popular")}>Popular</div>
        </div>
      </div>
      <div className='main-card-con'>
        <div className='frame' style={{ maxHeight: count === 1 ? "30000px" : "8000px" }}>
          <div className='container'>
            <div>
              {(data && data.length > 0) && data.map((ele, idx) => {
                if (idx % count === 0) {
                  return ["film", "animation"].includes(ele.type) ? <Link className='card' to={`/videos/${ele.tags.replaceAll(" ", "-").split(",").slice(0, 3).join("")}-${ele.id}`} key={ele.id}>
                    <video
                      src={ele.videos?.small?.url}
                      muted
                      loop
                      onMouseEnter={(e) => e.target.play().catch((e) => { })}
                      onMouseLeave={(e) => e.target.pause()}
                      poster={ele.videos?.small?.thumbnail}
                    />
                  </Link> : <Link className='card' to={`/${ele.type.split("/")[0] + "s"}/${ele.tags.replaceAll(" ", "-").split(",").slice(0, 3).join("")}-${ele.id}`} key={ele.id}>
                    <img src={ele.webformatURL} alt="card" loading='lazy' />
                  </Link>
                } else {
                  return null;
                }
              })
              }
            </div>
            {size > 769 && <div>
              {(data && data.length > 0) && data.map((ele, idx) => {
                if (idx % count === 1) {
                  return ["film", "animation"].includes(ele.type) ? <Link className='card' to={`/videos/${ele.tags.replaceAll(" ", "-").split(",").slice(0, 3).join("")}-${ele.id}`} key={ele.id}>
                    <video
                      src={ele.videos?.small?.url}
                      muted
                      loop
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => e.target.pause()}
                      poster={ele.videos?.small?.thumbnail}
                    />
                  </Link> : <Link className='card' to={`/${ele.type.split("/")[0] + "s"}/${ele.tags.replaceAll(" ", "-").split(",").slice(0, 3).join("")}-${ele.id}`} key={ele.id}>
                    <img src={ele.webformatURL} alt="card" loading='lazy' />
                  </Link>
                } else {
                  return null;
                }
              })
              }
            </div>}
            {size > 1024 && <div>
              {(data && data.length > 0) && data.map((ele, idx) => {
                if (idx % count === 2) {
                  return ["film", "animation"].includes(ele.type) ? <Link className='card' to={`/videos/${ele.tags.replaceAll(" ", "-").split(",").slice(0, 3).join("")}-${ele.id}`} key={ele.id}>
                    <video
                      src={ele.videos?.small?.url}
                      muted
                      loop
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => e.target.pause()}
                      poster={ele.videos?.small?.thumbnail}
                    />
                  </Link> : <Link className='card' to={`/${ele.type.split("/")[0] + "s"}/${ele.tags.replaceAll(" ", "-").split(",").slice(0, 3).join("")}-${ele.id}`} key={ele.id}>
                    <img src={ele.webformatURL} alt="card" loading='lazy' />
                  </Link>
                } else {
                  return null;
                }
              })
              }
            </div>}
            {size > 1280 && <div>
              {(data && data.length > 0) && data.map((ele, idx) => {
                if (idx % count === 3) {
                  return ["film", "animation"].includes(ele.type) ? <Link className='card' to={`/videos/${ele.tags.replaceAll(" ", "-").split(",").slice(0, 3).join("")}-${ele.id}`} key={ele.id}>
                    <video
                      src={ele.videos?.small?.url}
                      muted
                      loop
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => e.target.pause()}
                      poster={ele.videos?.small?.thumbnail}
                    />
                  </Link> : <Link className='card' to={`/${ele.type.split("/")[0] + "s"}/${ele.tags.replaceAll(" ", "-").split(",").slice(0, 3).join("")}-${ele.id}`} key={ele.id}>
                    <img src={ele.webformatURL} alt="card" loading='lazy' />
                  </Link>
                } else {
                  return null;
                }
              })
              }
            </div>}
          </div>
        </div>
        <div className='white-transparent'>
          <Link className='link' to={`${loc.pathname === "/" ? "/images/" : loc.pathname}search/?order=${searchParam.has("order") ? searchParam.get("order") : "ec"}`}><button className='discover'>Discover More</button></Link>
        </div>
      </div>
    </div>
    {ai && <PixoraAI setAi={setAi}/>}
    <AiButton setAi={setAi}/>
  </>
}

export default Main