import React from "react"

interface Props {
  segments: number
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

const pointOnCircle = (center: Point, radius: number, angleDeg: number, angleOffset = 0): Point => {
  // 90° offset ccw by default, so angle goes from the the top, not right of the circle
  // custom offset to rotate cw
  const angleRad = (angleDeg - 90 + angleOffset) * Math.PI / 180
  return {
    x: Math.cos(angleRad) * radius + center.x,
    y: (Math.sin(angleRad)) * radius + center.y
  }
}

export const PrizeWheel: React.FC<Props> = ({ segments }) => {

  const d: Sector = {
    center: { x: 200, y: 200 },
    radius: 195,
    startAngle: 0,
    endAngle: segments !== 1 ? 360 / segments : 359.99
  }

  const largeArcFlag = d.endAngle - d.startAngle <= 180 ? 0 : 1

  // const points = [...Array(segments).keys()].map((_, i) => {
  //   return pointOnCircle(d.center, d.radius, d.startAngle, i * d.endAngle)
  // })
  // console.log(points)

  const colors = [
    "orchid",
    "lightgreen",
    "aquamarine",
    "tomato",
    "lightblue",
    "orange",
  ]

  // const startPos = polar(d.center, d.radius, d.endAngle)
  // const endPos = polar(d.center, d.radius, d.startAngle)

  // console.log(startPos)
  // console.log(endPos)

  /* M   200       0         A   200     200     0 1        0 400     200     L    200  200  Z
    Move startPosX startPosY Arc radiusX radiusY ? largeArc ? arcPosX arcPosY Line posX posY Close path
    arcPos -> creates an arc from current position (like a cursor) to given arcPos */
  return (
    <svg height="400" width="400">
      <circle cx={d.center.x} cy={d.center.y} r={d.radius} stroke="#222" strokeWidth="5" fill="none" />

      {[...Array(segments).keys()].map((_, i) => {
        const startPos = pointOnCircle(d.center, d.radius, d.endAngle, i * d.endAngle)
        const endPos = pointOnCircle(d.center, d.radius, d.startAngle, i * d.endAngle)

        // replace with different color, if last color is the same as the first
        const colorIndex = i % colors.length
        const color = (colorIndex === 0 && i === segments - 1) ? colors[colors.length / 2] : colors[colorIndex]
        // const color = colors[i % colors.length]

        return (
          <path stroke="#222" strokeWidth="1" fillOpacity="0.5" fill={color} d={
            `M ${startPos.x} ${startPos.y} ` +
            `A ${d.radius} ${d.radius} 0 ${largeArcFlag} 0 ${endPos.x} ${endPos.y} ` +
            `L ${d.center.x} ${d.center.y} Z`
          } />
        )
      })}

      {/* <path stroke="purple" strokeWidth="2" fill="purple" d={
        `M ${startPos.x} ${startPos.y} ` +
        `A ${d.radius} ${d.radius} 0 ${largeArcFlag} 0 ${endPos.x} ${endPos.y} ` +
        `L ${d.center.x} ${d.center.y} Z`
      } /> */}

      {/* <circle cx={startPos.x} cy={startPos.y} r="5" />
      <circle cx={endPos.x} cy={endPos.y} r="5" /> */}

      {/* {points.map((v, i) => <circle cx={v.x} cy={v.y} r="5" fill={colors[i % colors.length]} key={"segment" + i} />)} */}
    </svg>
  )
}