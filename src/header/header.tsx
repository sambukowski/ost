import { OnScreenItem } from "../data-structures/ost-data-structures";

function RenderGlobalClock(props: {
  playing: boolean;
  time: number;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div style={{ flex: 1, display: "flex" }}>
      <div className="ost_tracking_element" id="ost_global_clock">
        {/* render the clock with the formate hh:mm:ss */}
        {new Date(props.time * 1000).toISOString().substring(11, 19)}
      </div>
      <div
        className="ost_tracking_element"
        id="ost_global_clock_start_stop"
        onClick={() => props.setPlaying(!props.playing)}
      >
        {props.playing ? "Pause" : "Play"}
      </div>
    </div>
  );
}

function MediaTitle(props: {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div
      className="ost_tracking_element"
      id="ost_media_title"
      style={{ flex: 3 }}
    >
      <input
        // style={{ flex: 1 }}
        className="media_title"
        type="text"
        value={props.title}
        onChange={(e) => {
          let newTitle = props.title;
          newTitle = e.target.value;
          props.setTitle(newTitle);
        }}
      />
    </div>
  );
}

function Download(filename: string, text: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function SaveLoad(props: {
  title: string;
  time: number;
  chars: OnScreenItem[];
  setFiles: React.Dispatch<React.SetStateAction<string>>;
}) {
  // onChange handler for loading in json data
  const Upload = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e: any) => {
      props.setFiles(e.target.result);
    };
  };

  return (
    <div style={{ display: "flex", flex: 1, justifyContent: "right" }}>
      <button
        className="ost_tracking_element"
        id="ost_global_clock_start_stop"
        style={{ flex: 1 }}
        onClick={() =>
          Download(
            props.title.replace(/\s/g, "-") + "[" + props.time + "].json",
            JSON.stringify(props.chars, null, 2)
          )
        }
      >
        Save
      </button>
      <label
        htmlFor="loadOSTfile"
        className="ost_tracking_element"
        id="ost_global_clock_start_stop"
        style={{ flex: 1, lineHeight: 1.1 }}
      >
        <input
          type="file"
          id="loadOSTfile"
          name="loadOSTfile"
          placeholder="Load"
          onChange={Upload}
        />
        <div style={{ fontSize: 50 }}>Load</div>
      </label>
    </div>
  );
}

export function Header(props: {
  playing: boolean;
  time: number;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  chars: OnScreenItem[];
  setFiles: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div style={{ display: "flex", marginLeft: 5, marginRight: 5 }}>
      <RenderGlobalClock
        playing={props.playing}
        time={props.time}
        setPlaying={props.setPlaying}
      />
      <MediaTitle title={props.title} setTitle={props.setTitle} />
      <SaveLoad
        title={props.title}
        time={props.time}
        chars={props.chars}
        setFiles={props.setFiles}
      />
    </div>
  );
}
