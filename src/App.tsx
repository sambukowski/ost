import { useState, useEffect } from "react";
import { OnScreenItem } from "./data-structures/ost-data-structures";
import { Setup } from "./setup/setup";
import { Timer } from "./timer/timer";
import { Exporter } from "./exporter/exporter";

export default function App() {
  // const [page_bg_color, setPageBGColor] = useState("#4e4e4e");
  const [tabKey, setTabKey] = useState("timer");
  const [osi_name_align, setOSINameAlign] = useState("left");
  const [time, setTime] = useState(0),
    [playing, setPlaying] = useState(false),
    [file, setFile] = useState(""),
    [title, setTitle] = useState("Title"),
    [items, setItems] = useState<OnScreenItem[]>([
      {
        name: "New Item",
        appearances: [],
        events: [],
        color: "red",
        on_screen_percent: 0,
      },
    ]);

  // update the global clock
  useEffect(() => {
    if (playing) {
      const int = setInterval(() => setTime((t) => t + 1), 1000);
      return () => clearInterval(int);
    }
  }, [playing]);

  // highlight which tab is active
  const inactiveTabColor: string = "gray";
  const activeTabColor: string = "#c24c50";

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h1 style={{ flex: 1 }}>On Screen Timer</h1>
        <button
          className="ost_visual"
          style={{
            flex: 1,
            background: tabKey === "setup" ? activeTabColor : inactiveTabColor,
          }}
          onClick={() => setTabKey("setup")}
        >
          Setup
        </button>
        <button
          className="ost_visual"
          style={{
            flex: 1,
            background: tabKey === "timer" ? activeTabColor : inactiveTabColor,
          }}
          onClick={() => setTabKey("timer")}
        >
          Timer
        </button>
        <button
          className="ost_visual"
          style={{
            flex: 1,
            background:
              tabKey === "exporter" ? activeTabColor : inactiveTabColor,
          }}
          onClick={() => setTabKey("exporter")}
        >
          Exporter
        </button>
      </div>
      {
        {
          /* conditionally show each tab */
          setup: (
            <Setup
              time={time}
              title={title}
              setTitle={setTitle}
              items={items}
              setItems={setItems}
            />
          ),
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
              osi_name_align={osi_name_align}
              setOSINameAlign={setOSINameAlign}
            />
          ),
          exporter: <Exporter items={items} time={time} />,
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
