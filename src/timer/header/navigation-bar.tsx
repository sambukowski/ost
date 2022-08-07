import { OnScreenItem } from "../../data-structures/ost-data-structures";
import { CalcTotalOnScreenPercentage } from "../on-screen-items/on-screen-item";

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
          return (
            CalcTotalOnScreenPercentage(b, time) -
            CalcTotalOnScreenPercentage(a, time)
          );
        } else {
          return (
            b.appearances[b.appearances.length - 1].end! -
            a.appearances[a.appearances.length - 1].end!
          );
        }
      });
      return tmp_items;
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
          return (
            CalcTotalOnScreenPercentage(a, time) -
            CalcTotalOnScreenPercentage(b, time)
          );
        } else {
          return (
            a.appearances[a.appearances.length - 1].end! -
            b.appearances[b.appearances.length - 1].end!
          );
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

export function NavigationBar(props: {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  items: OnScreenItem[];
  setItems: React.Dispatch<React.SetStateAction<OnScreenItem[]>>;
  osi_name_align: string;
  setOSINameAlign: React.Dispatch<React.SetStateAction<string>>;
}) {
  const sort_scale = 0.03;
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
      {/* sort ascending screen time button */}
      <div
        className=" ost_visual"
        style={{
          flex: sort_scale,
          marginLeft: "auto",
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
          flex: sort_scale,
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
