import { useEffect, useState, memo } from "react";
import ToggleCheckbox from "../../../components/ToggleCheckbox";
import { useDispatch } from "react-redux";
import { toggleTerminal } from "../../../redux/action";

// Optional filters to limit what serial ports are returned
let filters = [{}];
let port;

const DeviceMonitor = memo(function DeviceMonitor({ id, thisDevice }) {
  const dispatch = useDispatch();

  const [listOfPorts, setListOfPorts] = useState([]);
  const [selected, setSelected] = useState();

  window.indexBridge.once("port:list", (e, options) => {
    setListOfPorts(e);
    console.log("clicked drop down", e);
  });

  // handlers for show widgets
  const handleTerminalToggle = (isChecked) => {
    dispatch(toggleTerminal(id, isChecked));
  };

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
          onClick={ConnectButton}
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
            // onToggle={handleLogToggle}
            defaultToggle={thisDevice.showLog}
          />
          &ensp;Custom Display:&ensp;
          <ToggleCheckbox
            // onToggle={handleUDLToggle}
            defaultToggle={thisDevice.showUDL}
          />
          &ensp;Graph:&ensp;
          <ToggleCheckbox
            // onToggle={handleGraphToggle}
            defaultToggle={thisDevice.showGraph}
          />
        </div>
      </div>
    </>
  );
});

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
    console.log(port);

    if ("serial" in navigator) {
      //connectMSG();
      //listenForJSON();
    }
  } catch {
    alert("Serial Connection Failed");
  }
  //listenToPort();
}

// Disconnect
async function disconnect() {}

export default DeviceMonitor;
