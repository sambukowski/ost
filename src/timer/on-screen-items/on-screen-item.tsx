import { useState } from "react";
import {
  OnScreenItem,
  Appearance,
  Event,
} from "../../data-structures/ost-data-structures";

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

function RenderEvent(props: {
  // app: Appearance;
  event: Event;
  time: number;
  color: string;
}) {
  const [display, setDisplay] = useState("notdisplayed");
  const showEventInfo = (e: any) => {
    e.preventDefault();
    if (display !== "displayed") {
      setDisplay("displayed");
    }
  };

  const hideEventInfo = (e: any) => {
    e.preventDefault();
    if (display !== "notdisplayed") {
      setDisplay("notdisplayed");
    }
  };

  const incoming_color = parseInt(props.color.substring(1), 16);
  const inverted_color = incoming_color ^ 0xffffff;
  const inv_color_string = inverted_color.toString(16);
  const inv_color: string = "#" + inv_color_string.padStart(6, "0");

  const marker_width = 10;
  return (
    <div>
      <div
        className="event_marker"
        style={{
          position: "absolute",
          background: inv_color,
          left: (props.event.time / props.time) * 100 + "%",
          top: -5,
          height: 20,
          width: marker_width,
        }}
        // onMouseEnter={(e) => showEventInfo(e)}
        onMouseEnter={(e) => showEventInfo(e)}
        onMouseLeave={(e) => hideEventInfo(e)}
      />
      <div
        className={display}
        style={{
          position: "absolute",
          background: inv_color,
          color: props.color,
          left: (props.event.time / props.time) * 100 + "%",
          top: -5,
          height: 20,
          // marginLeft: marker_width,
          marginTop: -20,
          // width: 100,
        }}
        onMouseEnter={(e) => showEventInfo(e)}
        onMouseLeave={(e) => hideEventInfo(e)}
      >
        {"[" +
          new Date(props.event.time * 1000).toISOString().substring(11, 19) +
          "]:" +
          props.event.name}
      </div>
    </div>
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
        {props.on_screen_item.events.map((event, i) => (
          <RenderEvent
            key={i}
            event={event}
            time={props.time}
            color={props.on_screen_item.color}
          />
        ))}
      </div>
    </div>
  );
}

export function CalcTotalOnScreenPercentage(
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
  const on_screen_percent =
    (CalcTotalOnScreenPercentage(props.on_screen_item, props.time) / 100) *
    props.time;
  const hist: Appearance = {
    start: 0,
    end: on_screen_percent,
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

  // populate the appearance list if empty
  if (on_screen_item.appearances.length === 0) {
    newChars[chars.indexOf(on_screen_item)] = {
      ...on_screen_item,
      appearances: [{ start: time }],
    };
    setChars(newChars);
    return;
  }

  // handle appearance logic
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

function RenderEventSelection(props: {
  on_screen_item: OnScreenItem;
  time: number;
  items: OnScreenItem[];
  event_name: string;
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
  osi_name_align: string;
  events_visible: boolean;
  setEventsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // const time_string: string = new Date(props.time * 1000)
  //   .toISOString()
  //   .substring(11, 19);
  // const title_text: string = "[" + time_string + "]:" + props.event_name;
  return (
    <div
      style={{
        background: "gray",
        margin: 5,
        padding: 5,
        paddingLeft: 4,
        borderRadius: 15,
        borderStyle: "solid",
        borderWidth: 3,
        borderColor: props.on_screen_item.color,
        verticalAlign: "middle",
        textAlign: "center",
        fontSize: 40,
        alignItems: "flex-start",
      }}
      onClick={() => {
        let tmp_items = [...props.items];
        const item_index = props.items.indexOf(props.on_screen_item);
        let tmp_event = {
          name: props.event_name,
          time: props.time,
        };
        // need to add code here to not add an event if it already exists at that second
        let tmp_events = tmp_items[item_index].events;
        tmp_events.push(tmp_event);
        // tmp_items[item_index].events = [...new Set(tmp_events)];
        tmp_items[item_index].events = tmp_events;
        // tmp_items = [...new Set(tmp)]
        props.setItems(tmp_items);
      }}
    >
      {props.event_name}
    </div>
  );
}

function EventSelection(props: {
  on_screen_item: OnScreenItem;
  time: number;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
  osi_name_align: string;
  events_visible: boolean;
  setEventsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (props.events_visible) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent:
            props.osi_name_align === "left" ? "flex-start" : "flex-end",
        }}
      >
        <div style={{ flex: 0.1 }}></div>
        {props.on_screen_item.event_list.map((event_name, i) => (
          <RenderEventSelection
            key={i}
            time={props.time}
            items={props.items}
            event_name={event_name}
            setItems={props.setItems}
            osi_name_align={props.osi_name_align}
            on_screen_item={props.on_screen_item}
            events_visible={props.events_visible}
            setEventsVisible={props.setEventsVisible}
          />
        ))}
        <div style={{ flex: 0.1 }}></div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export function RenderOnScreenItem(props: {
  on_screen_item: OnScreenItem;
  time: number;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
  osi_name_align: string;
  events_visible: boolean;
  setEventsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const current = props.on_screen_item.appearances.find((app) => !app.end);

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
      <div style={{ display: "flex", marginLeft: 5, marginRight: 5 }}>
        <div
          className="ost_tracking_element ost_visual"
          style={{
            flex: 0.03,
            background: props.on_screen_item.color,
            padding: 0,
          }}
        >
          <label htmlFor="pickColor" style={{ flex: 0.04, display: "flex" }}>
            <input
              type="color"
              id="pickColor"
              name="pickColor"
              value={props.on_screen_item.color}
              onChange={setColor}
              style={{
                flex: 1,
                background: props.on_screen_item.color,
                height: 115,
                //   margin: 5,
              }}
            />
          </label>
        </div>
        <div className="ost_tracking_element ost_visual" id="ost_item_data">
          <div style={{ display: "flex", marginRight: 5 }}>
            <input
              className="item_name"
              type="text"
              style={{
                flex: 1,
                textAlign: props.osi_name_align === "left" ? "left" : "right",
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
              id="osi_name"
            />
          </div>
          <div style={{ marginLeft: 5 }}>
            Percent of total time on screen{" "}
            {CalcTotalOnScreenPercentage(
              props.on_screen_item,
              props.time
            ).toFixed(2)}
            %
          </div>
          <HistogramBar
            on_screen_item={props.on_screen_item}
            time={props.time}
          />
          <div style={{ marginLeft: 5 }}>On Screen Occurances</div>
          <TimelineBar
            on_screen_item={props.on_screen_item}
            time={props.time}
          />
        </div>
        <button
          className="ost_tracking_element ost_visual"
          id="ost_item_button"
          onClick={() =>
            UpdateOSIdata(
              props.on_screen_item,
              props.items,
              props.time,
              props.setItems
            )
          }
        >
          {current ? "👁" : "--"}
        </button>
      </div>
      <EventSelection
        time={props.time}
        items={props.items}
        setItems={props.setItems}
        osi_name_align={props.osi_name_align}
        on_screen_item={props.on_screen_item}
        events_visible={props.events_visible}
        setEventsVisible={props.setEventsVisible}
      />
    </div>
  );
}
