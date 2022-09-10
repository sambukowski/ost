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
  items: OnScreenItem[],
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

  setChars([...items, new_item]);
}

function RemoveItem(
  items: OnScreenItem[],
  setChars: React.Dispatch<React.SetStateAction<OnScreenItem[]>>
) {
  setChars(items.slice(0, items.length - 1));
}

function SetUpDeleteButton(props: {
  on_screen_item: OnScreenItem;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
}) {
  return (
    <div
      style={{
        background: "#842e2e",
        margin: 20,
        padding: 5,
        paddingLeft: 5,
        borderRadius: 15,
        borderStyle: "solid",
        borderWidth: 3,
        borderColor: "black",
        flex: 0.03,
        fontSize: 55,
        textAlign: "center",
        verticalAlign: "center",
        lineHeight: 0.35,
      }}
      onClick={() => {
        const index = props.items.indexOf(props.on_screen_item);
        const tmp_items = [...props.items];
        tmp_items.splice(index, 1);
        props.setItems(tmp_items);
      }}
    >
      ␡
    </div>
  );
}

function EventNameDeleteButton(props: {
  event_name: string;
  on_screen_item: OnScreenItem;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
}) {
  return (
    <div
      style={{
        background: "#842e2e",
        margin: 5,
        padding: 4,
        paddingLeft: 5,
        borderRadius: 15,
        borderStyle: "solid",
        borderWidth: 3,
        borderColor: "black",
        flex: 0.01,
        fontSize: 25,
        textAlign: "center",
        verticalAlign: "center",
        lineHeight: 0.45,
      }}
      onClick={() => {
        let tmp_items = [...props.items];
        const item_index = props.items.indexOf(props.on_screen_item);
        const event_name_index = props.items[item_index].event_list.indexOf(
          props.event_name
        );
        tmp_items[item_index].event_list.splice(event_name_index, 1);
        props.setItems(tmp_items);
      }}
    >
      ␡
    </div>
  );
}

function RenderEventName(props: {
  event_name: string;
  on_screen_item: OnScreenItem;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
}) {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 0.15 }}></div>
      <EventNameDeleteButton
        event_name={props.event_name}
        on_screen_item={props.on_screen_item}
        items={props.items}
        setItems={props.setItems}
      />
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
        <input
          className="item_name"
          type="text"
          style={{
            textAlign: "left",
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            borderBottom: "1px solid black",
            color: "black",
            fontSize: 18,
          }}
          value={props.event_name}
          onChange={(e) => {
            let tmp_items = [...props.items];
            const item_index = props.items.indexOf(props.on_screen_item);
            const event_name_index = props.items[item_index].event_list.indexOf(
              props.event_name
            );
            tmp_items[item_index].event_list[event_name_index] = e.target.value;
            props.setItems(tmp_items);
          }}
          id="osi_name"
        />
      </div>
    </div>
  );
}

function OSISetup(props: {
  on_screen_item: OnScreenItem;
  time: number;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
}) {
  const osi_setup_height = 75;
  const setColor = (e: any) => {
    let newChars = [...props.items];
    newChars[props.items.indexOf(props.on_screen_item)] = {
      ...props.on_screen_item,
      color: e.target.value,
    };
    props.setItems(newChars);
  };
  return (
    <div>
      <div style={{ display: "flex" }}>
        <SetUpDeleteButton
          on_screen_item={props.on_screen_item}
          items={props.items}
          setItems={props.setItems}
        />
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
                background: props.on_screen_item.color,
                height: osi_setup_height,
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
            type="text"
            style={{
              textAlign: "left",
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              borderBottom: "1px solid black",
              color: "beige",
              fontSize: 55,
            }}
            value={props.on_screen_item.name}
            onChange={(e) => {
              let newChars = [...props.items];
              newChars[props.items.indexOf(props.on_screen_item)] = {
                ...props.on_screen_item,
                name: e.target.value,
              };
              props.setItems(newChars);
            }}
          />
        </div>
      </div>
      {props.on_screen_item.event_list.map((event) => (
        <RenderEventName
          event_name={event}
          on_screen_item={props.on_screen_item}
          items={props.items}
          setItems={props.setItems}
        />
      ))}
      <div style={{ display: "flex" }}>
        <div style={{ flex: 0.2 }}></div>
        <div
          style={{
            background: "gray",
            height: 40,
            margin: 5,
            padding: 5,
            paddingLeft: 5,
            borderRadius: 15,
            borderStyle: "solid",
            borderWidth: 3,
            borderColor: "black",
            verticalAlign: "middle",
            textAlign: "center",

            lineHeight: 0.4,
            fontSize: 40,
            flex: 0.015,
          }}
          onClick={() => {
            props.on_screen_item.event_list.push("New Event");
            props.setItems([...props.items]);
          }}
        >
          +
        </div>

        <div
          style={{
            background: "gray",
            height: 40,
            margin: 5,
            padding: 5,
            paddingLeft: 4,
            borderRadius: 15,
            borderStyle: "solid",
            borderWidth: 3,
            borderColor: "black",
            verticalAlign: "middle",
            textAlign: "center",
            lineHeight: 0.4,
            fontSize: 40,
            flex: 0.015,
          }}
          onClick={() => {
            props.on_screen_item.event_list.pop();
            props.setItems([...props.items]);
          }}
        >
          -
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
  // setSortType: React.Dispatch<React.SetStateAction<string>>;
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
            // setSortType={props.setSortType}
          />
          <SortButtonAlphabeticalDecending
            sort_scale={sort_scale}
            time={props.time}
            items={props.items}
            setItems={props.setItems}
            // setSortType={props.setSortType}
          />
        </div>
        <div style={{ flex: 1 }}></div>
      </div>

      {props.items.map((char) => (
        <OSISetup
          on_screen_item={char}
          time={props.time}
          items={props.items}
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
