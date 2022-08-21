import { OnScreenItem } from "../../data-structures/ost-data-structures";
import { CalcTotalOnScreenPercentage } from "../on-screen-items/on-screen-item";

function compareVisible(a: OnScreenItem, b: OnScreenItem) {
  const a_val = a.appearances[a.appearances.length - 1].end;
  const b_val = b.appearances[b.appearances.length - 1].end;
  return a_val || b_val ? (!a_val ? -1 : !b_val ? 1 : 0) : 0;
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
    case "recently-on-screen": {
      const tmp_items = [...items];
      tmp_items.sort((a, b) => {
        if (
          a.appearances[a.appearances.length - 1].end === undefined &&
          b.appearances[b.appearances.length - 1].end !== undefined
        ) {
          return -1;
        }
        if (
          a.appearances[a.appearances.length - 1].end !== undefined &&
          b.appearances[b.appearances.length - 1].end === undefined
        ) {
          return 1;
        }
        if (
          a.appearances[a.appearances.length - 1].end === undefined &&
          b.appearances[b.appearances.length - 1].end === undefined
        ) {
          return 0;
        }
        if (
          b.appearances[b.appearances.length - 1].end! -
            a.appearances[a.appearances.length - 1].end! ===
          0
        ) {
          if (
            CalcTotalOnScreenPercentage(a, time) -
              CalcTotalOnScreenPercentage(b, time) >
            0
          ) {
            return -1;
          }
          if (
            CalcTotalOnScreenPercentage(a, time) -
              CalcTotalOnScreenPercentage(b, time) <
            0
          ) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (
            a.appearances[a.appearances.length - 1].end! -
              b.appearances[b.appearances.length - 1].end! >
            0
          ) {
            return -1;
          }
          if (
            a.appearances[a.appearances.length - 1].end! -
              b.appearances[b.appearances.length - 1].end! <
            0
          ) {
            return 1;
          } else {
            return 0;
          }
        }
      });
      return tmp_items;
      // });
      // return [...output];
    }
    case "not-recently-on-screen": {
      const tmp_items = [...items];
      tmp_items.sort((a, b) => {
        if (
          a.appearances[a.appearances.length - 1].end === undefined &&
          b.appearances[b.appearances.length - 1].end !== undefined
        ) {
          return 1;
        }
        if (
          a.appearances[a.appearances.length - 1].end !== undefined &&
          b.appearances[b.appearances.length - 1].end === undefined
        ) {
          return -1;
        }
        if (
          a.appearances[a.appearances.length - 1].end === undefined &&
          b.appearances[b.appearances.length - 1].end === undefined
        ) {
          return 0;
        }
        if (
          b.appearances[b.appearances.length - 1].end! -
            a.appearances[a.appearances.length - 1].end! ===
          0
        ) {
          if (
            CalcTotalOnScreenPercentage(a, time) -
              CalcTotalOnScreenPercentage(b, time) >
            0
          ) {
            return 1;
          }
          if (
            CalcTotalOnScreenPercentage(a, time) -
              CalcTotalOnScreenPercentage(b, time) <
            0
          ) {
            return -1;
          } else {
            return 0;
          }
        } else {
          if (
            a.appearances[a.appearances.length - 1].end! -
              b.appearances[b.appearances.length - 1].end! >
            0
          ) {
            return 1;
          }
          if (
            a.appearances[a.appearances.length - 1].end! -
              b.appearances[b.appearances.length - 1].end! <
            0
          ) {
            return -1;
          } else {
            return 0;
          }
        }
      });
      return tmp_items;
    }
    default: {
      break;
    }
  }
  return items;
}

export function SortButtonAlphabeticalAscending(props: {
  sort_scale: number;
  time: number;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
}) {
  return (
    <div
      className=" ost_visual"
      style={{
        flex: props.sort_scale,
        fontSize: 68,
        textAlign: "center",
        verticalAlign: "center",
        lineHeight: 0.6,
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
  );
}

export function SortButtonAlphabeticalDecending(props: {
  sort_scale: number;
  time: number;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
}) {
  return (
    <div
      className=" ost_visual"
      style={{
        flex: props.sort_scale,
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
  );
}

function SortingNavigation(props: {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
  osi_name_align: string;
  setOSINameAlign: React.Dispatch<React.SetStateAction<string>>;
}) {
  const sort_scale = 0.2;

  return (
    <div
      style={{
        display: "flex",
        marginLeft: 5,
        marginRight: 5,
        height: 85,
        width: 500,
      }}
    >
      <div
        className=" ost_visual"
        style={{
          flex: sort_scale,
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
      {/* sort not-recently-on-screen */}
      <div
        className=" ost_visual"
        style={{
          flex: sort_scale,
          fontSize: 25,
          textAlign: "center",
          verticalAlign: "center",
          lineHeight: 2.15,
          borderColor: "white",
        }}
        onClick={() =>
          props.setItems(
            sortOSIs("not-recently-on-screen", props.items, props.time)
          )
        }
      >
        👁
      </div>
      {/* sort alphabetically ascending */}
      <SortButtonAlphabeticalAscending
        sort_scale={sort_scale}
        time={props.time}
        items={props.items}
        setItems={props.setItems}
      />
      {/* sort alphabetically decending */}
      <SortButtonAlphabeticalDecending
        sort_scale={sort_scale}
        time={props.time}
        items={props.items}
        setItems={props.setItems}
      />
      {/* sort recently-on-screen */}
      <div
        className=" ost_visual"
        style={{
          flex: sort_scale,
          fontSize: 60,
          textAlign: "center",
          verticalAlign: "center",
          lineHeight: 0.75,
          borderColor: "white",
        }}
        onClick={() =>
          props.setItems(
            sortOSIs("recently-on-screen", props.items, props.time)
          )
        }
      >
        👁
      </div>
      {/* sort decending */}
      <div
        className=" ost_visual"
        style={{
          flex: sort_scale,
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
  );
}

export function NavigationBar(props: {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
  osi_name_align: string;
  setOSINameAlign: React.Dispatch<React.SetStateAction<string>>;
  events_visible: boolean;
  setEventsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // const sort_scale = 0.03;
  return (
    <div style={{ display: "flex", marginLeft: 5, marginRight: 5, height: 85 }}>
      {/* this first one is the toggle name left and right */}
      <div
        className=" ost_visual"
        style={{
          flex: 0.1,
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
      {/* this is where the loaded ostp view selection and toggle showing events will be  */}
      <div
        style={{
          flex: 0.1,
          fontSize: 50,
          textAlign: "center",
          verticalAlign: "center",
          lineHeight: 1,
          borderColor: "white",
          background: props.events_visible ? "gray" : "#383838",
          color: props.events_visible ? "black" : "#787878",
          margin: 5,
          padding: 5,
          paddingLeft: 0,
          borderRadius: 15,
          borderStyle: "solid",
          borderWidth: 3,
        }}
        onClick={() => props.setEventsVisible(!props.events_visible)}
      >
        Events
      </div>
      {/* <div style={{ flex: 0.1, marginLeft: "auto" }}> */}
      <div style={{ marginLeft: "auto" }}>
        <SortingNavigation
          time={props.time}
          setTime={props.setTime}
          items={props.items}
          setItems={props.setItems}
          osi_name_align={props.osi_name_align}
          setOSINameAlign={props.setOSINameAlign}
        />
      </div>
    </div>
  );
}
