import { useState, useEffect } from "react";
import { Header } from "./header/header";
import {
  OnScreenItem,
  Appearance,
} from "./data-structures/ost-data-structures";
import { RenderOnScreenItem } from "./on-screen-items/on-screen-item";

function generateRandomColor(): string {
  const values = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ];

  let randColor = "#";
  for (let i = 0; i < 6; i++) {
    randColor += values[Math.floor(Math.random() * values.length)];
  }

  return randColor;
}

function AddItem(
  time: number,
  chars: OnScreenItem[],
  setChars: React.Dispatch<React.SetStateAction<OnScreenItem[]>>
) {
  // const new_app: Appearance = { start: time };
  const new_item: OnScreenItem = {
    name: "New Item",
    appearances: [],
    color: generateRandomColor(),
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

  return (
    <div>
      <h1>On Screen Timer</h1>
      <Header
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
      {items.map((char, i) => (
        <RenderOnScreenItem
          key={i}
          on_screen_item={char}
          time={time}
          chars={items}
          setChars={setItems}
        />
      ))}
      <div
        className="item_adder"
        id="adder"
        onClick={() => AddItem(time, items, setItems)}
      >
        +
      </div>
      <div
        className="item_adder"
        id="subtracter"
        onClick={() => RemoveItem(items, setItems)}
      >
        -
      </div>
      {/* <div>Time: {time}</div>
      <div>{title}</div>
      <div>{file}</div>
      <div>
        <pre>{JSON.stringify(items, null, 2)}</pre>
      </div> */}
    </div>
  );
}
