// reducers.js

// create matix for the UDL
const xx = 110;
const yy = 15;

var displayMatrix = [
  "1:" + `\n`,
  "2:" + `\n`,
  "3:" + `\n`,
  "4:" + `\n`,
  "5:" + `\n`,
  "6:" + `\n`,
  "7:" + `\n`,
  "8:" + `\n`,
  "9:" + `\n`,
  "10:" + `\n`,
];

const arrayOfZeros = new Array(120).fill(0);

const initialState = {
  config: {
    SaveLocation: "savelocation",
  },
  textEditorValue: "Send JSON or other text files from here",
  textEditorDeviceSelected: { id: 0, name: "Select Device", serial: "" },
  deviceList: [
    {
      id: 1,
      name: "Device Name",
      connectionType: false,
      IPAddress: "Not",
      port: "Connected",
      serial: "Insert Serial Number",
      terminal: [],
      log: [],
      UDL: displayMatrix,
      showTerminal: true,
      showLog: false,
      showUDL: false,
      showGraph: false,
      v1: arrayOfZeros,
      v2: arrayOfZeros,
      v3: arrayOfZeros,
      v4: arrayOfZeros,
      graphRange: { id: 2, name: "30" },
      xx: xx,
      yy: yy,
    },
  ],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_DEVICE":
      return {
        ...state,
        deviceList: action.payload,
      };

    case "TOGGLE_TERMINAL":
      const { terminalToggleId, newToggleState } = action.payload;
      const updatedTerminalToggle = state.deviceList.map((device) => {
        if (device.id === terminalToggleId) {
          return { ...device, showTerminal: newToggleState };
        }
        return device;
      });
      return {
        ...state,
        deviceList: updatedTerminalToggle,
      };

    case "UPDATE_TERMINAL":
      const { terminalID, newTerminalValue } = action.payload;
      const updatedTerminalValue = state.deviceList.map((device) => {
        if (device.id === terminalID) {
          // return { ...device, terminal: newTerminalValue };
          return {
            ...device,
            terminal: [...device.terminal, newTerminalValue],
          };
        }
        return device;
      });
      return {
        ...state,
        deviceList: updatedTerminalValue,
      };

    case "TOGGLE_LOG":
      const { LogToggleId, newLogToggleState } = action.payload;
      const updatedLogToggle = state.deviceList.map((device) => {
        if (device.id === LogToggleId) {
          return { ...device, showLog: newLogToggleState };
        }
        return device;
      });
      return {
        ...state,
        deviceList: updatedLogToggle,
      };

    case "UPDATE_LOG":
      const { LogId, newLogState } = action.payload;
      const updatedLog = state.deviceList.map((device) => {
        if (device.id === LogId) {
          // return { ...device, log: newLogState };
          return {
            ...device,
            log: [...device.log, newLogState],
          };
        }
        return device;
      });
      return {
        ...state,
        deviceList: updatedLog,
      };

    case "TOGGLE_GRAPH":
      const { graphID, newGraphState } = action.payload;
      const updatedGraphToggle = state.deviceList.map((device) => {
        if (device.id === graphID) {
          return { ...device, showGraph: newGraphState };
        }
        return device;
      });
      return {
        ...state,
        deviceList: updatedGraphToggle,
      };

    case "CHANGE_GRAPH_RANGE":
      const { graphRangeID, newGraphRange } = action.payload;
      const updatedGraphRange = state.deviceList.map((device) => {
        if (device.id === graphRangeID) {
          return { ...device, graphRange: newGraphRange };
        }
        return device;
      });
      return {
        ...state,
        deviceList: updatedGraphRange,
      };

    case "TOGGLE_UDL":
      const { UDLId, newUDLState } = action.payload;
      const updatedUDLToggle = state.deviceList.map((device) => {
        if (device.id === UDLId) {
          return { ...device, showUDL: newUDLState };
        }
        return device;
      });
      return {
        ...state,
        deviceList: updatedUDLToggle,
      };

    case "UPDATE_UDL":
      const { UDLUpdateID, newUDLValue } = action.payload;
      const updatedUDL = state.deviceList.map((device) => {
        if (device.id === UDLUpdateID) {
          return { ...device, UDL: newUDLValue };
        }
        return device;
      });
      return {
        ...state,
        deviceList: updatedUDL,
      };

    case "UPDATE_GRAPH":
      const { graphUpdateID, GraphData } = action.payload;
      const updatedGraph = state.deviceList.map((device) => {
        if (device.id === graphUpdateID) {
          return {
            ...device,
            v1: [...device.v1, GraphData.v1],
            v2: [...device.v2, GraphData.v2],
            v3: [...device.v3, GraphData.v3],
            v4: [...device.v4, GraphData.v4],
          };
        }
        return device;
      });
      return {
        ...state,
        deviceList: updatedGraph,
      };

    case "SET_TEXT_EDITOR_VARIABLE":
      return {
        ...state,
        textEditorValue: action.payload,
      };

    // settings
    case "SET_CONFIG":
      return {
        ...state,
        config: {
          ...state.config,
          [action.payload.key]: action.payload.value,
        },
      };

    default:
      return state;
  }
};

export default rootReducer;
