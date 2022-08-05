import {
  OnScreenItem,
  Appearance,
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

export function RenderOnScreenItem(props: {
  on_screen_item: OnScreenItem;
  time: number;
  chars: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
  osi_name_align: string;
}) {
  const current = props.on_screen_item.appearances.find((app) => !app.end);

  const setColor = (e: any) => {
    let newChars = [...props.chars];
    newChars[props.chars.indexOf(props.on_screen_item)] = {
      ...props.on_screen_item,
      color: e.target.value,
    };
    props.setItems(newChars);
  };

  // const alignStyle = (style: string) => ({
  //   text-align: (style == "left") ? 'left' : 'right'
  // });

  return (
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
          {
            {
              left: (
                <input
                  className="item_name"
                  type="text"
                  style={{ flex: 1, textAlign: "left" }}
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
              ),
              right: (
                <input
                  className="item_name"
                  type="text"
                  style={{ flex: 1, textAlign: "right" }}
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
              ),
            }[props.osi_name_align]
          }
        </div>
        <div style={{ marginLeft: 5 }}>
          Percent of total time on screen{" "}
          {CalcTotalOnScreenPercentage(
            props.on_screen_item,
            props.time
          ).toFixed(2)}
          %
        </div>
        <HistogramBar on_screen_item={props.on_screen_item} time={props.time} />
        <div style={{ marginLeft: 5 }}>On Screen Occurances</div>
        <TimelineBar on_screen_item={props.on_screen_item} time={props.time} />
      </div>
      <button
        className="ost_tracking_element ost_visual"
        id="ost_item_button"
        onClick={() =>
          UpdateOSIdata(
            props.on_screen_item,
            props.chars,
            props.time,
            props.setItems
          )
        }
      >
        {current ? "👁" : "--"}
      </button>
    </div>
  );
}
