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

  export const toggleLog = (LogToggleId, newLogToggleState) => {
    return {
      type: "TOGGLE_LOG",
      payload: { LogToggleId, newLogToggleState },
    };
  };
  
  export const updateLog = (LogId, newLogState) => {
    return {
      type: "UPDATE_LOG",
      payload: { LogId, newLogState },
    };
  };

  export const setTextEditorValue = (value) => ({
    type: "SET_TEXT_EDITOR_VARIABLE",
    payload: value,
  });

  export const setConfig = (key, value) => ({
    type: "SET_CONFIG",
    payload: { key, value },
  });
  