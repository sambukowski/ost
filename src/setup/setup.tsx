import { OnScreenItem, Event } from "../data-structures/ost-data-structures";
import {
  SortButtonAlphabeticalAscending,
  SortButtonAlphabeticalDecending,
} from "../timer/header/navigation-bar";

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

function OSISetup(props: {
  on_screen_item: OnScreenItem;
  time: number;
  chars: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
}) {
  const osi_setup_height = 75;
  const setColor = (e: any) => {
    let newChars = [...props.chars];
    newChars[props.chars.indexOf(props.on_screen_item)] = {
      ...props.on_screen_item,
      color: e.target.value,
    };
    props.setItems(newChars);
  };
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            background: "#842e2e",
            margin: 20,
            padding: 5,
            paddingLeft: 10,
            borderRadius: 15,
            borderStyle: "solid",
            borderWidth: 3,
            borderColor: "black",
            flex: 0.03,
            fontSize: 55,
            textAlign: "center",
            verticalAlign: "center",
            lineHeight: 0.45,
          }}
        >
          ␡
        </div>
        <div
          style={{
            margin: 5,
            padding: 5,
            paddingLeft: 10,
            borderRadius: 15,
            borderStyle: "solid",
            borderWidth: 3,
            borderColor: "black",
            verticalAlign: "top",
            flex: 0.03,
            background: props.on_screen_item.color,
          }}
        >
          <label htmlFor="pickColor">
            <input
              type="color"
              id="pickColor"
              name="pickColor"
              value={props.on_screen_item.color}
              onChange={setColor}
              style={{
                //   flex: 1,
                background: props.on_screen_item.color,
                height: osi_setup_height,
                //   margin: 5,
              }}
            />
          </label>
        </div>
        <div
          style={{
            background: "gray",
            margin: 5,
            padding: 5,
            paddingLeft: 10,
            borderRadius: 15,
            borderStyle: "solid",
            borderWidth: 3,
            borderColor: "black",
            verticalAlign: "top",
            flex: 0.75,
          }}
        >
          <input
            className="item_name"
            type="text"
            style={{ textAlign: "left", width: "100%" }}
            value={props.on_screen_item.name}
            onChange={(e) => {
              let newChars = [...props.chars];
              newChars[props.chars.indexOf(props.on_screen_item)] = {
                ...props.on_screen_item,
                name: e.target.value,
              };
              props.setItems(newChars);
            }}
            id="osi_name"
          />
        </div>
      </div>
      {/* this div should be wrapped in a OSI Event object */}
      <div style={{ display: "flex" }}>
        <div style={{ flex: 0.15 }}></div>
        <div
          style={{
            background: "gray",
            margin: 5,
            padding: 5,
            paddingLeft: 10,
            borderRadius: 15,
            borderStyle: "solid",
            borderWidth: 3,
            borderColor: "black",
            verticalAlign: "top",
            flex: 0.2,
            height: 40,
          }}
        >
          place holder
        </div>
      </div>
    </div>
  );
}

export function Setup(props: {
  time: number;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
}) {
  const sort_scale = 1;
  return (
    <div>
      <div
        style={{
          display: "flex",
          marginLeft: 5,
          marginRight: 5,
          height: 85,
        }}
      >
        {/* the empty divs are for spacing because i am lazy. 
        may put stuff there in the future too ¯\_(ツ)_/¯ */}
        <div style={{ flex: 1 }}></div>
        <div style={{ flex: 1, display: "flex" }}>
          <SortButtonAlphabeticalAscending
            sort_scale={sort_scale}
            time={props.time}
            items={props.items}
            setItems={props.setItems}
          />
          <SortButtonAlphabeticalDecending
            sort_scale={sort_scale}
            time={props.time}
            items={props.items}
            setItems={props.setItems}
          />
        </div>
        <div style={{ flex: 1 }}></div>
      </div>

      {props.items.map((char) => (
        <OSISetup
          on_screen_item={char}
          time={props.time}
          chars={props.items}
          setItems={props.setItems}
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
