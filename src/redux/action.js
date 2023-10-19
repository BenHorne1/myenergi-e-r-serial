// action.js

// add a new device to the store
export const addDevice = (value) => ({
    type: "ADD_DEVICE",
    payload: value,
  });

  export const toggleTerminal = (terminalToggleId, newToggleState) => {
    return {
      type: "TOGGLE_TERMINAL",
      payload: { terminalToggleId, newToggleState },
    };
  };
  
  export const updateTerminal = (terminalID, newTerminalValue) => {
    return {
      type: "UPDATE_TERMINAL",
      payload: { terminalID, newTerminalValue },
    };
  };