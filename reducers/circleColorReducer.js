import { skyBlue } from "../styles/AppStyles";

const initialCircleColor = {
  circleColor: skyBlue
};

const SET_CIRCLE_COLOR = "SET_CIRCLE_COLOR";

const circleColorReducer = (state = initialCircleColor, action) => {
  switch (action.type) {
    case SET_CIRCLE_COLOR:
      return {
        ...state,
        circleColor: action.payload
      };
    default:
      return state;
  }
};

export default circleColorReducer;
