import React from "react"
// import "../style.css"
import randomNumber from "random-number-csprng"
import { useStyles } from "src/Theme"

interface Props {
  diameter: number,
  names?: string[],
  colors?: string[]
  fade?: boolean
  wheelRef?: React.RefObject<SVGSVGElement>
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
  fade?: FadeOptions,
}

interface FadeOptions {
  ref: React.RefObject<SVGSVGElement>,
  class: string,
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

// const logistic = (x: number, max: number, min: number, a: number, k: number) => min + max - (max / (1 + a * Math.exp(-k * x)))

// f(x), a: 0-1, strength of curvature, b: horizontal offset
const logistic = ({ x, max, min, a = 0.5, b = 0, inverse = false }: {
  x: number,
  max: number,
  min: number,
  b?: number,
  a?: number,
  inverse?: boolean
}) => min + ((max - min) / (1 + (a ** ((x - b) * (inverse ? -1 : 1)))))

export const spin = async (options: SpinOptions) => {

  const {
    names,
    duration = 6000,
    onStart,
    onFinish,
    startRotation = 0,
    rotateAmount = 0,
    fade,
  } = options

  const wheel = document.getElementById("wheel-g")
  const sectorDeg = 360 / names.length

  // index of winner in the list of names, set to 0 for only one name, bacause max > min (instead of >=)
  const winnerIndex = names.length > 1 ? await randomNumber(0, names.length - 1) : 0

  const rotations = randInt(5, 6) // total rotations per spin
  const rotateIntoWinner = randInt(10, 90) / 100 // how much to rotate into the winner sector

  // 5-7 full rotations, then rotate to winner index and rotate randomly into the winner index
  // rotate given amount from socket if another one is spinning, rotate by 90° to set "origin" to the right
  const rotateTo = rotateAmount || (rotations * 360) + (360 - winnerIndex * sectorDeg) - (sectorDeg * rotateIntoWinner) + 90

  if (onStart) onStart(duration, rotateTo)

  if (fade) {
    // document.getElementsByClassName("fade")[0]?.classList.add("fade-in")
    console.log({ fade: fade.class })
    fade.ref.current?.classList.add(fade.class)
  }

  // TODO: Fix animation delay in firefox in background tab
  wheel?.animate([
    { transform: `rotate(${startRotation}deg)` }, // 'from' keyframe
    { transform: `rotate(${rotateTo}deg)` }, // 'to' keyframe
  ], {
    duration: duration,
    easing: "cubic-bezier(0.12, 0, 0.25, 1)", // 0.1, 0, 0.4, 1 -- 0.33, 1, 0.68, 1 
    fill: "forwards", // keep styling of last keyframe
    delay: 500,
  })?.addEventListener("finish", _ => {
    if (onFinish) onFinish(names[winnerIndex], winnerIndex)

    if (fade) {
      fade.ref.current?.classList.remove(fade.class)
      // document.getElementsByClassName("fade")[0].classList.remove("fade-in")
    }

    // setRotation(rotateToDeg % 360)
  })
}

export const Wheel: React.FC<Props> = ({
  diameter,
  names = [],
  colors = ["orchid", "lightgreen", "aquamarine", "tomato", "cyan", "orange"],
  fade = false,
  wheelRef
}) => {

  const cl = useStyles()
  // const wheelRef = useRef<SVGSVGElement>(null)

  // Remove empty lines
  names = names.filter(x => x)

  const segments = names.length

  const d: Sector = {
    center: { x: diameter / 2, y: diameter / 2 },
    radius: (diameter / 2) - 5,
    startAngle: 0,
    endAngle: segments > 1 ? 360 / segments : 359.99 // 360° angle would be the same as 0°
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
      className: fade ? cl.fade : "",
      ref: wheelRef
    }} >
      <circle cx={d.center.x} cy={d.center.y} r={d.radius} className={cl.wheelEmpty} />
      <g id="wheel-g" style={{ transformOrigin: "48.51% 50%" }} >

        {names.map((name, i) => {
          
          //#region Previous scaling factors
          // const adjustTextBaseline = logistic(-names.length, 2, -0.5, 2, 0.3)
          // const adjustTextBaseline = 2 * Math.min(1, 30 / names.length * 0.9)
          
          // const fontSizeNamesMultiplier = logisticInvert(names.length, 1, 0.9, 1, 0.2)
          // const fontSizeNamesMultiplier = Math.max(Math.min(1, 20 / names.length * 1.3), 0.5)
          // const baseFontsize = logistic(name.length / 1.3, diameter / 240, diameter / 440, 1.7, 0.22)
          //#endregion

          // Adjust textpath baseline, so names are better drawn in the middle
          const adjustTextBaseline = logistic({ x: names.length, max: 1.5, min: 0.4, a: 0.9, b: 30, inverse: true })

          const startPos = pointOnCircle(d.center, d.radius, d.endAngle, i * d.endAngle)
          const endPos = pointOnCircle(d.center, d.radius, d.startAngle, i * d.endAngle)
          const middlePos = pointOnCircle(d.center, d.radius, (d.endAngle / 2) + adjustTextBaseline, i * d.endAngle) // for text path

          // Base fontsize based on length of the name (characters), longer names are smaller
          const baseFontsize = logistic({ x: name.length, max: 2.6, min: 1.5, a: 0.7, b: 16.5, inverse: true })

          // Scale names based on number of names in the wheel, size is smaller with more entries 
          const fontSizeNamesMultiplier = logistic({ x: names.length, max: 1, min: 0.6, a: 0.8, b: 34, inverse: true })

          // replace with different color, if last color is the same as the first
          const colorIndex = i % colors.length
          const color = (colorIndex === 0 && i === segments - 1) ? colors[colors.length / 2] : colors[colorIndex]

          return (
            <g key={"wheel-g-" + i}>
              <path
                className={cl.wheelSector}
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
              <text className={cl.wheelText}>
                <textPath
                  // TODO: make text as big as possiblee
                  textAnchor="end"
                  dominantBaseline="middle"
                  startOffset="92%"
                  fontSize={`${baseFontsize * fontSizeNamesMultiplier}em`}
                  xlinkHref={"#wheel-text-path-" + i} >
                  {name.length <= 22 ? name : name.substring(0, 21) + "..."}
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
      <circle cx={d.center.x} cy={d.center.y} r={d.radius * 0.1} className={cl.wheelMiddle} />

      <path className={cl.wheelIndicator}
        d={`M ${diameter - arrowHeight * 2.25} ${diameter / 2} l ${arrowHeight * 3.5} ${arrowHeight} l 0 ${arrowHeight * -2} Z`}
      />

    </svg>
  )
}
