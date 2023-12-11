import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTextEditorValue } from "../../../redux/action";
import { SendMsg } from "../../Dashboard/Components/DeviceMonitor";

const TextEditor = () => {
  const dispatch = useDispatch();

  const textEditorValue = useSelector((state) => state.textEditorValue);

  const handFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      dispatch(setTextEditorValue(fileContent));
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const Send = () => {
    SendMsg(textEditorValue)
  };

  return (
    <div>
      <input className="ml-2" type="file" onChange={handFileChange}/>
      <br />
      <textarea
        className="bg-zinc-800 text-white ml-2 my-2 rounded-md px-2"
        type="text"
        value={textEditorValue}
        onChange={(e) => dispatch(setTextEditorValue(e.target.value))}
        rows={10}
        cols={100}
        id="textarea"
      />
      <div>
        <button
          onClick={Send}
          className=" ml-2 bg-green-400 px-3 py-2 rounded-md text-sm font-medium no-underline text-black hover:bg-green-600 hover:text-white shadow-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
