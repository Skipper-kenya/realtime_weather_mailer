import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from "sonner";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLoading } from "../redux/loading";

const Mailing = () => {
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user?.username);
  const [location, setLocation] = useState("");
  const [preference, setPreference] = useState("");

  const handleEmailSubscription = async () => {
    if (location && preference) {
      try {
        dispatch(updateLoading(true));
        const response = await axios.post(
          `${import.meta.env.VITE_NEST_URI}/weather/subscribe`,
          {
            location,
            preference,
            email,
          },
          {
            withCredentials: true,
          }
        );
        dispatch(updateLoading(false));

        const { success, message } = response.data;
        success
          ? (() => {
              toast.success(message);
              setLocation("");
            })()
          : toast.error("something went wrong!");
      } catch (err) {
        dispatch(updateLoading(false));
        console.log(err.message);
      }
    } else {
      toast.error("All fields are required");
    }
  };

  return (
    <Stack direction="column" spacing={2} flexGrow={0.7}>
      <Typography>Choose your Email Preference</Typography>
      <TextField
        label="Name of your City/Town or Country"
        helperText="please use the search bar to your right to confirm if forecast is available for region you want to register"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <Typography>Notify me when the weather condition is: </Typography>
      <FormControl fullWidth>
        <Select
          defaultValue="choose"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Age"
          onChange={(e) => setPreference(e.target.value)}
        >
          <MenuItem value="clear">Clear</MenuItem>
          <MenuItem value="clouds">Clouds</MenuItem>
          <MenuItem value="drizzle">Drizzle</MenuItem>
          <MenuItem value="mist">Mist</MenuItem>
          <MenuItem value="rainy">Rainy</MenuItem>
          <MenuItem value="snow">Snow</MenuItem>
          <MenuItem value="humidity">Humidity</MenuItem>
          <MenuItem value="wind">Wind</MenuItem>
          <MenuItem value="choose">select a value</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        size="large"
        onClick={handleEmailSubscription}
      >
        Subscribe to Email Notification
      </Button>
    </Stack>
  );
};

export default Mailing;
