import { useEffect, useRef, useState } from 'react'
import '../../CSS/Page3/main.css'
import { Link, useParams } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import useWindowSize from '../useWindowSize'
import PixoraAI from '../AI/PixoraAI'
import AiButton from '../AI/AiButton'

const Main = ({ singleData, safeSearch, setSafeSearch, authTrace, setAuthTrace, user, setUser }) => {
  const size = useWindowSize()

  const { cat, id } = useParams();

  const bio = {
    images: "Passionate visual artist sharing royalty-free images to inspire creativity around the world. Specializing in nature, textures, and lifestyle photography.",
    photos: "Freelance photographer capturing everyday moments and stunning visuals to share with the creative world.",
    illustrations: "Digital artist creating high-quality illustrations for designers, storytellers, and content creators.",
    vectors: "Vector designer delivering scalable, clean, and modern vector assets for personal and commercial projects.",
    videos: "Videographer sharing cinematic and dynamic footage to enhance your creative storytelling."
  }

  const first = useRef(null)

  const startVid = () => {
    const vid = document.querySelector('.vidplay');
    return setTimeout(() => {
      if (vid) {
        vid.play();
      }
    }, 10000)
  }

  // let instance = null;
  useEffect(() => {
    first.current = startVid();
  }, [])

  const [selected, setSelected] = useState(1);

  const [downloadURL, setDownloadURL] = useState([]);

  const blobSize = async (url) => {
    const res = await fetch(url)
    const blob = await res.blob();
    return blob.size;
  }

  const [loader, setLoader] = useState(false)

  useEffect(() => {
    const createURL = async () => {
      try {
        if (["animation", "film"].includes(singleData.hits[0].type)) {
          let arr = Object.values(singleData.hits[0].videos);
          setDownloadURL(arr.reverse())
        } else {
          let arr = []

          setLoader(true)
          const BlobSizeCal = await blobSize(singleData.hits[0].webformatURL);
          setLoader(false);

          arr.push({ "url": singleData.hits[0].webformatURL, width: singleData.hits[0].webformatWidth, height: singleData.hits[0].webformatHeight, size: BlobSizeCal })

          arr.push({ "url": singleData.hits[0].largeImageURL, width: singleData.hits[0].imageWidth, height: singleData.hits[0].imageHeight, size: singleData.hits[0].imageSize })

          setDownloadURL(arr);
        }
      } catch (error) {
        setLoader(false);
        console.log("Error: ", error);
      }
    }
    createURL();
  }, [singleData])

  const [downloadLoader, setDownloadLoader] = useState(false)

  const downloadFun = async (url, name) => {
    try {
      setDownloadLoader(true)
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${name}.${url.split(".").pop()}`;
      a.click();
      URL.revokeObjectURL(blobUrl);
      setDownloadLoader(false)
    } catch (error) {
      setDownloadLoader(false)
      console.log("Error: ", error);
    }
  }

  const [url, setUrl] = useState("");

  useEffect(() => {
    if (singleData.total > 0) {
      const tagsArr = singleData?.hits[0]?.tags.split(",");
      let query = "";
      for (let tag of tagsArr) {
        if ((query + tag.trim() + " ").length < 100) {
          query += tag.trim() + " ";
        }
      }

      let safeSearchQuery = safeSearch === "" ? true : safeSearch;

      setUrl(["film", "animation"].includes(singleData?.hits[0]?.type) ? `https://pixabay.com/api/videos/?key=${import.meta.env.VITE_API_KEY}${query ? `&q=${encodeURIComponent(query.trim().replace(/\s+/g, ' '))}` : ""}&safesearch=${safeSearchQuery}&per_page=30` : `https://pixabay.com/api/?key=${import.meta.env.VITE_API_KEY}&image_type=all${query ? `&q=${encodeURIComponent(query.trim().replace(/\s+/g, ' '))}` : ""}&safesearch=${safeSearchQuery}&per_page=30`)
    }
  }, [singleData, safeSearch])

  const fetchAPI = async ({ pageParam = 1, queryKey }) => {
    const [_key, urlKey] = queryKey

    const finalUrl = urlKey + `&page=${pageParam}`

    const res = await axios.get(finalUrl);

    return res.data
  }

  const { data, error, fetchNextPage } = useInfiniteQuery({
    queryKey: ["Single_Data", url],
    queryFn: fetchAPI,
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 20,
    getNextPageParam: (lastPages, allPages) => {
      return lastPages.totalHits / 30 > allPages.length ? allPages.length + 1 : undefined;
    },
    enabled: !!url,
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (error) {
      console.log("Error: ", error);
    }
  }, [error])

  const [share, setShare] = useState(false)

  const [copy, setCopy] = useState(false)

  const [count, setCount] = useState(window.innerWidth > 1024 ? 3 : window.innerWidth > 769 ? 2 : 1)

  useEffect(() => {
    setCount(size > 1024 ? 3 : size > 769 ? 2 : 1);
  }, [size]);

  const handleAnyWhereDownload = (e) => {
    const det5 = document.getElementById("det5")
    const det6 = document.getElementById("det6")
    const det7 = document.getElementById("det7")

    if (det5 && !det5.contains(e.target)) { det5.removeAttribute("open") };

    if (det6 && !det6.contains(e.target)) { det6.removeAttribute("open") };

    if (det7 && !det7.contains(e.target)) { det7.removeAttribute("open") };
  }

  useEffect(() => {
    window.addEventListener("click", handleAnyWhereDownload);

    return () => window.removeEventListener("click", handleAnyWhereDownload)
  }, [])

  useEffect(() => {
    if (share) {
      document.body.setAttribute("class", "hidescroll")
    }
  }, [size, share])

  const [ai, setAi] = useState(false)

  return <>
    <div className="main3-con">
      <div className="container">
        <div className="left">
          {size < 760 && <div className='mob'>
            <div className="download-btn">
              <details id='det5'>
                <summary>
                  Download <i className="ri-arrow-down-s-line"></i>
                </summary>
                <div>
                  {loader ? <div className='loader' style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px 20px" }}><CircularProgress size={30} style={{ color: "#00a768" }} /></div> : <>
                    {downloadURL.length > 0 && downloadURL.map((item, idx) => {
                      return <div className='size' key={idx}>
                        <label htmlFor={`radio${idx}`}>
                          <input type="radio" name="imgsize" id={`radio${idx}`} checked={selected === idx + 1} onChange={() => { setSelected(idx + 1) }} />
                          <div>
                            <div>{item.width} x {item.height}</div>
                            <div className='img-format'>{item.url.split(".").pop().toUpperCase()}</div>
                            <div>{(item.size / 1024) > 999 ? `${(item.size / (1024 * 1024)).toFixed(2)} MB` : `${(item.size / 1024).toFixed(2)} kB`}</div>
                          </div>
                        </label>
                      </div>
                    })}
                    {(downloadURL && downloadURL.length > 0) && <div className="button">
                      {downloadLoader ? <a id='download-1' href={`${downloadURL[selected - 1].url}`} onClick={(e) => { e.preventDefault() }} ><CircularProgress size={18} style={{ color: "white" }} /></a>
                        : <a id='download-1' href={`${downloadURL[selected - 1].url}`} onClick={(e) => {
                          e.preventDefault();

                          if (downloadURL.length === 4) {
                            if (selected > 2) {
                              if (user) {
                                downloadFun(downloadURL[selected - 1].url, id.split("-")[0]);
                              } else {
                                setAuthTrace("login");
                                document.body.setAttribute("class", "hidescroll");
                              }
                            } else {
                              downloadFun(downloadURL[selected - 1].url, id.split("-")[0]);
                            }
                          } else {
                            if (selected > 1) {
                              if (user) {
                                downloadFun(downloadURL[selected - 1].url, id.split("-")[0]);
                              } else {
                                setAuthTrace("login");
                                document.body.setAttribute("class", "hidescroll");
                              }
                            } else {
                              downloadFun(downloadURL[selected - 1].url, id.split("-")[0]);
                            }
                          }

                        }} >Download</a>}
                      <a href={`${downloadURL[selected - 1].url}`} target='_blank'>View</a>
                    </div>}
                  </>}
                </div>
              </details>
            </div>
          </div>}

          <div className={size < 1025 ? "image-vid-mob" : "image-vid-web"}>
            {["film", "animation"].includes(singleData.hits[0].type) ? <video onClick={() => {
              clearTimeout(first.current);
            }} className='vidplay' src={singleData.hits[0].videos.medium.url} controlsList="nodownload" controls muted loop></video> : <img src={singleData.hits[0].webformatURL} alt="image" />}
          </div>

          {size < 1025 && <>
            <div className="card">
              {size >= 760 && <div className="download-btn">
                <details id='det6'>
                  <summary>
                    Download <i className="ri-arrow-down-s-line"></i>
                  </summary>
                  <div>
                    {loader ? <div className='loader' style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px 20px" }}><CircularProgress size={30} style={{ color: "#00a768" }} /></div> : <>
                      {downloadURL.length > 0 && downloadURL.map((item, idx) => {
                        return <div className='size' key={idx}>
                          <label htmlFor={`radio${idx}`}>
                            <input type="radio" name="imgsize" id={`radio${idx}`} checked={selected === idx + 1} onChange={() => { setSelected(idx + 1) }} />
                            <div>
                              <div>{item.width} x {item.height}</div>
                              <div className='img-format'>{item.url.split(".").pop().toUpperCase()}</div>
                              <div>{(item.size / 1024) > 999 ? `${(item.size / (1024 * 1024)).toFixed(2)} MB` : `${(item.size / 1024).toFixed(2)} kB`}</div>
                            </div>
                          </label>
                        </div>
                      })}
                      {(downloadURL && downloadURL.length > 0) && <div className="button">
                        {downloadLoader ? <a id='download-1' href={`${downloadURL[selected - 1].url}`} onClick={(e) => { e.preventDefault() }} ><CircularProgress size={18} style={{ color: "white" }} /></a>
                          : <a id='download-1' href={`${downloadURL[selected - 1].url}`} onClick={(e) => {
                            e.preventDefault();

                            if (downloadURL.length === 4) {
                              if (selected > 2) {
                                if (user) {
                                  downloadFun(downloadURL[selected - 1].url, id.split("-")[0]);
                                } else {
                                  setAuthTrace("login");
                                  document.body.setAttribute("class", "hidescroll");
                                }
                              } else {
                                downloadFun(downloadURL[selected - 1].url, id.split("-")[0]);
                              }
                            } else {
                              if (selected > 1) {
                                if (user) {
                                  downloadFun(downloadURL[selected - 1].url, id.split("-")[0]);
                                } else {
                                  setAuthTrace("login");
                                  document.body.setAttribute("class", "hidescroll");
                                }
                              } else {
                                downloadFun(downloadURL[selected - 1].url, id.split("-")[0]);
                              }
                            }

                          }} >Download</a>}
                        <a href={`${downloadURL[selected - 1].url}`} target='_blank'>View</a>
                      </div>}
                    </>}
                  </div>
                </details>
              </div>}
              <div className={size < 760 ? "social-icon mob" : "social-icon"}>
                <div className="box like">
                  <i className="ri-heart-line"></i> {singleData.hits[0].likes}
                </div>
                <div className="box save">
                  {["animation", "film"].includes(singleData.hits[0].type) ? <>
                    <i className="ri-download-cloud-line"></i> {singleData.hits[0].downloads.toLocaleString("en-IN")}
                  </>
                    : <>
                      <i className="ri-bookmark-line"></i> {singleData.hits[0].collections.toLocaleString("en-IN")}
                    </>}
                </div>
                <div className="box comment">
                  <i className="ri-chat-4-line"></i> {singleData.hits[0].comments.toLocaleString("en-IN")}
                </div>
                <div className="box share" onClick={() => { setShare(true) }}>
                  <i className="ri-share-fill"></i>
                </div>
              </div>
            </div>
            <div className="user-con">
              <div className="user">
                <a className='link' target='_blank' href={singleData.hits[0].userURL}>
                  <div className="user-icon">
                    <img src={singleData.hits[0].userImageURL === "" ? user : singleData.hits[0].userImageURL} loading='lazy' alt={"user-icon"} />
                  </div>
                  <div className="name">{singleData.hits[0].user}</div>
                </a>
              </div>
              <div className="user-info">
                {bio[cat]}
              </div>
            </div>
          </>
          }

          <div className="keywords">
            {singleData.hits[0].tags.split(",").map((tag, idx) => {
              return <div className="words" key={idx}>
                <Link className='text' to={`/${["film", "animation"].includes(singleData.hits[0].type) ? "videos" : singleData.hits[0].type.split("/")[0] + "s"}/search/${tag.trim()}`}>{tag.trim().charAt(0).toUpperCase() + tag.trim().slice(1)}</Link>
              </div>
            })}
          </div>

          {size < 1025 && <div className="hr">
          </div>}

          <div className='main-card-con'>
            <div className='frame'>
              <div className='container'>
                {<div>
                  {data && data.pages.map((page) => page.hits.map((ele) => ele)).flat().filter((ele) => ele.id !== parseInt(id.split("-").pop())).map((ele, idx) => {
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
                  })}
                </div>}

                {size > 769 && <div>
                  {data && data.pages.map((page) => page.hits.map((ele) => ele)).flat().filter((ele) => ele.id !== parseInt(id.split("-").pop())).map((ele, idx) => {
                    if (idx % count === 1) {
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
                  })}
                </div>}

                {size > 1024 && <div>
                  {data && data.pages.map((page) => page.hits.map((ele) => ele)).flat().filter((ele) => ele.id !== parseInt(id.split("-").pop())).map((ele, idx) => {
                    if (idx % count === 2) {
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
                  })}
                </div>}
              </div>
              {(data && data.pages[0].total > 0) && <div className='button-LM'><button onClick={() => { fetchNextPage() }}>Load More</button></div>}
            </div>
          </div>
        </div>

        {size >= 1025 && <div className="right">
          <div className="card">
            <details id='det7'>
              <summary>
                Download <i className="ri-arrow-down-s-line"></i>
              </summary>
              <div>
                {loader ? <div className='loader' style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px 20px" }}><CircularProgress size={30} style={{ color: "#00a768" }} /></div> : <>
                  {downloadURL.length > 0 && downloadURL.map((item, idx) => {
                    return <div className='size' key={idx}>
                      <label htmlFor={`radio${idx}`}>
                        <input type="radio" name="imgsize" id={`radio${idx}`} checked={selected === idx + 1} onChange={() => { setSelected(idx + 1) }} />
                        <div>
                          <div>{item.width} x {item.height}</div>
                          <div className='img-format'>{item.url.split(".").pop().toUpperCase()}</div>
                          <div>{(item.size / 1024) > 999 ? `${(item.size / (1024 * 1024)).toFixed(2)} MB` : `${(item.size / 1024).toFixed(2)} kB`}</div>
                        </div>
                      </label>
                    </div>
                  })}
                  {(downloadURL && downloadURL.length > 0) && <div className="button">
                    {downloadLoader ? <a id='download-1' href={`${downloadURL[selected - 1].url}`} onClick={(e) => { e.preventDefault() }}><CircularProgress size={18} style={{ color: "white" }} /></a>
                      : <a id='download-1' href={`${downloadURL[selected - 1].url}`} onClick={(e) => {
                        e.preventDefault();

                        if (downloadURL.length === 4) {
                          if (selected > 2) {
                            if (user) {
                              downloadFun(downloadURL[selected - 1].url, id.split("-")[0]);
                            } else {
                              setAuthTrace("login");
                              document.body.setAttribute("class", "hidescroll");
                            }
                          } else {
                            downloadFun(downloadURL[selected - 1].url, id.split("-")[0]);
                          }
                        } else {
                          if (selected > 1) {
                            if (user) {
                              downloadFun(downloadURL[selected - 1].url, id.split("-")[0]);
                            } else {
                              setAuthTrace("login");
                              document.body.setAttribute("class", "hidescroll");
                            }
                          } else {
                            downloadFun(downloadURL[selected - 1].url, id.split("-")[0]);
                          }
                        }

                      }} download >Download</a>}
                    <a href={`${downloadURL[selected - 1].url}`} target='_blank'>View</a>
                  </div>}
                </>}
              </div>
            </details>
            <div className="hr"></div>
            <div className="lower-part">
              <div className="social-icon">
                <div className="box like">
                  <i className="ri-heart-line"></i> {singleData.hits[0].likes}
                </div>
                <div className="box save">
                  {["animation", "film"].includes(singleData.hits[0].type) ? <>
                    <i className="ri-download-cloud-line"></i> {singleData.hits[0].downloads.toLocaleString("en-IN")}
                  </>
                    : <>
                      <i className="ri-bookmark-line"></i> {singleData.hits[0].collections.toLocaleString("en-IN")}
                    </>}
                </div>
                <div className="box comment">
                  <i className="ri-chat-4-line"></i> {singleData.hits[0].comments.toLocaleString("en-IN")}
                </div>
                <div className="box share" onClick={() => { setShare(true) }}>
                  <i className="ri-share-fill"></i>
                </div>
              </div>
              <div className="details-con">
                <div>
                  <div>Views</div>
                  <div>{singleData.hits[0].views.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <div>download</div>
                  <div>{singleData.hits[0].downloads.toLocaleString("en-IN")}</div>
                </div>
                {["animation", "film"].includes(singleData.hits[0].type) ? <div>
                  <div>Durations</div>
                  <div>{singleData.hits[0].duration > 60 ? `${singleData.hits[0].duration / 60} minutes` : `${singleData.hits[0].duration} seconds`}</div>
                </div> : <div>
                  <div>Saves</div>
                  <div>{singleData.hits[0].collections.toLocaleString("en-IN")}</div>
                </div>}
                <div>
                  <div>Media type</div>
                  <div>{["animation", "film"].includes(singleData.hits[0].type) ? singleData.hits[0].videos.medium.url.split(".").pop().toUpperCase() : singleData.hits[0].webformatURL.split(".").pop().toUpperCase()}</div>
                </div>
                <div>
                  <div>Resolution</div>
                  <div>{["animation", "film"].includes(singleData.hits[0].type) ? `${singleData.hits[0].videos.large.width} x ${singleData.hits[0].videos.large.height}` : `${singleData.hits[0].imageWidth} x ${singleData.hits[0].imageHeight}`}</div>
                </div>
              </div>
            </div>
            <div className="hr"></div>
            <div className="user-con">
              <div className="user">
                <a className='link' target='_blank' href={singleData.hits[0].userURL}>
                  <div className="user-icon">
                    <img src={singleData.hits[0].userImageURL === "" ? user : singleData.hits[0].userImageURL} loading='lazy' alt={"user-icon"} />
                  </div>
                  <div className="name">{singleData.hits[0].user}</div>
                </a>
              </div>
              <div className="user-info">
                {bio[cat]}
              </div>
            </div>
          </div>
        </div>}

      </div>

      <div className="hr"></div>

      {share && <section open className='share-dialog'>
        <div className="share-con">
          <div className="share-header">
            <div>Share</div>
            <i className="ri-close-line" onClick={() => { setShare(false); document.body.removeAttribute("class") }}></i>
          </div>
          <div className={size < 600 ? size < 520 ? size < 360 ? "share-buttons mob3" : "share-buttons mob2" : "share-buttons mob1" : "share-buttons"}>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank">
              <button>
                <i className="ri-facebook-circle-fill fb"></i>
              </button>
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`} target="_blank">
              <button>
                <i className="ri-twitter-x-line twitter"></i>
              </button>
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank">
              <button>
                <i className="ri-linkedin-box-fill linkedin"></i>
              </button>
            </a>
            <a href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank">
              <button>
                <i className="ri-whatsapp-fill whatsapp"></i>
              </button>
            </a>
            <a href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}`} target="_blank">
              <button>
                <i className="ri-pinterest-fill pinterest"></i>
              </button>
            </a>
            <a href={`https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}`} target="_blank">
              <button>
                <i className="ri-reddit-fill reddit"></i>
              </button>
            </a>
          </div>
          <div className="share-link">
            <div>{window.location.href}</div>
            {!copy ? <button className='copy' onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
              setCopy(true)
              setTimeout(() => {
                setCopy(false)
              }, 1000)
            }}>Copy</button> :
              <button className='copied'>Copied</button>}
          </div>
        </div>
      </section>}
    </div>
    {ai && <PixoraAI setAi={setAi} />}
    <AiButton setAi={setAi} />
  </>

}

export default Main