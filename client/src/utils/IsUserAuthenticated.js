import axios from "axios";
import { updateUser } from "../redux/user";

export const isUserAuthenticated = async (cookie, dispatch) => {
  if (cookie?.jwtToken) {
    try {
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
    } catch (err) {
      console.log(err.message);
    }
  }

};
