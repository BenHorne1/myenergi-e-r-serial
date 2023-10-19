import { AiOutlinePlus } from "react-icons/ai";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDevice } from "../../redux/action";
import DeviceMonitor from "./Components/DeviceMonitor";

const Dashboard = memo(function DashBoard() {
  const deviceList = useSelector((state) => state.deviceList);
  const dispatch = useDispatch();

  console.log("the dash board is being rendered");
  console.log(deviceList);

  return (
    <div className="ml-16 min-h-screen min-w-full bg-zinc-700">
      <div className="bg-zinc-800 mb-2 shadow-md ">
        <h1 className="mx-2 text-white bg-zinc-800 font-bold shadow-md">
          Dashboard
        </h1>
      </div>

      {deviceList.map((device, index) => (
        <div key={device.id}>
          <DeviceMonitor
            id={device.id}
            thisDevice={deviceList[device.id - 1]}
          />
        </div>
      ))}
    </div>
  );
});

export default Dashboard;
