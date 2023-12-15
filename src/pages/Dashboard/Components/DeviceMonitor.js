import { useEffect, useState, memo, useCallback } from "react";
import ToggleCheckbox from "../../../components/ToggleCheckbox";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleGraph,
  toggleLog,
  toggleTerminal,
  updateGraph,
  updateLog,
  updateTerminal,
} from "../../../redux/action";
import Terminal from "./Widgets/Terminal";
import Log from "./Widgets/Log";
import GraphWindow from "./Widgets/Graph/GraphWindow";

// Optional filters to limit what serial ports are returned
let filters = [{}];
let port;
let buffer = "";
let newTerminalOutput;

const DeviceMonitor = memo(function DeviceMonitor({ id, thisDevice }) {
  // console.log("this device", thisDevice);

  const dispatch = useDispatch();
  //const thisDevice = useSelector((state) => state.deviceList[id]);

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [listOfPorts, setListOfPorts] = useState([]);
  const [selected, setSelected] = useState();

  useEffect(() => {});

  window.indexBridge.once("port:list", (e, options) => {
    setListOfPorts(e);
    console.log("clicked drop down", e);
  });

  // handlers for show widgets
  const handleTerminalToggle = (isChecked) => {
    dispatch(toggleTerminal(id, isChecked));
  };

  const handleLogToggle = (isChecked) => {
    dispatch(toggleLog(id, isChecked));
  };

  const handleGraphToggle = (isChecked) => {
    console.log("Graph toggle");
    dispatch(toggleGraph(id, isChecked));
  };

  // Requests all available serial ports to connect to
  async function listSerialDevices() {
    await navigator.serial.requestPort();
  }

  // Connect to selected serial port
  async function ConnectButton() {
    console.log("connecting");

    // - Request connection to port using, selection chosen thru filters.
    try {
      port = await navigator.serial.requestPort({ filters });
      await port.open({ baudRate: 9600 });
      console.log("port", port);

      if ("serial" in navigator) {
        connectMSG();
        listenForJSON();
      }
    } catch {
      alert("Serial Connection Failed");
    }
    //listenToPort();
  }

  // Disconnect
  async function disconnect() {}

  async function connectMSG() {
    console.log("send");
    try {
      const writer = port.writable.getWriter();
      const data = new Uint8Array([67, 79, 78, 78, 69, 67, 84, 69, 68]);
      await writer.write(data);
      writer.releaseLock();
    } catch {
      alert("no device is connected");
    }
  }

  async function listenForJSON() {
    console.log("Listening for JSON packets");

    // Listen for data on the serial port
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // allow the serial port to be closed later.
        reader.releaseLock();
        break;
      }
      buffer += value;
      if (value === String.fromCharCode(13)) {
        console.log("enter pressed");
        let obj = JSON.parse(buffer);
        console.log("PARSED :", obj);
        forceUpdate();
        SplitJSON(obj);
        buffer = "";
      }
    }
  }

  function SplitJSON(obj) {
    const time = new Date();
    const timeStr = time.toLocaleTimeString();

    console.log("splitting json");
    // update terminal
    if (obj.Terminal !== undefined) {
      console.log("this device", thisDevice);
      // newTerminalOutput =
      //   thisDevice.terminal + timeStr + " $ " + obj.Terminal + "\n";
      dispatch(updateTerminal(id, timeStr + " $ " + obj.Terminal + "\n"));
    }

    // update log
    if (obj.Log !== undefined) {
      dispatch(updateLog(id, timeStr + " >> " + obj.Log + "\n"));
    }

    // update graph
    if (obj.Data !== undefined) {
      dispatch(updateGraph(id, obj.Data));
      
    }
  }

  return (
    <>
      <div className="text-white min-w-[1315px] min-h-2 max-h-[400px]  m-2 py-2 px-6 max-w-sm bg-zinc-600 rounded-xl shadow-lg space-y-2 sm:py-4  sm:items-center sm:space-y-0 ">
        {/* Device Dropdown*/}
        <select
          className="mt-2 mr-2 z-0 py-2 cursor-default rounded-md bg-white pl-3 pr-10 text-left text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 sm:text-sm sm:leading-6"
          id="connectDropdown"
          onClick={listSerialDevices}
          onChange={(e) => {
            try {
              const c = listOfPorts?.find((x) => x.portName === e.target.value);
              //console.log(c.portId);
              console.log(c);
              setSelected(c);
              // send the vend id and product id filters to connect button
              filters = [
                { usbVendorId: c.vendorId, usbProductId: c.productId },
              ];
              console.log("filters", filters);
            } catch {}
          }}
          defaultValue="default"
        >
          <option value="default" className="hover:bg-green-400">
            Choose Port
          </option>
          {listOfPorts.map((port) => (
            <option key={port.portName} value={port.portName}>
              {port.portName}
            </option>
          ))}
        </select>

        <button
          className="mr-2 bg-green-400 px-3 py-2 rounded-md text-sm font-medium no-underline text-black hover:bg-green-600 hover:text-white shadow-lg "
          onClick={() => ConnectButton()}
        >
          Connect
        </button>

        <br />
        <br />

        {/*Check boxes for widges */}
        <div className="text-white">
          Terminal:&ensp; Terminal:&ensp;
          <ToggleCheckbox
            onToggle={handleTerminalToggle}
            defaultToggle={thisDevice.showTerminal}
          />
          &ensp;Log:&ensp;
          <ToggleCheckbox
            onToggle={handleLogToggle}
            defaultToggle={thisDevice.showLog}
          />
          &ensp;Custom Display:&ensp;
          <ToggleCheckbox
            // onToggle={handleUDLToggle}
            defaultToggle={thisDevice.showUDL}
          />
          &ensp;Graph:&ensp;
          <ToggleCheckbox
            onToggle={handleGraphToggle}
            defaultToggle={thisDevice.showGraph}
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        {thisDevice.showTerminal && (
          <Terminal id={id} thisDevice={thisDevice} />
        )}
        {thisDevice.showLog && <Log id={id} thisDevice={thisDevice} />}
        {thisDevice.showGraph && (
          <GraphWindow id={id} thisDevice={thisDevice} />
        )}
      </div>
    </>
  );
});

export default DeviceMonitor;

// Send Msg over serial
export async function SendMsg(msg) {
  console.log(msg);
  let charCodeArr = [];
  for (let i = 0; i < msg.length; i++) {
    let code = msg.charCodeAt(i);
    charCodeArr.push(code);
  }
  // send data
  try {
    const writer = port.writable.getWriter();
    const data = new Uint8Array(charCodeArr);
    await writer.write(data);
    writer.releaseLock();
  } catch {
    // alert("error")
  }
}
