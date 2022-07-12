import {
  OnScreenItem,
  Appearance,
} from "../data-structures/ost-data-structures";
import { useRef, useEffect } from "react";
/*
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
*/
function DrawAppearance(
  app: Appearance,
  time: number,
  y: number,
  color: string,
  width: number,
  context: CanvasRenderingContext2D
) {
  const start = (app.start / time) * width;
  const end = ((app.end ?? time) / time) * width;
  context.strokeStyle = color;
  context.lineCap = "butt";
  context.beginPath();
  context.moveTo(start, y);
  context.lineTo(end, y);
  context.stroke();
  // context.fillText(start.toString(), end + 10, y + 25);
  // context.fillText(end.toString(), end + 10, y + 45);
  // context.fillText(time.toString(), end + 10, y + 65);
}

function DrawAppearances(
  apps: Appearance[],
  time: number,
  y: number,
  color: string,
  width: number,
  context: CanvasRenderingContext2D
) {
  // DrawAppearance(apps[0], time, y, color, width, context);
  // DrawAppearance(apps[1], time, y, color, width, context);
  // DrawAppearance(apps[2], time, y, color, width, context);
  // call draw app for all apps
  for (let osi of apps) {
    DrawAppearance(osi, time, y, color, width, context);
  }
  // apps.map((osi) => {
  //   DrawAppearance(osi, time, y, color, width, context);
  // });
}

function DrawOSI(
  item: OnScreenItem,
  time: number,
  context: CanvasRenderingContext2D,
  width: number,
  zero: { x: number; y: number }
) {
  // given an OSI draw all the appearance timeline
  const start_x = zero.x;
  const end_x = zero.x + width;
  const y = zero.y;
  DrawAppearances(item.appearances, time, zero.y, item.color, width, context);
}

export function Exporter(props: { items: OnScreenItem[]; time: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draw_height = 50;
  const height = props.items.length * draw_height;
  const width = 2000;

  // collect all the different input options
  // text style:
  //    color, size, font
  //    should title and OSI names be different?
  // sorted vs. as is
  // transparent background vs color
  // draw style:
  //  line thickness
  //  rounded corners
  //  etc.
  // display names or not:
  //  show on left
  //  right
  //  both
  // display title or not:
  //  other info?:
  //      runtime, release year?
  //  top:
  //      left, right, center
  //  bottom:
  //      left, right, center
  // export image size:
  //  width
  //  height? this should probably be dependent on number of OSIs

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current?.getContext("2d");
      if (context) {
        // purge the whole canvas before redrawing
        context.clearRect(0, 0, width, height);
        context.fillStyle = "white";
        // context.fillRect(0, 0, width, height);
        context.font = "20px impact";

        context.strokeStyle = "black";
        context.fillStyle = "black";

        context.lineWidth = draw_height;

        var draw_y = draw_height / 2;
        for (let osi of props.items) {
          DrawOSI(osi, props.time, context, width, {
            x: 0,
            y: draw_y,
          });
          draw_y += draw_height;
        }
        // // Wall
        // context.strokeRect(75, 140, 150, 110);

        // // Door
        // context.fillRect(130, 190, 40, 60);

        // // Roof
        // context.strokeStyle = "red";
        // context.beginPath();
        // context.moveTo(50, 140);
        // context.lineTo(150, 60);
        // context.lineTo(250, 140);

        // context.closePath();
        // context.stroke();

        // context.font = "20px impact";
        // context.fillText("Justa Name", 30, 400);
      }
    }
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}></div>
      <canvas
        style={{ flex: 1 }}
        ref={canvasRef}
        height={height}
        width={width}
      />
      <div style={{ flex: 1 }}></div>
    </div>
  );
}
