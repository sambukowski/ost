import {
  OnScreenItem,
  OSTproject,
} from "../../data-structures/ost-data-structures";
import { CalcTotalOnScreenPercentage } from "../on-screen-items/on-screen-item";

function PlayPauseButton(props: {
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const playing = props.playing;
  const color = playing ? "#ba4242" : "darkgray";
  return (
    <div
      className="ost_tracking_element ost_visual"
      id="ost_global_clock_start_stop"
      onClick={() => props.setPlaying(!props.playing)}
      style={{ background: color }}
    >
      {playing ? "Pause" : "Play"}
    </div>
  );
}

function RenderGlobalClock(props: {
  playing: boolean;
  time: number;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div style={{ flex: 1, display: "flex" }}>
      <div className="ost_tracking_element ost_visual" id="ost_global_clock">
        {/* render the clock with the formate hh:mm:ss */}
        {new Date(props.time * 1000).toISOString().substring(11, 19)}
      </div>
      <PlayPauseButton playing={props.playing} setPlaying={props.setPlaying} />
    </div>
  );
}

function MediaTitle(props: {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div
      className="ost_tracking_element ost_visual"
      id="ost_media_title"
      style={{ flex: 10 }}
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

function BuildOSTproject(
  title: string,
  time: number,
  items: OnScreenItem[]
): OSTproject {
  const proj: OSTproject = { title: title, time: time, items: items };
  return proj;
}

export function RebuildItems(incoming_items: OnScreenItem[], time: number) {
  var new_items: OnScreenItem[] = [];

  incoming_items.forEach((item) => {
    // var new_item: OnScreenItem = {
    //   name: "New Item",
    //   appearances: [],
    //   event_list: [],
    //   events: [],
    //   color: "",
    //   on_screen_percent: 0,
    // };
    var new_item: OnScreenItem = {
      name: item.name ?? "failed",
      appearances: item.appearances ?? [],
      event_list: item.event_list ?? [],
      events: item.events ?? [],
      color: item.color ?? "#000000",
      on_screen_percent: CalcTotalOnScreenPercentage(item, time) ?? 0,
    };

    // try {
    //   new_item.name = item.name;
    // } finally {
    //   new_item.name = "failed";
    // }
    // try {
    //   new_item.appearances = item.appearances;
    // } finally {
    //   new_item.appearances = [];
    // }
    // try {
    //   new_item.event_list = item.event_list;
    // } finally {
    //   new_item.event_list = [];
    // }
    // try {
    //   new_item.events = item.events;
    // } finally {
    //   new_item.events = [];
    // }
    // try {
    //   new_item.color = item.color;
    // } finally {
    //   new_item.color = "#000000";
    // }
    // try {
    //   new_item.on_screen_percent = item.on_screen_percent;
    // } finally {
    //   new_item.on_screen_percent = NaN;
    // }
    new_items.push(new_item);
  });

  return new_items;
}

function SaveLoad(props: {
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
  file: string;
  setFile: React.Dispatch<React.SetStateAction<string>>;
}) {
  // onChange handler for loading in json data
  const Upload = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e: any) => {
      props.setFile(e.target.result);
      let proj: OSTproject = JSON.parse(e.target.result);

      props.setPlaying(false);
      props.setTitle(proj.title);
      props.setTime(proj.time);
      props.setItems(RebuildItems(proj.items, proj.time));
      // props.setItems(proj.items); //enhance this
    };
  };
  console.log("Loading OSIs:");
  for (var i = 0; i < props.items.length; i++) {
    console.log(
      "%s: app len: %i",
      props.items[i].name,
      props.items[i].appearances.length
    );
  }

  return (
    <div style={{ display: "flex", flex: 1, justifyContent: "right" }}>
      <button
        className="ost_tracking_element ost_visual"
        id="ost_global_clock_start_stop"
        style={{ flex: 1, background: "#bbb068" }}
        onClick={() =>
          Download(
            props.title.replace(/\s/g, "-") + "[" + props.time + "].ostp",
            JSON.stringify(
              BuildOSTproject(props.title, props.time, props.items),
              null,
              2
            )
          )
        }
      >
        Save
      </button>
      <label
        htmlFor="loadOSTfile"
        className="ost_tracking_element ost_visual"
        id="ost_global_clock_start_stop"
        style={{ flex: 1, lineHeight: 1.1, background: "#568656" }}
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
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
  file: string;
  setFile: React.Dispatch<React.SetStateAction<string>>;
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
        setPlaying={props.setPlaying}
        time={props.time}
        setTime={props.setTime}
        title={props.title}
        setTitle={props.setTitle}
        items={props.items}
        setItems={props.setItems}
        file={props.file}
        setFile={props.setFile}
      />
    </div>
  );
}
