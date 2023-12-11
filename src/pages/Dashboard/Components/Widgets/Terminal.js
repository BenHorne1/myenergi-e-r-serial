import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateTerminal } from "../../../../redux/action";
import { SendMsg } from "../DeviceMonitor";

const Terminal = ({ id, thisDevice }) => {
  const dispatch = useDispatch();

  const [input, setInput] = useState("");

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      console.log("scroll check");
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  });

  return (
    <div className="text-white min-w-[650px] min-h-[450px] max-h-[450px]  m-2 py-2 px-6 max-w-sm bg-zinc-800 rounded-xl shadow-lg space-y-2 sm:py-4  sm:items-center sm:space-y-0 ">
      &gt;&gt;&ensp;
      <input
        type="text"
        className="terminalInput min-w-[515px] mb-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            let newOutput = "";
            switch (input) {
              case "clear":
                console.log("clear");
                newOutput = "";
                setInput("");
                dispatch(updateTerminal(thisDevice.id, newOutput));
                break;
              default:
                const time = new Date();
                const timeStr = time.toLocaleDateString();
                newOutput =
                  thisDevice.terminal + timeStr + " $ " + input + "\n";
                setInput("");
                dispatch(updateTerminal(thisDevice.id, newOutput));

                // send over serial
                SendMsg(input);
            }
          }
        }}
      />
      <div className="terminal">{thisDevice.terminal}</div>
    </div>
  );
};

export default Terminal;
