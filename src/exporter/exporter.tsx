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
  width: number,
  context: CanvasRenderingContext2D
) {
  // draw a given app in the context
}

function DrawAppearances(
  apps: Appearance[],
  width: number,
  context: CanvasRenderingContext2D
) {
  // call draw app for all apps
}

function DrawOSI(
  item: OnScreenItem,
  context: CanvasRenderingContext2D,
  width: number
) {
  // given an OSI draw all the appearance timeline
}

export function Exporter(props: { items: OnScreenItem[]; time: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const height = 500;
  const width = 1500;

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
        context.fillRect(0, 0, width, height);

        context.strokeStyle = "black";
        context.fillStyle = "black";
        context.lineWidth = 10;

        // Wall
        context.strokeRect(75, 140, 150, 110);

        // Door
        context.fillRect(130, 190, 40, 60);

        // Roof
        context.strokeStyle = "red";
        context.beginPath();
        context.moveTo(50, 140);
        context.lineTo(150, 60);
        context.lineTo(250, 140);

        context.closePath();
        context.stroke();

        context.font = "50px impact";
        context.fillText("Justa Name", 30, 400);
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
