import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Icon,
  IconButton,
  Modal,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Description,
  LogoutRounded,
  MoreOutlined,
  Search,
  Storm,
  ThunderstormOutlined,
  Water,
} from "@mui/icons-material";
import { io } from "socket.io-client";
import axios from "axios";
import { Context } from "../context/GlobalProvider";
import { useDispatch, useSelector } from "react-redux";
import { updateLoading } from "../redux/loading";
import { updateUser } from "../redux/user";
import Mailing from "./Mailing";
import MailingModal, { style } from "./MailingModal";
import { updatePreference } from "../redux/preference";

const Dashboard = () => {
  axios.defaults.withCredentials = true;
  const { clear, clouds, drizzle, mist, rain, snow, humidity, wind, cookie, deviceWidth } =
    useContext(Context);

  const dispatch = useDispatch();

  const authenticated = useSelector((state) => state.user?.isAuthenticated);
  const email = useSelector((state) => state.user?.username);

  const [modalOpen, setModalOpen] = useState(false);

  const isUserAuthenticated = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_NEST_URI}/auth/status`,
      {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + cookie?.jwtToken,
        },
      }
    );

    const { isAuthenticated, _doc } = response.data;
    const { firstName, lastName, username } = _doc;

    const state = {
      isAuthenticated,
      firstName,
      lastName,
      username,
    };

    dispatch(updateUser(state));
  };


  useEffect(() => {
    isUserAuthenticated();
  }, []);

  const [weather, setWeather] = useState({
    icon: "",
    temp: 0,
    cityName: "",
    wind: 0,
    humidity: 0,
    description: "",
    sys: {},
    ic: "",
  });
  const [locat, setLocat] = useState("");
  const [pref, setPref] = useState("");

  const icons = [clear, clouds, drizzle, mist, rain, snow, humidity, wind];

  const handleFetch = async () => {
    try {
      dispatch(updateLoading(true));
      const response = await axios.get(
        `${process.env.REACT_APP_NEST_URI}/weather`
      );

      setData(response, setWeather, dispatch);
    } catch (error) {
      dispatch(updateLoading(false));
      console.log(error.message);
    }
  };

  const [location, setLocation] = useState("");

  const getCurrentPreference = async () => {
    try {
      dispatch(updateLoading(true));

      const response = await axios.get(
        `${process.env.REACT_APP_NEST_URI}/weather/getPreference/${email}`
      );

      const { success, preference } = response.data;
      setLocat(preference?.location);
      preference?.preference
        ? setPref(preference.preference)
        : setPref("choose");

      dispatch(updatePreference(preference));
      dispatch(updateLoading(false));
    } catch (error) {
      console.log(error.message);
      dispatch(updateLoading(false));
    }
  };
  useEffect(() => {
    handleFetch();
    getCurrentPreference();
  }, []);

  const handleSearchWeather = async () => {
    if (location) {
      try {
        dispatch(updateLoading(true));
        const endpoint = `${process.env.REACT_APP_NEST_URI}/weather/location/${location}`;

        const response = await axios.get(endpoint);

        setData(response, setWeather, dispatch);
      } catch (error) {
        dispatch(updateLoading(false));
        console.log(error.message);
      }
    }
  };


  const weatherIcon = (iconName) => {

    let toLower = iconName.toLowerCase();
    if (toLower == "rainy" || toLower == "Rainy") toLower = "rain";
    switch (toLower) {
      case "clouds":
        return <img src={clouds} alt={toLower} width="100px" />;
      case "clear":
        return <img src={clear} alt={toLower} width="100px" />;
      case "drizzle":
        return <img src={drizzle} alt={toLower} width="100px" />;
      case "mist":
        return <img src={mist} alt={toLower} width="100px" />;
      case "snow":
        return <img src={snow} alt={toLower} width="100px" />;
      case "humidity":
        return <img src={humidity} alt={toLower} width="100px" />;
      case "wind":
        return <img src={wind} alt={toLower} width="100px" />;
      default:
        return <img src={rain} alt={toLower} width="100px" />;
    }

  };

  const handleLogout = async () => {
    const response = await axios.post(
      `${process.env.REACT_APP_NEST_URI}/auth/logout`,
      {},
      {

        withCredentials: true,
      }
    );
    const { message } = response.data;
  };

  return (
    <Container width="100%" sx={{ position: "relative" }}>
      {/* {authenticated && (
        <Button
          onClick={handleLogout}
          sx={{ position: "absolute", right: "0", top: "1rem" }}
          variant="contained"
          color="error"
        >
          <LogoutRounded /> Logout
        </Button>
      )} */}

      <Typography
        flexGrow={1}
        textAlign="center"
        variant="h4"
        color="primary"
        p={2}
        marginBottom="2rem"
      >
        <ThunderstormOutlined />
        Weather Mailer
        <ThunderstormOutlined />
      </Typography>

      {deviceWidth <= 767 && <Button onClick={() => setModalOpen(true)} variant="contained" color="primary" sx={{ marginBottom: '1rem' }}>Configure Preferences</Button>}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={style}>
          <MailingModal
            setModalOpen={setModalOpen}
            icons={icons}
            weatherIcon={weatherIcon}
            locat={locat}
            setLocat={setLocat}
            pref={pref}
            setPref={setPref}
          />
        </Box>

      </Modal>

      <Stack direction="row" justifyContent={deviceWidth <= 767 ? "center" : "space-between"} spacing={5}>
        {deviceWidth > 767 && <MailingModal
          setModalOpen={setModalOpen}
          icons={icons}
          weatherIcon={weatherIcon}
          locat={locat}
          setLocat={setLocat}
          pref={pref}
          setPref={setPref}
        />}
        <Stack direction="column" spacing={2} width={deviceWidth <= 767 ? "400px" : "500px"}>
          <Stack direction="row" spacing={0.1}>
            <TextField
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              size="small"
              label="country, city, or town name ...."
              sx={{ flexGrow: 1 }}
            />
            <Tooltip title="search...">
              <IconButton onClick={handleSearchWeather}>
                <Search fontSize="50" color="primary" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/*  */}
          <Stack direction="column" spacing={1}>
            <Stack direction="row">
              <Typography variant="caption" flexGrow={1}>
                {weather?.sys?.country}
              </Typography>
              <Typography variant="caption">
                {weather?.icon.toLowerCase()}
              </Typography>
            </Stack>
            <Typography flexGrow={1} textAlign="center" color="secondary">
              {weather?.description}
            </Typography>
          </Stack>

          <Divider />

          {/*  */}
          <Grid container spacing={2} alignItems="center">
            <Grid xs={4} item>
              {weatherIcon(weather?.icon)}
            </Grid>
            <Grid xs={4} item>
              <Typography variant="h5"> {weather?.temp}&deg;C</Typography>
            </Grid>
            <Grid xs={4} item>
              <Typography variant="h5">{weather?.cityName}</Typography>
            </Grid>
          </Grid>
          <Divider />

          {/*  */}

          <Grid container width={deviceWidth <= 767 ? "400px" : "500px"} alignItems="center" spacing={2}>
            <Grid item xs={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Storm fontSize="large" color="secondary" />
                <Stack direction="column" spacing={1}>
                  <Typography variant="h6">windspeed</Typography>
                  <Typography variant="caption">{weather?.wind}m/s</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                paddingLeft={10}
              >
                <Water fontSize="large" color="secondary" />
                <Stack direction="column" spacing={1}>
                  <Typography variant="h6">Humidity</Typography>
                  <Typography variant="caption">
                    {weather?.humidity}%
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

          </Grid>
          <Divider sx={{ marginTop: "3rem" }} />
        </Stack>
      </Stack>
    </Container >
  );
};

export const setData = (response, setWeather, dispatch) => {
  const { name, main, weather, wind, sys } = response.data;
  dispatch(updateLoading(false));
  setWeather({
    icon: weather[0].main,
    temp: Math.round(main.temp - 273.15),
    cityName: name,
    wind: wind.speed,
    humidity: main.humidity,
    description: weather[0].description,
    sys,
    ic: weather[0].icon,
  });
};

export default Dashboard;
