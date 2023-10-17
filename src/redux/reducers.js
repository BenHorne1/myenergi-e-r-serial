// reducers.js

const initialState = {
  config: {
    SaveLocation: "savelocation",
  },
  textEditorValue: "Send JSON or other text files from here",
  textEditorDeviceSelected: { id: 0, name: "Select Device", serial: "" },
  deviceList: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_DEVICE":
      return {
        ...state,
        deviceList: action.payload,
      };

    default:
      return state;
  }
};

export default rootReducer;
