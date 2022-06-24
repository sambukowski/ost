import { useState, useEffect } from "react";
import { Header } from "./header/header";
import {
  OnScreenItem,
  Appearance,
} from "./data-structures/ost-data-structures";
import { RenderOnScreenItem } from "./on-screen-items/on-screen-item";

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
  const [time, setTime] = useState(200),
    [playing, setPlaying] = useState(false),
    [files, setFiles] = useState(""),
    [title, setTitle] = useState("Title"),
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
      {
        name: "empty",
        appearances: [],
        color: "pink",
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
      <Header
        playing={playing}
        time={time}
        setPlaying={setPlaying}
        title={title}
        setTitle={setTitle}
        chars={chars}
        setFiles={setFiles}
      />
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
      <div>Time: {time}</div>
      <div>{title}</div>
      <div>{files}</div>

      <div>
        <pre>{JSON.stringify(chars, null, 2)}</pre>
      </div>
    </div>
  );
}
