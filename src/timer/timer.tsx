import { Header } from "./header/header";
import { NavigationBar } from "./header/navigation-bar";
import { OnScreenItem } from "../data-structures/ost-data-structures";
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
  chars: OnScreenItem[],
  setChars: React.Dispatch<React.SetStateAction<OnScreenItem[]>>
) {
  const new_item: OnScreenItem = {
    name: "New Item",
    appearances: [],
    event_list: [],
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
  events_visible: boolean;
  setEventsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  // setSortType: React.Dispatch<React.SetStateAction<string>>;
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
      <NavigationBar
        time={props.time}
        setTime={props.setTime}
        items={props.items}
        setItems={props.setItems}
        osi_name_align={props.osi_name_align}
        setOSINameAlign={props.setOSINameAlign}
        events_visible={props.events_visible}
        setEventsVisible={props.setEventsVisible}
        // setSortType={props.setSortType}
      />
      {props.items.map((char, i) => (
        <RenderOnScreenItem
          key={i}
          on_screen_item={char}
          time={props.time}
          items={props.items}
          setItems={props.setItems}
          osi_name_align={props.osi_name_align}
          events_visible={props.events_visible}
          setEventsVisible={props.setEventsVisible}
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
