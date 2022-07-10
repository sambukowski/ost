import { useState, useEffect } from "react";
import { OnScreenItem } from "./timer/data-structures/ost-data-structures";
import { Timer } from "./timer/timer";

export default function App() {
  // const [page_bg_color, setPageBGColor] = useState("#4e4e4e");
  const [tabKey, setTabKey] = useState("timer");
  const [time, setTime] = useState(0),
    [playing, setPlaying] = useState(false),
    [file, setFile] = useState(""),
    [title, setTitle] = useState("Title"),
    [items, setItems] = useState<OnScreenItem[]>([
      {
        name: "New Item",
        appearances: [],
        color: "red",
      },
    ]);

  // update the global clock
  useEffect(() => {
    if (playing) {
      const int = setInterval(() => setTime((t) => t + 1), 1000);
      return () => clearInterval(int);
    }
  }, [playing]);

  // change the page color when on different tabs
  const page_bg_color = {
    timer: "#4e4e4e",
    exporter: "#2f3698",
  }[tabKey];

  return (
    <div style={{ background: page_bg_color }}>
      <div style={{ display: "flex" }}>
        <h1 style={{ flex: 1 }}>On Screen Timer</h1>
        <button
          className="ost_visual"
          style={{ flex: 1 }}
          onClick={() => setTabKey("timer")}
        >
          Timer
        </button>
        <button
          className="ost_visual"
          style={{ flex: 1 }}
          onClick={() => setTabKey("exporter")}
        >
          Exporter
        </button>
      </div>
      {
        {
          timer: (
            <Timer
              playing={playing}
              setPlaying={setPlaying}
              time={time}
              setTime={setTime}
              title={title}
              setTitle={setTitle}
              items={items}
              setItems={setItems}
              file={file}
              setFile={setFile}
            />
          ),
          exporter: <h1>empty</h1>,
        }[tabKey]
      }

      {/* <div>Time: {time}</div>
      <div>{title}</div>
      <div>{file}</div>
      <div>
        <pre>{JSON.stringify(items, null, 2)}</pre>
      </div> */}
    </div>
  );
}
