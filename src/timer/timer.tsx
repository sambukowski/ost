import { Header } from "./header/header";
import {
  OnScreenItem,
  Appearance,
} from "../data-structures/ost-data-structures";
import {
  RenderOnScreenItem,
  CalcTotalOnScreenPercentage,
} from "./on-screen-items/on-screen-item";

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
  chars: OnScreenItem[],
  setChars: React.Dispatch<React.SetStateAction<OnScreenItem[]>>
) {
  const new_item: OnScreenItem = {
    name: "New Item",
    appearances: [],
    events: [],
    color: generateRandomColor(),
    on_screen_percent: 0,
  };

  setChars([...chars, new_item]);
}

function RemoveItem(
  chars: OnScreenItem[],
  setChars: React.Dispatch<React.SetStateAction<OnScreenItem[]>>
) {
  setChars(chars.slice(0, chars.length - 1));
}

function sortOSIs(
  method: string,
  items: OnScreenItem[],
  time: number
): OnScreenItem[] {
  switch (method) {
    case "ascending": {
      const tmp_items = [...items];
      tmp_items.sort((a, b) => {
        return (
          CalcTotalOnScreenPercentage(a, time) -
          CalcTotalOnScreenPercentage(b, time)
        );
      });
      return tmp_items;
    }
    case "decending": {
      const tmp_items = [...items];
      tmp_items.sort((a, b) => {
        return (
          CalcTotalOnScreenPercentage(b, time) -
          CalcTotalOnScreenPercentage(a, time)
        );
      });
      return tmp_items;
    }
    case "alphabetical-decending": {
      const tmp_items = [...items];
      tmp_items.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      return tmp_items;
    }
    case "alphabetical-ascending": {
      const tmp_items = [...items];
      tmp_items.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        return 0;
      });
      return tmp_items;
    }
    default: {
      break;
    }
  }
  return items;
}

export function Timer(props: {
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
  osi_name_align: string;
  setOSINameAlign: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div>
      <Header
        playing={props.playing}
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
      {/* TODO: this needs to be moved to its own component */}
      <div
        style={{ display: "flex", marginLeft: 5, marginRight: 5, height: 85 }}
      >
        {/* this first one is the toggle name left and right */}
        <div
          className=" ost_visual"
          style={{
            flex: 0.6,
            fontSize: 80,
            textAlign: "center",
            verticalAlign: "center",
            lineHeight: 0.45,
            borderColor: "white",
          }}
          onClick={() =>
            props.setOSINameAlign(
              props.osi_name_align === "left" ? "right" : "left"
            )
          }
        >
          {props.osi_name_align === "left" ? "←" : "→"}
        </div>
        {/* this will eventually be the global event timeline */}
        <div className=" ost_visual" style={{ flex: 10 }}></div>
        {/* sort ascending screen time button */}
        <div
          className=" ost_visual"
          style={{
            flex: 0.35,
            fontSize: 60,
            textAlign: "center",
            verticalAlign: "center",
            lineHeight: 0.75,
            borderColor: "white",
          }}
          onClick={() =>
            props.setItems(sortOSIs("ascending", props.items, props.time))
          }
        >
          ↓
        </div>
        {/* sort alphabetically ascending */}
        <div
          className=" ost_visual"
          style={{
            flex: 0.35,
            fontSize: 60,
            textAlign: "center",
            verticalAlign: "center",
            lineHeight: 0.75,
            borderColor: "white",
          }}
          onClick={() =>
            props.setItems(
              sortOSIs("alphabetical-ascending", props.items, props.time)
            )
          }
        >
          ∀
        </div>
        {/* sort alphabetically decending */}
        <div
          className=" ost_visual"
          style={{
            flex: 0.35,
            fontSize: 60,
            textAlign: "center",
            verticalAlign: "center",
            lineHeight: 0.75,
            borderColor: "white",
          }}
          onClick={() =>
            props.setItems(
              sortOSIs("alphabetical-decending", props.items, props.time)
            )
          }
        >
          A
        </div>
        {/* sort decending */}
        <div
          className=" ost_visual"
          style={{
            flex: 0.35,
            fontSize: 60,
            textAlign: "center",
            verticalAlign: "center",
            lineHeight: 0.75,
            borderColor: "white",
          }}
          onClick={() =>
            props.setItems(sortOSIs("decending", props.items, props.time))
          }
        >
          ↑
        </div>
      </div>
      {props.items.map((char, i) => (
        <RenderOnScreenItem
          key={i}
          on_screen_item={char}
          time={props.time}
          chars={props.items}
          setItems={props.setItems}
          osi_name_align={props.osi_name_align}
        />
      ))}
      <div
        className="item_adder"
        id="adder"
        onClick={() => AddItem(props.items, props.setItems)}
      >
        +
      </div>
      <div
        className="item_adder"
        id="subtracter"
        onClick={() => RemoveItem(props.items, props.setItems)}
      >
        -
      </div>
    </div>
  );
}
