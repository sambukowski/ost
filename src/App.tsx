//satchel's original code
//https://codesandbox.io/s/stoic-bose-qhc9cf?file=/src/App.tsx:0-2846

import { sign } from "crypto";
import { useState, useEffect } from "react";

interface OnScreenItem {
  name: string;
  appearances: Appearance[];
  color: string;
}

interface Appearance {
  start: number;
  end?: number;
}

function RenderGlobalClock(
  playing: boolean,
  time: number,
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>
) {
  return (
    <div>
      <div className="ost_tracking_element" id="ost_global_clock">
        {/* render the clock with the formate hh:mm:ss */}
        {new Date(time * 1000).toISOString().substring(11, 19)}
      </div>
      <div
        className="ost_tracking_element"
        id="ost_global_clock_start_stop"
        onClick={() => setPlaying(!playing)}
      >
        {playing ? "Pause" : "Play"}
      </div>
    </div>
  );
}

function TimelineBar(props: { char: OnScreenItem; time: number }) {
  return (
    <div style={{ display: "flex" }}>
      <div
        key={props.char.name}
        style={{ position: "relative", flex: 1, margin: 5 }}
      >
        {props.char.appearances.map((app, i) => {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                background: props.char.color,
                left: (app.start / props.time) * 100 + "%",
                top: 0,
                height: 10,
                width:
                  (((app.end ?? props.time) - app.start) / props.time) * 100 +
                  "%",
                borderRadius: 5,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// function RenderHistogramBar(char: OnScreenItem, time: number) {
//   let sum = 0;
//   for (let app of char.appearances) {
//     if (app.end) {
//       sum += app.end - app.start;
//     } else {
//       sum += time - app.start;
//     }
//   }
//   return (
//     <div
//       style={{
//         position: "absolute",
//         background: char.color,
//         left: char.appearances[0].start,
//         top: 5,
//         height: 10,
//         width: ((sum - char.appearances[0].start) / time) * 100 + "%",
//       }}
//     />
//   );
// }

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

function UpdateOSIdata(
  current: Appearance | undefined,
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

function RenderOnScreenItem(
  on_screen_item: OnScreenItem,
  time: number,
  chars: OnScreenItem[],
  setChars: React.Dispatch<React.SetStateAction<OnScreenItem[]>>
) {
  const current = on_screen_item.appearances.find((app) => !app.end);
  return (
    <div style={{ display: "flex" }}>
      <div className="ost_tracking_element" id="ost_item_data">
        {/* TODO: need to figure out how update the name */}
        <input
          className="item_name"
          type="text"
          value={on_screen_item.name}
          onChange={(e) => {
            console.log("yee", e.target.value);
            let newChars = [...chars];
            newChars[chars.indexOf(on_screen_item)] = {
              ...on_screen_item,
              name: e.target.value,
            };
            setChars(newChars);
          }}
          id="osi_name"
        />
        {/* {(on_screen_item.name = document.getElementById("osi_name").value)} */}
        <div style={{ marginLeft: 5 }}>
          Percent of total time on screen{" "}
          {CalcTotalOnScreenPercentage(on_screen_item, time).toFixed(2)}%
        </div>
        {/* percent total screen time histogram bar */}
        <div style={{ position: "relative", width: "100%", padding: 10 }}>
          <div
            style={{
              background: "orange",
              height: 10,
              borderRadius: 5,
              // TODO: why does below have to 99.5 instead of 100% to look right?
              // margin maybe?
              width: CalcTotalOnScreenPercentage(on_screen_item, time) + "%",
            }}
          />
        </div>
        <div style={{ marginLeft: 5 }}>On Screen Occurances</div>
        <div>
          <TimelineBar char={on_screen_item} time={time} />
        </div>
      </div>
      <button
        className="ost_tracking_element"
        id="ost_item_button"
        onClick={() =>
          UpdateOSIdata(current, on_screen_item, chars, time, setChars)
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

export default function App() {
  // const [hist_value, set_hist_value] = useState(109.5); // largest the value can be
  const [time, setTime] = useState(200),
    [playing, setPlaying] = useState(false),
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

  const [on_screen, set_on_screen] = useState(true);

  useEffect(() => {
    if (playing) {
      const int = setInterval(() => setTime((t) => t + 1), 1000);
      return () => clearInterval(int);
    }
  }, [playing]);

  return (
    <div>
      <h1>On Screen Timer</h1>
      {RenderGlobalClock(playing, time, setPlaying)}
      {chars.map((char) => {
        return RenderOnScreenItem(char, time, chars, setChars);
      })}
      {/* TODO: figure out why these buttons only update immediately when the timer is running*/}
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

      {/* the original logic below */}
      {/* <div>
        {chars.map((char, i) => {
          const current = char.appearances.find((app) => !app.end);
          return (
            <div key={i} style={{ display: "flex", margin: 10 }}>
              <button
                onClick={() => {
                  const newChars = [...chars],
                    newAppearances = current
                      ? char.appearances.map((app) =>
                          app.start === current.start
                            ? { ...app, end: time }
                            : app
                        )
                      : [...char.appearances, { start: time }];
                  newChars[i] = {
                    ...char,
                    appearances: newAppearances,
                  };
                  setChars(newChars);
                }}
              >
                {current ? "leave" : "enter"}
              </button>
              {char.name}
            </div>
          );
        })}
      </div> */}
      {/* the original ost bars */}
      {/* <div style={{ width: "100%" }}>
        {chars.map((char) => {
          return RenderTimelineBar(char, time);
        })}
      </div> */}
      {/* the item right below this prints the dict */}
      <div>
        <pre>{JSON.stringify(chars, null, 2)}</pre>
      </div>
    </div>
  );
}
