import { SET_CURRENT_USER, SET_INTENT, USER_LOADING } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
  intent: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_INTENT:
      return {
        ...state,
        intent: action.payload
      }
    default:
      return state;
  }
}
