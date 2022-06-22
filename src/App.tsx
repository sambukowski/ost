//satchel's original code
//https://codesandbox.io/s/stoic-bose-qhc9cf?file=/src/App.tsx:0-2846

import { time } from "console";
import { useState, useEffect, useRef } from "react";

interface OnScreenItem {
  name: string;
  appearances: Appearance[];
  color: string;
}

interface Appearance {
  start: number;
  end?: number;
}

function download(filename: string, text: string) {
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

function RenderGlobalClock(props: {
  playing: boolean;
  time: number;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div>
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

function RenderAppearance(props: {
  app: Appearance;
  time: number;
  color: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        background: props.color,
        left: (props.app.start / props.time) * 100 + "%",
        top: 0,
        height: 10,
        width:
          (((props.app.end ?? props.time) - props.app.start) / props.time) *
            100 +
          "%",
        borderRadius: 5,
      }}
    />
  );
}

function TimelineBar(props: { on_screen_item: OnScreenItem; time: number }) {
  return (
    <div style={{ display: "flex" }}>
      <div
        key={props.on_screen_item.name}
        style={{ position: "relative", flex: 1, padding: 2, margin: 2 }}
      >
        {props.on_screen_item.appearances.map((app, i) => (
          <RenderAppearance
            key={i}
            app={app}
            time={props.time}
            color={props.on_screen_item.color}
          />
        ))}
      </div>
    </div>
  );
}

function CalcTotalOnScreenPercentage(
  on_screen_item: OnScreenItem,
  time: number
): number {
  let sum = 0;
  on_screen_item.appearances.forEach((app) => {
    if (app.end === undefined) {
      sum += time - app.start;
    } else {
      sum += app.end - app.start;
    }
  });
  return (sum / time) * 100;
}

function HistogramBar(props: { on_screen_item: OnScreenItem; time: number }) {
  const hist: Appearance = {
    start: 0,
    end:
      (CalcTotalOnScreenPercentage(props.on_screen_item, props.time) / 100) *
      props.time,
  };
  return (
    <div style={{ display: "flex" }}>
      <div style={{ position: "relative", flex: 1, padding: 2, margin: 2 }}>
        <RenderAppearance
          app={hist}
          time={props.time}
          color={props.on_screen_item.color}
        />
      </div>
    </div>
  );
}

function UpdateOSIdata(
  on_screen_item: OnScreenItem,
  chars: OnScreenItem[],
  time: number,
  setChars: React.Dispatch<React.SetStateAction<OnScreenItem[]>>
) {
  let newChars = [...chars];

  const lastIndex = on_screen_item.appearances.length - 1,
    last = on_screen_item.appearances[lastIndex];
  const newApps = [...on_screen_item.appearances];

  if (!last.end) newApps[lastIndex] = { ...last, end: time };
  else if (last.end === time) newApps[lastIndex] = { ...last, end: undefined };
  else newApps.push({ start: time });

  newChars[chars.indexOf(on_screen_item)] = {
    ...on_screen_item,
    appearances: newApps,
  };

  setChars(newChars);
}

function RenderOnScreenItem(props: {
  on_screen_item: OnScreenItem;
  time: number;
  chars: OnScreenItem[];
  setChars: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
}) {
  const current = props.on_screen_item.appearances.find((app) => !app.end);
  return (
    <div style={{ display: "flex", marginLeft: 5, marginRight: 5 }}>
      <div className="ost_tracking_element" id="ost_item_data">
        {/* TODO: need to figure out how update the name */}
        <input
          className="item_name"
          type="text"
          value={props.on_screen_item.name}
          onChange={(e) => {
            let newChars = [...props.chars];
            newChars[props.chars.indexOf(props.on_screen_item)] = {
              ...props.on_screen_item,
              name: e.target.value,
            };
            props.setChars(newChars);
          }}
          id="osi_name"
        />
        <div style={{ marginLeft: 5 }}>
          Percent of total time on screen{" "}
          {CalcTotalOnScreenPercentage(
            props.on_screen_item,
            props.time
          ).toFixed(2)}
          %
        </div>
        <HistogramBar on_screen_item={props.on_screen_item} time={props.time} />
        <div style={{ marginLeft: 5 }}>On Screen Occurances</div>
        <TimelineBar on_screen_item={props.on_screen_item} time={props.time} />
      </div>
      <button
        className="ost_tracking_element"
        id="ost_item_button"
        onClick={() =>
          UpdateOSIdata(
            props.on_screen_item,
            props.chars,
            props.time,
            props.setChars
          )
        }
      >
        {current ? "👁" : "--"}
      </button>
    </div>
  );
}

function AddItem(
  time: number,
  chars: OnScreenItem[],
  setChars: React.Dispatch<React.SetStateAction<OnScreenItem[]>>
) {
  const new_app: Appearance = { start: time };
  const new_item: OnScreenItem = {
    name: "New Item",
    appearances: [new_app],
    color: "black",
  };

  setChars([...chars, new_item]);
}

function RemoveItem(
  chars: OnScreenItem[],
  setChars: React.Dispatch<React.SetStateAction<OnScreenItem[]>>
) {
  setChars(chars.slice(0, chars.length - 1));
}

// function Upload({ children }) {
//   const [files, setFiles] = useState("");

//   const handleChange = e => {
//     const fileReader = new FileReader();
//     fileReader.readAsText(e.target.files[0], "UTF-8");
//     fileReader.onload = e => {
//       console.log("e.target.result", e.target.result);
//       setFiles(e.target.result);
//     };
//   };
// function handleChange(props: {
//   e: Blob;
//   setFiles: React.Dispatch<React.SetStateAction<string>>;
// }) {
//   const fileReader = new FileReader();
//   fileReader.readAsText(props.e, "UTF-8");
//   fileReader.onload = (e) => {
//     console.log("e.target.result", e.target.result);
//     setFiles(e.target.result);
//   };
// }

export default function App() {
  // const [hist_value, set_hist_value] = useState(109.5); // largest the value can be
  const [time, setTime] = useState(200),
    [playing, setPlaying] = useState(false),
    [input_file, setFiles] = useState(""),
    [chars, setChars] = useState<OnScreenItem[]>([
      {
        name: "Billy",
        appearances: [
          { start: 0, end: 10 },
          { start: 30, end: 60 },
          { start: 65, end: 75 },
          { start: 80, end: 110 },
        ],
        color: "blue",
      },
      {
        name: "willy",
        appearances: [{ start: 0, end: 200 }],
        color: "green",
      },
      {
        name: "killy",
        appearances: [
          { start: 1, end: 2 },
          { start: 15, end: 75 },
        ],
        color: "orange",
      },
    ]);

  // update the global clock
  useEffect(() => {
    if (playing) {
      const int = setInterval(() => setTime((t) => t + 1), 1000);
      return () => clearInterval(int);
    }
  }, [playing]);

  return (
    <div>
      <h1>On Screen Timer</h1>
      <RenderGlobalClock
        playing={playing}
        time={time}
        setPlaying={setPlaying}
      />
      {/* Add a title for whatever you are watching */}
      <button
        onClick={() => download("test.json", JSON.stringify(chars, null, 2))}
      >
        download
      </button>
      {chars.map((char, i) => (
        <RenderOnScreenItem
          key={i}
          on_screen_item={char}
          time={time}
          chars={chars}
          setChars={setChars}
        />
      ))}
      <div
        className="item_adder"
        id="adder"
        onClick={() => AddItem(time, chars, setChars)}
      >
        +
      </div>
      <div
        className="item_adder"
        id="subtracter"
        onClick={() => RemoveItem(chars, setChars)}
      >
        -
      </div>
      <div>
        <pre>{JSON.stringify(chars, null, 2)}</pre>
      </div>
    </div>
  );
}
