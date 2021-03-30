import React from "react"
import "../style.css"

interface Props {
  diameter: number,
  names?: string[],
  colors?: string[]
  fade?: boolean
}

interface Point {
  x: number,
  y: number
}

interface Sector {
  center: Point,
  radius: number,
  startAngle: number,
  endAngle: number
}

interface SpinOptions {
  names: string[],
  duration?: number,
  onStart?: (spinTime: number, rotateAmount: number) => void,
  onFinish?: (winner: string, winnerIndex: number) => void,
  startRotation?: number,
  rotateAmount?: number,
  fade?: boolean
}

const pointOnCircle = (center: Point, radius: number, angleDeg: number, angleOffset = 0): Point => {
  // 90° offset ccw by default, so angle goes from the the top, not right of the circle
  // custom offset to rotate cw
  const angleRad = (angleDeg - 90 + angleOffset) * Math.PI / 180
  return {
    x: Math.cos(angleRad) * radius + center.x,
    y: (Math.sin(angleRad)) * radius + center.y
  }
}

const randInt = (min = 0, max: number) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min))

export const spin = (options: SpinOptions) => {

  const {
    names,
    duration = 6000,
    onStart,
    onFinish,
    startRotation = 0,
    rotateAmount = 0,
    fade = false
  } = options

  const wheel = document.getElementById("wheel-g")
  const sectorDeg = 360 / names.length

  // TODO: Replace with better random generator
  const randoms = [
    randInt(0, names.length - 1), // winner index
    randInt(5, 6), // total rotations per spin
    randInt(10, 90) // how much to rotate into the winner sector
  ]

  // 5-7 full rotations, then rotate to winner index and rotate randomly into the winner index
  // rotate given amount from socket if another one is spinning
  const rotateTo = rotateAmount || (randoms[1] * 360) + 360 - (randoms[0] * sectorDeg) - (sectorDeg * randoms[2] / 100) + 90

  if (onStart) onStart(duration, rotateTo)

  if (fade) { document.getElementsByClassName("fade")[0]?.classList.add("fade-in") }

  // TODO: Fix animation delay in firefox in background tab
  wheel?.animate([
    { transform: `rotate(${startRotation}deg)` }, // 'from' keyframe
    { transform: `rotate(${rotateTo}deg)` }, // 'to' keyframe
  ], {
    duration: duration,
    easing: "cubic-bezier(0.12, 0, 0.25, 1)", // 0.1, 0, 0.4, 1 -- 0.33, 1, 0.68, 1 
    fill: "forwards", // keep style of last keyframe
    delay: 500,
  })?.addEventListener("finish", _ => {
    if (onFinish) onFinish(names[randoms[0]], randoms[0])

    if (fade) { document.getElementsByClassName("fade")[0].classList.remove("fade-in") }
    // setRotation(rotateToDeg % 360)
  })
}

export const Wheel: React.FC<Props> = ({
  diameter,
  names = [],
  colors = ["orchid", "lightgreen", "aquamarine", "tomato", "cyan", "orange"],
  fade = false,
}) => {

  // Remove empty lines
  names = names.filter(x => x)

  const segments = names.length

  const d: Sector = {
    center: { x: diameter / 2, y: diameter / 2 },
    radius: (diameter / 2) - 5,
    startAngle: 0,
    endAngle: segments > 1 ? 360 / segments : 360 // 360° angle would be the same as 0°
  }

  const largeArcFlag = d.endAngle - d.startAngle <= 180 ? 0 : 1

  const arrowHeight = diameter * 0.02

  /* M   200       0         A   200     200     0 1        0 400     200     L    200  200  Z
    Move startPosX startPosY Arc radiusX radiusY ? largeArc ? arcPosX arcPosY Line posX posY Close path
    arcPos -> creates an arc from current position (like a cursor) to given arcPos */
  return (
    <svg {...{
      width: diameter,
      height: diameter,
      viewBox: `0 0 ${diameter + arrowHeight * 1.5} ${diameter}`,
      className: fade ? "fade" : ""
    }} >
      <g id="wheel-g" >
        <circle cx={d.center.x} cy={d.center.y} r={d.radius} stroke="#222" strokeWidth="5" fill={colors[colors.length / 2]} />

        {names.map((name, i) => {
          const startPos = pointOnCircle(d.center, d.radius, d.endAngle, i * d.endAngle)
          const endPos = pointOnCircle(d.center, d.radius, d.startAngle, i * d.endAngle)
          const middlePos = pointOnCircle(d.center, d.radius, (d.endAngle / 2) + 1, i * d.endAngle) // for text path

          // replace with different color, if last color is the same as the first
          const colorIndex = i % colors.length
          const color = (colorIndex === 0 && i === segments - 1) ? colors[colors.length / 2] : colors[colorIndex]

          return (
            <g key={"wheel-g-" + i}>
              <path
                className="wheel-sector"
                fill={color}
                d={
                  `M ${startPos.x} ${startPos.y} ` +
                  `A ${d.radius} ${d.radius} 0 ${largeArcFlag} 0 ${endPos.x} ${endPos.y} ` +
                  `L ${d.center.x} ${d.center.y} Z`
                } />
              <defs>
                <path
                  id={"wheel-text-path-" + i}
                  d={`M ${d.center.x} ${d.center.y} L ${middlePos.x} ${middlePos.y} `}
                />
              </defs>
              <text color={color} >
                <textPath
                  // TODO: make text as big as possiblee
                  className="wheel-text"
                  textAnchor="end"
                  dominantBaseline="middle"
                  startOffset="92%"
                  xlinkHref={"#wheel-text-path-" + i} >
                  {name}
                </textPath>
              </text>
              {/* <circle cx={middlePos.x} cy={middlePos.y} r="5" fill={color} /> */}
            </g>
          )
        })}

        {/* <circle cx={startPos.x} cy={startPos.y} r="5" />
      <circle cx={endPos.x} cy={endPos.y} r="5" /> */}
        {/* {points.map((v, i) => <circle cx={v.x} cy={v.y} r="5" fill={colors[i % colors.length]} key={"segment" + i} />)} */}

      </g>

      {/* Middle circle */}
      <circle cx={d.center.x} cy={d.center.y} r={d.radius * 0.1} fill="#333" stroke="#222" strokeWidth="3" />

      <path fill="#aaa" stroke="#222" strokeWidth="3"
        d={`M ${diameter - arrowHeight * 2.25} ${diameter / 2} l ${arrowHeight * 3.5} ${arrowHeight} l 0 ${arrowHeight * -2} Z`}
      />

    </svg>
  )
}
