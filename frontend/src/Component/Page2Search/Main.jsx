import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import '../../CSS/Page2/main.css'
import { capitalize, CircularProgress } from '@mui/material'
import useWindowSize from '../useWindowSize'
import PixoraAI from '../AI/PixoraAI'
import AiButton from '../AI/AiButton'

const Main = ({ data, error, ref, isFetching }) => {

  const size = useWindowSize()

  const [filter, setFilter] = useState(false);

  useEffect(() => {
    if (filter) { //true
      document.body.setAttribute("class", "hidescroll")
    } else {
      document.body.removeAttribute("class");
    }
  }, [filter])

  const colors = {
    red: "#ff0000",
    orange: "#fdb91a",
    yellow: "#ffee00",
    green: "#00e100",
    turquoise: "#00d7e8",
    blue: "#0000ff",
    lilac: "#c93ef7",
    pink: "#f8c1ff",
    white: "#ffffff",
    gray: "#bbbbbb",
    black: "#000000",
    brown: "#ae5700"
  };

  const { cat, text } = useParams();

  const loc = useLocation();

  const navigate = useNavigate()

  const [searchParam, setSearchParam] = useSearchParams();

  const [sizeFilter, setSizeFilter] = useState({ width: (searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) ? parseInt(searchParam.get("min_width")) : 0, height: (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) ? parseInt(searchParam.get("min_height")) : 0 });

  useEffect(() => {
    setSizeFilter({ width: (searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) ? parseInt(searchParam.get("min_width")) : 0, height: (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) ? parseInt(searchParam.get("min_height")) : 0 })
  }, [loc.pathname, searchParam])

  const handleSize = (e) => {
    setSizeFilter({ ...sizeFilter, [e.target.name]: e.target.value });
  }

  const handleSubmiteSize = (e) => {
    e.preventDefault()

    let query = "";

    if (searchParam.has("order") && ["ec", "latest", "popular"].includes(searchParam.get("order"))) {
      query += `order=${searchParam.get("order")}&`
    }

    if (["horizontal", "vertical"].includes(searchParam.get("orientation"))) {
      query += `orientation=${searchParam.get("orientation")}&`
    }

    if (sizeFilter.width > 0) {
      query += `min_width=${sizeFilter.width}&`
    }
    if (sizeFilter.height > 0) {
      query += `min_height=${sizeFilter.height}&`;
    }

    if (searchParam.has("colors")) {
      const newvalidColor = ["grayscale", "transparent", "red", "orange", "yellow", "green", "turquoise", "blue", "lilac", "pink", "white", "gray", "black", "brown"];

      const newcolorArray = Array.from(new Set(searchParam.getAll("colors")));

      let newallValidColor = newcolorArray.filter((colorele) => {
        return newvalidColor.includes(colorele);
      })

      for (let i = 0; i < newallValidColor.length; i++) {
        query += `colors=${newallValidColor[i]}&`;
      }
    }

    query = query.slice(0, -1);

    setSearchParam(query);
  }

  const validColorParam = () => {
    const allValidcolor = ["grayscale", "transparent", "red", "orange", "yellow", "green", "turquoise", "blue", "lilac", "pink", "white", "gray", "black", "brown"];
    const Validcolor = Array.from(new Set(searchParam.getAll("colors"))).filter((ele) => {
      return allValidcolor.includes(ele);
    })
    return Validcolor;
  }

  const [colorFilter, setColorFilter] = useState(validColorParam());

  useEffect(() => {
    setColorFilter(validColorParam())
  }, [loc.search])

  const toggleColor = (colorForTog, div) => {
    if (div === "one") {
      if (colorFilter.includes(colorForTog)) {
        setColorFilter(colorFilter.filter((colorele) => {
          return colorele !== colorForTog;
        }))
      } else {
        setColorFilter([...colorFilter, colorForTog]);
      }
    } else if (div === "second") {
      if (colorFilter.includes(colorForTog)) {
        setColorFilter(colorFilter.filter((colorele) => {
          return colorele !== colorForTog;
        }))
      } else {
        let arr = colorFilter.filter((colerele) => {
          return !Object.keys(colors).includes(colerele)
        })
        arr.push(colorForTog)
        setColorFilter([...arr])
      }
    } else {
      let arr = colorFilter.filter((colorele) => {
        return colorele !== "grayscale";
      })
      if (arr.includes(colorForTog)) {
        setColorFilter(arr.filter((colorele) => {
          return colorele !== colorForTog;
        }))
      } else {
        setColorFilter([...arr, colorForTog]);
      }
    }
  }

  const applyColor = (callingMethod) => {
    let query = "";

    if (searchParam.has("order") && ["ec", "latest", "popular"].includes(searchParam.get("order"))) {
      query += `order=${searchParam.get("order")}&`
    }

    if (["horizontal", "vertical"].includes(searchParam.get("orientation"))) {
      query += `orientation=${searchParam.get("orientation")}&`
    }

    if (searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) {
      query += `min_width=${searchParam.get("min_width")}&`
    }

    if (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) {
      query += `min_height=${searchParam.get("min_height")}&`
    }

    if (callingMethod === "apply") {
      for (let i = 0; i < colorFilter.length; i++) {
        query += `colors=${colorFilter[i]}&`;
      }
    }

    query = query.slice(0, -1);

    setSearchParam(query)
  }

  const handleOrientation = (orientation) => {
    let query = "";

    if (searchParam.has("order") && ["ec", "latest", "popular"].includes(searchParam.get("order"))) {
      query += `order=${searchParam.get("order")}&`
    }

    if (["horizontal", "vertical"].includes(orientation)) {
      query += `orientation=${orientation}&`
    }

    if (searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) {
      query += `min_width=${searchParam.get("min_width")}&`
    }

    if (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) {
      query += `min_height=${searchParam.get("min_height")}&`
    }

    if (searchParam.has("colors")) {
      const newvalidColor = ["grayscale", "transparent", "red", "orange", "yellow", "green", "turquoise", "blue", "lilac", "pink", "white", "gray", "black", "brown"];

      const newcolorArray = Array.from(new Set(searchParam.getAll("colors")));

      let newallValidColor = newcolorArray.filter((colorele) => {
        return newvalidColor.includes(colorele);
      })

      for (let i = 0; i < newallValidColor.length; i++) {
        query += `colors=${newallValidColor[i]}&`;
      }
    }

    query = query.slice(0, -1);

    setSearchParam(query);
    if (filter) {
      const slider = document.querySelector(".slider")
      slider.classList.add("go")
      slider.addEventListener('animationend', () => {
        slider.classList.remove("go")
        setFilter(!filter)
      }, { once: true })
    }
  }

  const categoryFilter = (catagoryFil) => {
    let query = "";

    if (searchParam.has("order") && ["ec", "latest", "popular"].includes(searchParam.get("order"))) {
      query += `order=${searchParam.get("order")}&`
    }

    if (["horizontal", "vertical"].includes(searchParam.get("orientation"))) {
      query += `orientation=${searchParam.get("orientation")}&`
    }

    if (searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) {
      query += `min_width=${searchParam.get("min_width")}&`
    }

    if (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) {
      query += `min_height=${searchParam.get("min_height")}&`
    }

    if (searchParam.has("colors")) {
      const newvalidColor = ["grayscale", "transparent", "red", "orange", "yellow", "green", "turquoise", "blue", "lilac", "pink", "white", "gray", "black", "brown"];

      const newcolorArray = Array.from(new Set(searchParam.getAll("colors")));

      let newallValidColor = newcolorArray.filter((colorele) => {
        return newvalidColor.includes(colorele);
      })

      for (let i = 0; i < newallValidColor.length; i++) {
        query += `colors=${newallValidColor[i]}&`;
      }
    }

    query = query.slice(0, -1);
    let path = loc.pathname.split("/").slice(2).join("/");
    navigate(`/${catagoryFil}/${path}${query ? `?${query}` : ""}`)
    if (filter) {
      const slider = document.querySelector(".slider")
      slider.classList.add("go")
      slider.addEventListener('animationend', () => {
        slider.classList.remove("go")
        setFilter(!filter)
      }, { once: true })
    }
  }

  const orderFilter = (order) => {
    let query = "";

    query += `order=${order}&`

    if (["horizontal", "vertical"].includes(searchParam.get("orientation"))) {
      query += `orientation=${searchParam.get("orientation")}&`
    }

    if (searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) {
      query += `min_width=${searchParam.get("min_width")}&`
    }

    if (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) {
      query += `min_height=${searchParam.get("min_height")}&`
    }

    if (searchParam.has("colors")) {
      const newvalidColor = ["grayscale", "transparent", "red", "orange", "yellow", "green", "turquoise", "blue", "lilac", "pink", "white", "gray", "black", "brown"];

      const newcolorArray = Array.from(new Set(searchParam.getAll("colors")));

      let newallValidColor = newcolorArray.filter((colorele) => {
        return newvalidColor.includes(colorele);
      })

      for (let i = 0; i < newallValidColor.length; i++) {
        query += `colors=${newallValidColor[i]}&`;
      }
    }

    query = query.slice(0, -1);

    setSearchParam(query);
  }

  const [filterCount, setFilterCount] = useState(0);

  useEffect(() => {
    const countFilter = () => {
      let count = 0;

      if (searchParam.has("orientation") && ["horizontal", "vertical"].includes(searchParam.get("orientation"))) {
        count++;
      }

      if (searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) {
        count++;
      }

      if (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) {
        count++;
      }

      if (searchParam.has("colors")) {
        const newvalidColor = ["grayscale", "transparent", "red", "orange", "yellow", "green", "turquoise", "blue", "lilac", "pink", "white", "gray", "black", "brown"];

        const newcolorArray = Array.from(new Set(searchParam.getAll("colors")));

        let newallValidColor = newcolorArray.filter((colorele) => {
          return newvalidColor.includes(colorele);
        })

        for (let i = 0; i < newallValidColor.length; i++) {
          count++;
        }
      }

      return count
    }

    setFilterCount(countFilter())
  }, [searchParam, loc.search, filterCount])

  const [count, setCount] = useState(window.innerWidth > 1280 ? 4 : window.innerWidth > 1024 ? 3 : window.innerWidth > 769 ? 2 : 1)

  useEffect(() => {
    setCount(size > 1280 ? 4 : size > 1024 ? 3 : size > 769 ? 2 : 1);
  }, [size]);

  const handleCatAnywhere = (e) => {
    if (size > 1024) {
      const catslider = document.getElementById("catslider")
      const orientationslider = document.getElementById("orientationslider")
      const sizeslider = document.getElementById("sizeslider")
      const colorslider = document.getElementById("colorslider")

      if (!catslider.contains(e.target)) catslider.parentElement.removeAttribute("open")
      if (!orientationslider.contains(e.target)) orientationslider.parentElement.removeAttribute("open")
      if (!sizeslider.contains(e.target)) sizeslider.removeAttribute("open")
      if (!colorslider.contains(e.target)) colorslider.removeAttribute("open")
    }

    const orderslider = document.getElementById("orderslider");
    if (!orderslider.contains(e.target)) { orderslider.parentElement.removeAttribute("open") }
  }

  useEffect(() => {
    window.addEventListener("click", handleCatAnywhere);

    return () => window.removeEventListener("click", handleCatAnywhere);
  }, [size])

  const clearSize = () => {
    let query = "";

    if (searchParam.has("order") && ["ec", "latest", "popular"].includes(searchParam.get("order"))) {
      query += `order=${searchParam.get("order")}&`
    }

    if (["horizontal", "vertical"].includes(searchParam.get("orientation"))) {
      query += `orientation=${searchParam.get("orientation")}&`
    }

    if (searchParam.has("colors")) {
      const newvalidColor = ["grayscale", "transparent", "red", "orange", "yellow", "green", "turquoise", "blue", "lilac", "pink", "white", "gray", "black", "brown"];

      const newcolorArray = Array.from(new Set(searchParam.getAll("colors")));

      let newallValidColor = newcolorArray.filter((colorele) => {
        return newvalidColor.includes(colorele);
      })

      for (let i = 0; i < newallValidColor.length; i++) {
        query += `colors=${newallValidColor[i]}&`;
      }
    }

    query = query.slice(0, -1);

    setSearchParam(query)

    setSizeFilter({ width: 0, height: 0 })
  }

  const [ai, setAi] = useState(false)

  if (error) return <>
    <div className='main-div'>
      <div className="upper">
        <div className="upper-wrapper">
          <div className={size < 1025 ? "filter1-mob" : "filter1-web"}>
            {size < 1025 && <button onClick={() => { setFilter(!filter) }}><i className="ri-equalizer-2-fill"></i> Filters {filterCount !== 0 && <span>({filterCount})</span>}</button>}
            {(size >= 1025 || filter) && <div className={size < 1025 ? "slider mobile" : "slider web"}>
              <div className="filter1-wrapper">
                {size < 1025 && <div className="header-filter">
                  <h4>Filters</h4>
                  <i onClick={() => {
                    //go animation
                    const slider = document.querySelector(".slider")
                    slider.classList.add("go")
                    slider.addEventListener('animationend', () => {
                      slider.classList.remove("go")
                      setFilter(!filter)
                    }, { once: true })

                  }} className="ri-close-line"></i>
                </div>}
                <div className="body-filter">
                  <details className='catagory'>
                    <summary id='catslider'>
                      {cat === "images" ? "All images" : cat.substring(0, 1).toUpperCase() + cat.substring(1)} <i className="ri-arrow-down-s-line"></i>
                    </summary>
                    <div>
                      <span className={cat === "images" ? 'cat-1 green' : 'cat-1'} onClick={() => {
                        if (cat !== "images") {
                          categoryFilter("images")
                        }
                      }}>
                        <i className="ri-image-fill"></i> All images
                      </span>
                      <span className='cat-2'>
                        <p className={cat === "photos" ? "green" : ""} onClick={() => {
                          if (cat !== "photos") {
                            categoryFilter("photos")
                          }
                        }}><i className="ri-camera-fill"></i> Photos</p>
                        <p className={cat === "illustrations" ? "green" : ""} onClick={() => {
                          if (cat !== "illustrations") {
                            categoryFilter("illustrations")
                          }
                        }}><i className="ri-ball-pen-fill"></i> Illustrations</p>
                        <p className={cat === "vectors" ? "green" : ""}
                          onClick={() => {
                            if (cat !== "vectors") {
                              categoryFilter("vectors")
                            }
                          }}><i className="ri-pen-nib-fill"></i> Vectors</p>
                      </span>
                      <span className={cat === "videos" ? 'cat-3 green' : "cat-3"} onClick={() => {
                        if (cat !== "videos") {
                          categoryFilter("videos")
                        }
                      }}>
                        <i className="ri-video-on-fill"></i> Videos
                      </span>
                    </div>
                  </details>
                  <details className='orientation'>
                    <summary id='orientationslider' >
                      {searchParam.has("orientation") && ["horizontal", "vertical"].includes(searchParam.get("orientation")) ? searchParam.get("orientation").substring(0, 1).toUpperCase() + searchParam.get("orientation").substring(1) : "Orientation"}<i className="ri-arrow-down-s-line"></i>
                    </summary>
                    <div>
                      <span className={!searchParam.has("orientation") || (searchParam.get("orientation") !== "horizontal" && searchParam.get("orientation") !== "vertical") ? 'cat-1 green' : 'cat-1'} onClick={() => handleOrientation("any")}>
                        Any
                      </span>
                      <span className={searchParam.get("orientation") === "horizontal" ? 'cat-1 green' : 'cat-1'} onClick={() => handleOrientation("horizontal")}>
                        Horizontal
                      </span>
                      <span className={searchParam.get("orientation") === "vertical" ? 'cat-3 green' : 'cat-3'} onClick={() => handleOrientation("vertical")}>
                        Vertical
                      </span>
                    </div>
                  </details>
                  <details className='size' id='sizeslider'>
                    <summary>
                      {(searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) && (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) ? `> ${searchParam.get("min_width")} x ${searchParam.get("min_height")}` : (searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) ? `> ${searchParam.get("min_width")} wide` : (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) ? `> ${searchParam.get("min_height")} high` : "Sizes"} <i className="ri-arrow-down-s-line"></i>
                    </summary>
                    {size < 1025 ? <form onSubmit={handleSubmiteSize}>
                      <div>Larger than</div>
                      <div>
                        <input type="number" placeholder='Width (px)' name="width" value={sizeFilter.width > 0 ? sizeFilter.width : ""} onChange={handleSize} />
                        x
                        <input type="number" placeholder='Height (px)' name="height" value={sizeFilter.height > 0 ? sizeFilter.height : ""} onChange={handleSize} />
                      </div>
                      <div>
                        <button type='button' onClick={() => {
                          clearSize()
                          const slider = document.querySelector(".slider")
                          slider.classList.add("go")
                          slider.addEventListener('animationend', () => {
                            slider.classList.remove("go")
                            setFilter(!filter)
                          }, { once: true })
                        }}><i className="ri-delete-bin-6-fill"></i> Clear</button>
                        <button type='submit' onClick={() => {
                          const slider = document.querySelector(".slider")
                          slider.classList.add("go")
                          slider.addEventListener('animationend', () => {
                            slider.classList.remove("go")
                            setFilter(!filter)
                          }, { once: true })
                        }}>Apply</button>
                      </div>
                    </form> : <div>
                      <section>Larger than</section>
                      <section>
                        <input type="number" placeholder='Width (px)' name="width" value={sizeFilter.width > 0 ? sizeFilter.width : ""} onChange={handleSize} />
                        x
                        <input type="number" placeholder='Height (px)' name="height" value={sizeFilter.height > 0 ? sizeFilter.height : ""} onChange={handleSize} />
                      </section>
                      <section>
                        <button onClick={() => {
                          clearSize()
                          document.getElementById("sizeslider").removeAttribute("open")
                        }}><i className="ri-delete-bin-6-fill"></i> Clear</button>
                        <button onClick={(e) => { handleSubmiteSize(e); document.getElementById("sizeslider").removeAttribute("open") }}>Apply</button>
                      </section>
                    </div>
                    }
                  </details>
                  <details className='color' id='colorslider'>
                    <summary>
                      Color <i className="ri-arrow-down-s-line"></i>
                    </summary>
                    <div className='color-div'>
                      <section className='transparent-con'>
                        <label htmlFor="transparent">
                          Transparent background
                          <input type="checkbox" id='transparent' checked={colorFilter.includes("transparent")} onChange={() => toggleColor("transparent", "one")} />
                        </label>
                      </section>
                      <section className="black-white">
                        <label htmlFor="black-white">
                          Black and white
                          <input type="checkbox" id='black-white'
                            checked={colorFilter.includes("grayscale")}
                            onChange={() => toggleColor("grayscale", "second")} />
                        </label>
                      </section>
                      <section className='color-con'>
                        {Object.entries(colors).map((ele, idx) => <input type="checkbox" title={ele[0].substring(0, 1).toUpperCase() + ele[0].substring(1)} style={{ backgroundColor: `${ele[1]}` }}
                          checked={colorFilter.includes(ele[0])} key={idx} onChange={() => toggleColor(ele[0], "third")} />
                        )}
                      </section>
                      <section className='button-con'>
                        <button onClick={() => {
                          applyColor("clear");

                          if (size > 1024) {
                            document.getElementById("colorslider").removeAttribute("open")
                          } else {
                            const slider = document.querySelector(".slider")
                            slider.classList.add("go")
                            slider.addEventListener('animationend', () => {
                              slider.classList.remove("go")
                              setFilter(!filter)
                            }, { once: true })
                          }
                        }}><i className="ri-delete-bin-6-fill"></i> Clear</button>
                        <button onClick={() => {
                          applyColor("apply")
                          if (size > 1024) {
                            document.getElementById("colorslider").removeAttribute("open")
                          } else {
                            const slider = document.querySelector(".slider")
                            slider.classList.add("go")
                            slider.addEventListener('animationend', () => {
                              slider.classList.remove("go")
                              setFilter(!filter)
                            }, { once: true })
                          }
                          ;
                        }}>Apply</button>
                      </section>
                    </div>
                  </details>
                  {(searchParam.has("orientation") || searchParam.has("min_width") || searchParam.has("min_height") || searchParam.has("colors")) && <button className='globalClear' onClick={() => {
                    const para = new URLSearchParams();
                    searchParam.has("order") && ["ec", "latest", "popular"].includes(searchParam.get("order")) ? para.set("order", searchParam.get("order")) : null;
                    setSearchParam(para);
                    const slider = document.querySelector(".slider")
                    slider.classList.add("go")
                    slider.addEventListener('animationend', () => {
                      slider.classList.remove("go")
                      setFilter(!filter)
                    }, { once: true })
                  }}><i className="ri-delete-bin-6-fill"></i> Clear all</button>}
                </div>
              </div>
            </div>}
          </div>
          <div className={size < 1025 ? "filter2-mob" : "filter2-web"}>
            <details>
              <summary id='orderslider'>
                {searchParam.get("order") === "ec" ? "Editor's Choice" : searchParam.get("order") === "popular" ? "Popular" : "Latest"} <i className="ri-arrow-down-s-line"></i>
              </summary>
              <div>
                <span className={searchParam.get("order") === "ec" ? 'cat-3 green' : 'cat-3'} onClick={() => orderFilter("ec")}>
                  Editor's Choice
                </span>
                <span className={((searchParam.get("order") !== "ec" && searchParam.get("order") !== "popular")) ? 'cat-1 green' : 'cat-1'} onClick={() => {
                  orderFilter("latest")
                }}>
                  Latest
                </span>
                <span className={searchParam.get("order") === "popular" ? 'cat-3 green' : 'cat-3'} onClick={() => {
                  orderFilter("popular")
                }}>
                  Popular
                </span>
              </div>
            </details>
          </div>
        </div>
      </div>
      <div className="middle">
        <h2>Something went wrong</h2>
        <p>We couldn’t connect to the server. Please check your internet connection or try again later.</p>
      </div>
      <div className="lower noresult">
      </div>
    </div>
    {ai && <PixoraAI setAi={setAi} />}
    <AiButton setAi={setAi} />
  </>

  if (data && data.pages[0].hits.length === 0) return <>
    <div className='main-div'>
      <div className="upper">
        <div className="upper-wrapper">
          <div className={size < 1025 ? "filter1-mob" : "filter1-web"}>
            {size < 1025 && <button onClick={() => { setFilter(!filter) }}><i className="ri-equalizer-2-fill"></i> Filters {filterCount !== 0 && <span>({filterCount})</span>}</button>}
            {(size >= 1025 || filter) && <div className={size < 1025 ? "slider mobile" : "slider web"}>
              <div className="filter1-wrapper">
                {size < 1025 && <div className="header-filter">
                  <h4>Filters</h4>
                  <i onClick={() => {
                    //go animation
                    const slider = document.querySelector(".slider")
                    slider.classList.add("go")
                    slider.addEventListener('animationend', () => {
                      slider.classList.remove("go")
                      setFilter(!filter)
                    }, { once: true })

                  }} className="ri-close-line"></i>
                </div>}
                <div className="body-filter">
                  <details className='catagory'>
                    <summary id='catslider'>
                      {cat === "images" ? "All images" : cat.substring(0, 1).toUpperCase() + cat.substring(1)} <i className="ri-arrow-down-s-line"></i>
                    </summary>
                    <div>
                      <span className={cat === "images" ? 'cat-1 green' : 'cat-1'} onClick={() => {
                        if (cat !== "images") {
                          categoryFilter("images")
                        }
                      }}>
                        <i className="ri-image-fill"></i> All images
                      </span>
                      <span className='cat-2'>
                        <p className={cat === "photos" ? "green" : ""} onClick={() => {
                          if (cat !== "photos") {
                            categoryFilter("photos")
                          }
                        }}><i className="ri-camera-fill"></i> Photos</p>
                        <p className={cat === "illustrations" ? "green" : ""} onClick={() => {
                          if (cat !== "illustrations") {
                            categoryFilter("illustrations")
                          }
                        }}><i className="ri-ball-pen-fill"></i> Illustrations</p>
                        <p className={cat === "vectors" ? "green" : ""}
                          onClick={() => {
                            if (cat !== "vectors") {
                              categoryFilter("vectors")
                            }
                          }}><i className="ri-pen-nib-fill"></i> Vectors</p>
                      </span>
                      <span className={cat === "videos" ? 'cat-3 green' : "cat-3"} onClick={() => {
                        if (cat !== "videos") {
                          categoryFilter("videos")
                        }
                      }}>
                        <i className="ri-video-on-fill"></i> Videos
                      </span>
                    </div>
                  </details>
                  <details className='orientation'>
                    <summary id='orientationslider' >
                      {searchParam.has("orientation") && ["horizontal", "vertical"].includes(searchParam.get("orientation")) ? searchParam.get("orientation").substring(0, 1).toUpperCase() + searchParam.get("orientation").substring(1) : "Orientation"}<i className="ri-arrow-down-s-line"></i>
                    </summary>
                    <div>
                      <span className={!searchParam.has("orientation") || (searchParam.get("orientation") !== "horizontal" && searchParam.get("orientation") !== "vertical") ? 'cat-1 green' : 'cat-1'} onClick={() => handleOrientation("any")}>
                        Any
                      </span>
                      <span className={searchParam.get("orientation") === "horizontal" ? 'cat-1 green' : 'cat-1'} onClick={() => handleOrientation("horizontal")}>
                        Horizontal
                      </span>
                      <span className={searchParam.get("orientation") === "vertical" ? 'cat-3 green' : 'cat-3'} onClick={() => handleOrientation("vertical")}>
                        Vertical
                      </span>
                    </div>
                  </details>
                  <details className='size' id='sizeslider'>
                    <summary>
                      {(searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) && (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) ? `> ${searchParam.get("min_width")} x ${searchParam.get("min_height")}` : (searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) ? `> ${searchParam.get("min_width")} wide` : (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) ? `> ${searchParam.get("min_height")} high` : "Sizes"} <i className="ri-arrow-down-s-line"></i>
                    </summary>
                    {size < 1025 ? <form onSubmit={handleSubmiteSize}>
                      <div>Larger than</div>
                      <div>
                        <input type="number" placeholder='Width (px)' name="width" value={sizeFilter.width > 0 ? sizeFilter.width : ""} onChange={handleSize} />
                        x
                        <input type="number" placeholder='Height (px)' name="height" value={sizeFilter.height > 0 ? sizeFilter.height : ""} onChange={handleSize} />
                      </div>
                      <div>
                        <button type='button' onClick={() => {
                          clearSize()
                          const slider = document.querySelector(".slider")
                          slider.classList.add("go")
                          slider.addEventListener('animationend', () => {
                            slider.classList.remove("go")
                            setFilter(!filter)
                          }, { once: true })
                        }}><i className="ri-delete-bin-6-fill"></i> Clear</button>
                        <button type='submit' onClick={() => {
                          const slider = document.querySelector(".slider")
                          slider.classList.add("go")
                          slider.addEventListener('animationend', () => {
                            slider.classList.remove("go")
                            setFilter(!filter)
                          }, { once: true })
                        }}>Apply</button>
                      </div>
                    </form> : <div>
                      <section>Larger than</section>
                      <section>
                        <input type="number" placeholder='Width (px)' name="width" value={sizeFilter.width > 0 ? sizeFilter.width : ""} onChange={handleSize} />
                        x
                        <input type="number" placeholder='Height (px)' name="height" value={sizeFilter.height > 0 ? sizeFilter.height : ""} onChange={handleSize} />
                      </section>
                      <section>
                        <button onClick={() => {
                          clearSize()
                          document.getElementById("sizeslider").removeAttribute("open")
                        }}><i className="ri-delete-bin-6-fill"></i> Clear</button>
                        <button onClick={(e) => { handleSubmiteSize(e); document.getElementById("sizeslider").removeAttribute("open") }}>Apply</button>
                      </section>
                    </div>
                    }
                  </details>
                  <details className='color' id='colorslider'>
                    <summary>
                      Color <i className="ri-arrow-down-s-line"></i>
                    </summary>
                    <div className='color-div'>
                      <section className='transparent-con'>
                        <label htmlFor="transparent">
                          Transparent background
                          <input type="checkbox" id='transparent' checked={colorFilter.includes("transparent")} onChange={() => toggleColor("transparent", "one")} />
                        </label>
                      </section>
                      <section className="black-white">
                        <label htmlFor="black-white">
                          Black and white
                          <input type="checkbox" id='black-white'
                            checked={colorFilter.includes("grayscale")}
                            onChange={() => toggleColor("grayscale", "second")} />
                        </label>
                      </section>
                      <section className='color-con'>
                        {Object.entries(colors).map((ele, idx) => <input type="checkbox" title={ele[0].substring(0, 1).toUpperCase() + ele[0].substring(1)} style={{ backgroundColor: `${ele[1]}` }}
                          checked={colorFilter.includes(ele[0])} key={idx} onChange={() => toggleColor(ele[0], "third")} />
                        )}
                      </section>
                      <section className='button-con'>
                        <button onClick={() => {
                          applyColor("clear");

                          if (size > 1024) {
                            document.getElementById("colorslider").removeAttribute("open")
                          } else {
                            const slider = document.querySelector(".slider")
                            slider.classList.add("go")
                            slider.addEventListener('animationend', () => {
                              slider.classList.remove("go")
                              setFilter(!filter)
                            }, { once: true })
                          }
                        }}><i className="ri-delete-bin-6-fill"></i> Clear</button>
                        <button onClick={() => {
                          applyColor("apply")
                          if (size > 1024) {
                            document.getElementById("colorslider").removeAttribute("open")
                          } else {
                            const slider = document.querySelector(".slider")
                            slider.classList.add("go")
                            slider.addEventListener('animationend', () => {
                              slider.classList.remove("go")
                              setFilter(!filter)
                            }, { once: true })
                          }
                          ;
                        }}>Apply</button>
                      </section>
                    </div>
                  </details>
                  {(searchParam.has("orientation") || searchParam.has("min_width") || searchParam.has("min_height") || searchParam.has("colors")) && <button className='globalClear' onClick={() => {
                    const para = new URLSearchParams();
                    searchParam.has("order") && ["ec", "latest", "popular"].includes(searchParam.get("order")) ? para.set("order", searchParam.get("order")) : null;
                    setSearchParam(para);
                    const slider = document.querySelector(".slider")
                    slider.classList.add("go")
                    slider.addEventListener('animationend', () => {
                      slider.classList.remove("go")
                      setFilter(!filter)
                    }, { once: true })
                  }}><i className="ri-delete-bin-6-fill"></i> Clear all</button>}
                </div>
              </div>
            </div>}
          </div>
          <div className={size < 1025 ? "filter2-mob" : "filter2-web"}>
            <details>
              <summary id='orderslider'>
                {searchParam.get("order") === "ec" ? "Editor's Choice" : searchParam.get("order") === "popular" ? "Popular" : "Latest"} <i className="ri-arrow-down-s-line"></i>
              </summary>
              <div>
                <span className={searchParam.get("order") === "ec" ? 'cat-3 green' : 'cat-3'} onClick={() => orderFilter("ec")}>
                  Editor's Choice
                </span>
                <span className={((searchParam.get("order") !== "ec" && searchParam.get("order") !== "popular")) ? 'cat-1 green' : 'cat-1'} onClick={() => {
                  orderFilter("latest")
                }}>
                  Latest
                </span>
                <span className={searchParam.get("order") === "popular" ? 'cat-3 green' : 'cat-3'} onClick={() => {
                  orderFilter("popular")
                }}>
                  Popular
                </span>
              </div>
            </details>
          </div>
        </div>
      </div>
      <div className="middle">
        <h2>No results found</h2>
        <p>We couldn’t find any matches for your selected filters. Please try adjusting your filters and search again.</p>
      </div>
      <div className="lower noresult">
      </div>
    </div>
    {ai && <PixoraAI setAi={setAi} />}
    <AiButton setAi={setAi} />
  </>

  return <>
    <div className='main-div'>
      <div className="upper">
        <div className="upper-wrapper">
          <div className={size < 1025 ? "filter1-mob" : "filter1-web"}>
            {size < 1025 && <button onClick={() => { setFilter(!filter) }}><i className="ri-equalizer-2-fill"></i> Filters {filterCount !== 0 && <span>({filterCount})</span>}</button>}
            {(size >= 1025 || filter) && <div className={size < 1025 ? "slider mobile" : "slider web"}>
              <div className="filter1-wrapper">
                {size < 1025 && <div className="header-filter">
                  <h4>Filters</h4>
                  <i onClick={() => {
                    //go animation
                    const slider = document.querySelector(".slider")
                    slider.classList.add("go")
                    slider.addEventListener('animationend', () => {
                      slider.classList.remove("go")
                      setFilter(!filter)
                    }, { once: true })

                  }} className="ri-close-line"></i>
                </div>}
                <div className="body-filter">
                  <details className='catagory'>
                    <summary id='catslider'>
                      {cat === "images" ? "All images" : cat.substring(0, 1).toUpperCase() + cat.substring(1)} <i className="ri-arrow-down-s-line"></i>
                    </summary>
                    <div>
                      <span className={cat === "images" ? 'cat-1 green' : 'cat-1'} onClick={() => {
                        if (cat !== "images") {
                          categoryFilter("images")
                        }
                      }}>
                        <i className="ri-image-fill"></i> All images
                      </span>
                      <span className='cat-2'>
                        <p className={cat === "photos" ? "green" : ""} onClick={() => {
                          if (cat !== "photos") {
                            categoryFilter("photos")
                          }
                        }}><i className="ri-camera-fill"></i> Photos</p>
                        <p className={cat === "illustrations" ? "green" : ""} onClick={() => {
                          if (cat !== "illustrations") {
                            categoryFilter("illustrations")
                          }
                        }}><i className="ri-ball-pen-fill"></i> Illustrations</p>
                        <p className={cat === "vectors" ? "green" : ""}
                          onClick={() => {
                            if (cat !== "vectors") {
                              categoryFilter("vectors")
                            }
                          }}><i className="ri-pen-nib-fill"></i> Vectors</p>
                      </span>
                      <span className={cat === "videos" ? 'cat-3 green' : "cat-3"} onClick={() => {
                        if (cat !== "videos") {
                          categoryFilter("videos")
                        }
                      }}>
                        <i className="ri-video-on-fill"></i> Videos
                      </span>
                    </div>
                  </details>
                  <details className='orientation'>
                    <summary id='orientationslider' >
                      {searchParam.has("orientation") && ["horizontal", "vertical"].includes(searchParam.get("orientation")) ? searchParam.get("orientation").substring(0, 1).toUpperCase() + searchParam.get("orientation").substring(1) : "Orientation"}<i className="ri-arrow-down-s-line"></i>
                    </summary>
                    <div>
                      <span className={!searchParam.has("orientation") || (searchParam.get("orientation") !== "horizontal" && searchParam.get("orientation") !== "vertical") ? 'cat-1 green' : 'cat-1'} onClick={() => handleOrientation("any")}>
                        Any
                      </span>
                      <span className={searchParam.get("orientation") === "horizontal" ? 'cat-1 green' : 'cat-1'} onClick={() => handleOrientation("horizontal")}>
                        Horizontal
                      </span>
                      <span className={searchParam.get("orientation") === "vertical" ? 'cat-3 green' : 'cat-3'} onClick={() => handleOrientation("vertical")}>
                        Vertical
                      </span>
                    </div>
                  </details>
                  <details className='size' id='sizeslider'>
                    <summary>
                      {(searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) && (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) ? `> ${searchParam.get("min_width")} x ${searchParam.get("min_height")}` : (searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) ? `> ${searchParam.get("min_width")} wide` : (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) ? `> ${searchParam.get("min_height")} high` : "Sizes"} <i className="ri-arrow-down-s-line"></i>
                    </summary>
                    {size < 1025 ? <form onSubmit={handleSubmiteSize}>
                      <div>Larger than</div>
                      <div>
                        <input type="number" placeholder='Width (px)' name="width" value={sizeFilter.width > 0 ? sizeFilter.width : ""} onChange={handleSize} />
                        x
                        <input type="number" placeholder='Height (px)' name="height" value={sizeFilter.height > 0 ? sizeFilter.height : ""} onChange={handleSize} />
                      </div>
                      <div>
                        <button type='button' onClick={() => {
                          clearSize()
                          const slider = document.querySelector(".slider")
                          slider.classList.add("go")
                          slider.addEventListener('animationend', () => {
                            slider.classList.remove("go")
                            setFilter(!filter)
                          }, { once: true })
                        }}><i className="ri-delete-bin-6-fill"></i> Clear</button>
                        <button type='submit' onClick={() => {
                          const slider = document.querySelector(".slider")
                          slider.classList.add("go")
                          slider.addEventListener('animationend', () => {
                            slider.classList.remove("go")
                            setFilter(!filter)
                          }, { once: true })
                        }}>Apply</button>
                      </div>
                    </form> : <div>
                      <section>Larger than</section>
                      <section>
                        <input type="number" placeholder='Width (px)' name="width" value={sizeFilter.width > 0 ? sizeFilter.width : ""} onChange={handleSize} />
                        x
                        <input type="number" placeholder='Height (px)' name="height" value={sizeFilter.height > 0 ? sizeFilter.height : ""} onChange={handleSize} />
                      </section>
                      <section>
                        <button onClick={() => {
                          clearSize()
                          document.getElementById("sizeslider").removeAttribute("open")
                        }}><i className="ri-delete-bin-6-fill"></i> Clear</button>
                        <button onClick={(e) => { handleSubmiteSize(e); document.getElementById("sizeslider").removeAttribute("open") }}>Apply</button>
                      </section>
                    </div>
                    }
                  </details>
                  <details className='color' id='colorslider'>
                    <summary>
                      Color <i className="ri-arrow-down-s-line"></i>
                    </summary>
                    <div className='color-div'>
                      <section className='transparent-con'>
                        <label htmlFor="transparent">
                          Transparent background
                          <input type="checkbox" id='transparent' checked={colorFilter.includes("transparent")} onChange={() => toggleColor("transparent", "one")} />
                        </label>
                      </section>
                      <section className="black-white">
                        <label htmlFor="black-white">
                          Black and white
                          <input type="checkbox" id='black-white'
                            checked={colorFilter.includes("grayscale")}
                            onChange={() => toggleColor("grayscale", "second")} />
                        </label>
                      </section>
                      <section className='color-con'>
                        {Object.entries(colors).map((ele, idx) => <input type="checkbox" title={ele[0].substring(0, 1).toUpperCase() + ele[0].substring(1)} style={{ backgroundColor: `${ele[1]}` }}
                          checked={colorFilter.includes(ele[0])} key={idx} onChange={() => toggleColor(ele[0], "third")} />
                        )}
                      </section>
                      <section className='button-con'>
                        <button onClick={() => {
                          applyColor("clear");

                          if (size > 1024) {
                            document.getElementById("colorslider").removeAttribute("open")
                          } else {
                            const slider = document.querySelector(".slider")
                            slider.classList.add("go")
                            slider.addEventListener('animationend', () => {
                              slider.classList.remove("go")
                              setFilter(!filter)
                            }, { once: true })
                          }
                        }}><i className="ri-delete-bin-6-fill"></i> Clear</button>
                        <button onClick={() => {
                          applyColor("apply")
                          if (size > 1024) {
                            document.getElementById("colorslider").removeAttribute("open")
                          } else {
                            const slider = document.querySelector(".slider")
                            slider.classList.add("go")
                            slider.addEventListener('animationend', () => {
                              slider.classList.remove("go")
                              setFilter(!filter)
                            }, { once: true })
                          }
                          ;
                        }}>Apply</button>
                      </section>
                    </div>
                  </details>
                  {(searchParam.has("orientation") || searchParam.has("min_width") || searchParam.has("min_height") || searchParam.has("colors")) && <button className='globalClear' onClick={() => {
                    const para = new URLSearchParams();
                    searchParam.has("order") && ["ec", "latest", "popular"].includes(searchParam.get("order")) ? para.set("order", searchParam.get("order")) : null;
                    setSearchParam(para);
                    const slider = document.querySelector(".slider")
                    slider.classList.add("go")
                    slider.addEventListener('animationend', () => {
                      slider.classList.remove("go")
                      setFilter(!filter)
                    }, { once: true })
                  }}><i className="ri-delete-bin-6-fill"></i> Clear all</button>}
                </div>
              </div>
            </div>}
          </div>
          <div className={size < 1025 ? "filter2-mob" : "filter2-web"}>
            <details>
              <summary id='orderslider'>
                {searchParam.get("order") === "ec" ? "Editor's Choice" : searchParam.get("order") === "popular" ? "Popular" : "Latest"} <i className="ri-arrow-down-s-line"></i>
              </summary>
              <div>
                <span className={searchParam.get("order") === "ec" ? 'cat-3 green' : 'cat-3'} onClick={() => orderFilter("ec")}>
                  Editor's Choice
                </span>
                <span className={((searchParam.get("order") !== "ec" && searchParam.get("order") !== "popular")) ? 'cat-1 green' : 'cat-1'} onClick={() => {
                  orderFilter("latest")
                }}>
                  Latest
                </span>
                <span className={searchParam.get("order") === "popular" ? 'cat-3 green' : 'cat-3'} onClick={() => {
                  orderFilter("popular")
                }}>
                  Popular
                </span>
              </div>
            </details>
          </div>
        </div>
      </div>
      <div className="middle">
        <h2 style={{ textTransform: "capitalize" }}>{data && data.pages[0].total.toLocaleString("en-IN")} Free {text} {cat}</h2>
      </div>
      <div className="lower">
        <div className="lower-heading">Royalty-free vectors</div>
        <div className='main-card-con'>
          <div className='frame'>
            <div className='container'>
              {<div>
                {data && data.pages.map((page) => page.hits.map((ele) => ele)).flat().map((ele, idx) => {
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
                {data && data.pages.map((page) => page.hits.map((ele) => ele)).flat().map((ele, idx) => {
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
                {data && data.pages.map((page) => page.hits.map((ele) => ele)).flat().map((ele, idx) => {
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

              {size > 1280 && <div>
                {data && data.pages.map((page) => page.hits.map((ele) => ele)).flat().map((ele, idx) => {
                  if (idx % count === 3) {
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
          </div>
        </div>
        {isFetching && <div className='loader'><CircularProgress size={30} color='black' /></div>}
        <div className='hidden-div' ref={ref}></div>
      </div>
    </div>
    {ai && <PixoraAI setAi={setAi} />}
    <AiButton setAi={setAi} />
  </>
}

export default Main