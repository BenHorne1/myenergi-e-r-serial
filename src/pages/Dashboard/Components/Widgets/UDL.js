import {
  AiOutlinePlus,
  AiOutlineLine,
  AiFillCaretLeft,
  AiFillCaretRight,
} from "react-icons/ai";

const UDL = ({ id, thisDevice }) => {
  const minClicked = () => {};

  const plusClicked = () => {};

  const leftClicked = () => {};

  const rightClicked = () => {};

  return (
    <div className="text-white min-w-[650px] min-h-[450px] max-h-[450px]  m-2 py-2 px-6 max-w-sm bg-zinc-800 rounded-xl shadow-lg space-y-2 sm:py-4  sm:items-center sm:space-y-0 ">
      UDL:
      <div className="UDL" id={`UDL${id}`}>
        {thisDevice.UDL}
      </div>
      <>
        <div className="grid-container">
          <div className="grid-item">
            {" "}
            <button
              className="UDL-buttons group HiOutlineCog"
              onClick={minClicked}
            >
              <AiOutlineLine size="28" />
            </button>
          </div>
          <div className="grid-item">
            <button
              className="UDL-buttons group HiOutlineCog"
              onClick={plusClicked}
            >
              <AiOutlinePlus size="28" />
            </button>
          </div>
          <div className="grid-item">
            {" "}
            <button
              className="UDL-buttons group HiOutlineCog"
              onClick={leftClicked}
            >
              <AiFillCaretLeft size="28" />
            </button>
          </div>
          <div className="grid-item">
            <button
              className="UDL-buttons group HiOutlineCog"
              onClick={rightClicked}
            >
              <AiFillCaretRight size="28" />
            </button>
          </div>
        </div>
      </>
    </div>
  );
};

export default UDL