import React, { useEffect, useState } from "react";
import { createContext } from "react";
import clear from "../images/clear.png";
import clouds from "../images/clouds.png";
import drizzle from "../images/drizzle.png";
import mist from "../images/mist.png";
import rain from "../images/rain.png";
import snow from "../images/snow.png";
import humidity from "../images/humidity.png";
import wind from "../images/wind.png";
import { useCookies } from "react-cookie";

export const Context = createContext(null);

const GlobalProvider = ({ children }) => {
  const [cookie, setCookie] = useCookies(["jwtToken"]);

  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

  useEffect(() => {


    const handleResizeChange = () => {
      setDeviceWidth(window.innerWidth)
    }

 window.addEventListener('resize',handleResizeChange) 
return ()=>window.removeEventListener('resize',handleResizeChange)
  }, [])

  const values = {
    clear,
    clouds,
    drizzle,
    mist,
    rain,
    snow,
    humidity,
    wind,
    cookie,
    setCookie,
    deviceWidth
  };
  return <Context.Provider value={values}>{children}</Context.Provider>;
};

export default GlobalProvider;
