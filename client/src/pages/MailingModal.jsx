import * as React from "react";
import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from "sonner";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLoading } from "../redux/loading";
import {
  Cancel,
  LocationCityOutlined,
  LocationOn,
  WbSunny,
} from "@mui/icons-material";
import { updatePreference } from "../redux/preference";
import { Context } from "../context/GlobalProvider";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function MailingModal({
  setModalOpen,
  icons,
  weatherIcon,
  locat,
  setLocat,
  pref,
  setPref,
}) {
  const { deviceWidth } = useContext(Context);

  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user?.username);

  const preferenceModel = useSelector((state) => state.preference);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEmailSubscription = async () => {
    if (locat && pref) {
      try {
        dispatch(updateLoading(true));
        const response = await axios.post(
          `${process.env.REACT_APP_NEST_URI}/weather/subscribe`,
          {
            location: locat,
            preference: pref,
            email,
          },
          {
            withCredentials: true,
          }
        );


        const { success, message, currentPreference } = response.data;

        dispatch(updatePreference(currentPreference));
        dispatch(updateLoading(false));
        handleClose();

        success
          ? (() => {
            toast.success(message);
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
    <div>
      {deviceWidth <= 767 &&
        <Stack direction="row" >
          <Typography sx={{ flexGrow: 1 }}>
          </Typography>

          <IconButton onClick={() => setModalOpen(false)} color="error" ><Cancel fontSize="medium" /> </IconButton>
        </Stack>}


      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        size="large"
        sx={{ marginBottom: "1rem" }}
      >
        {preferenceModel?.preference ? "Update" : "Create"} Your Email
        Preference
      </Button>
      {preferenceModel?.preference && (
        <Stack direction="column" spacing={1}>
          <Typography variant="h6">Your current settings are: </Typography>
          <List>
            <ListItem sx={{ background: "lightgrey" }}>
              <ListItemButton>
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText>{preferenceModel?.location}</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem sx={{ background: "lightgrey" }}>
              <ListItemButton>
                <ListItemIcon>
                  {preferenceModel?.preference == "rainy"
                    ? weatherIcon("rain")
                    : weatherIcon(preferenceModel?.preference)}
                </ListItemIcon>
                <ListItemText>{preferenceModel?.preference}</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Stack>
      )}
      {!preferenceModel?.preference && (
        <Typography variant="h6">You have no current settings </Typography>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack direction="column" spacing={2} flexGrow={0.7}>
            <Stack direction="row">
              <Typography flexGrow={1} />
              <IconButton onClick={handleClose}>
                <Cancel color="error" />
              </IconButton>
            </Stack>
            <Divider />
            <Typography>Choose your Email Preference</Typography>
            <TextField
              label="Name of your City/Town or Country"
              helperText="please use the search bar to your right to confirm if forecast is available for region you want to register"
              value={locat}
              onChange={(e) => setLocat(e.target.value)}
            />
            <Typography>Notify me when the weather condition is: </Typography>
            <FormControl fullWidth>
              <Select
                defaultValue={pref ? pref : "choose"}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                onChange={(e) => setPref(e.target.value)}
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
        </Box>
      </Modal>
    </div>
  );
}
