import { multiplyWithPercentage } from '@donerui/base'
import { Svg, defaultLineStrokeOptions, useSVG, type Alignment } from '@donerui/donerui'
import { Fragment, useEffect, useState } from 'react'
import { calculateChartMinMaxTicksForDimension, defaultTickLimits, segmentateAxis, useAxis, useChart, type IAxisProps, type ValueLabel } from '..'

export * from './constants'
export * from './hooks'
export * from './types'
export * from './utils'

function Axis ({
  className,
  id,
  dimension,
  dataKey,
  dataType = 'string',
  strokeOptions = defaultLineStrokeOptions,
  tickLabelOptions,
  tickCount = 10,
  tickLimits = defaultTickLimits,
  hidden = false,
  axisX = 0,
  axisY = 0
}: IAxisProps): JSX.Element {
  const renderable = dimension === 'x' || dimension === 'y'
  const { viewBox } = useSVG() // Renderable axes only

  const { setAxis, snappedData, axes } = useChart()
  const axis = useAxis(dimension, id)

  const minMaxForDimension = calculateChartMinMaxTicksForDimension(axes)

  const axisXAsNumber = typeof axisX === 'string' ? multiplyWithPercentage(minMaxForDimension.x?.maxTickScaled ?? 0, axisX) : axisX
  const axisYAsNumber = typeof axisY === 'string' ? multiplyWithPercentage(minMaxForDimension.y?.maxTickScaled ?? 0, axisY) : axisY

  const [segments, setSegments] = useState<ValueLabel[]>([])
  const [segmentLimits, setSegmentLimits] = useState<{ min: number, max: number }>({ min: 0, max: 100 })

  const [labelDirection, setLabelDirection] = useState<Alignment>('center')

  useEffect(() => {
    switch (dimension) {
      case 'x':
        setLabelDirection(tickLabelOptions?.dominantBaseline !== 'hanging' ? 'top' : 'down')
        break
      case 'y':
        setLabelDirection(tickLabelOptions?.textAnchor === 'start' ? 'left' : 'right')
        break
      default:
        break
    }
  }, [dimension, tickLabelOptions])

  useEffect(() => {
    if (!renderable) return
    if (axis == null) return

    let newSegments: ValueLabel[] = []

    if (dataType === 'string') {
      const interval = 10 * axis.scale
      newSegments = axis.ticks.map((t, i) => ({ value: i * interval, label: t.label }))
    } else {
      newSegments = segmentateAxis(axis.scale, axis.ticks, tickCount, tickLimits)
    }

    setSegments(newSegments)
  }, [tickCount, tickLimits, axis?.scale, axis?.ticks])

  useEffect(() => {
    if (!renderable) return

    const min = segments[0]?.value ?? 0
    const max = segments[segments.length - 1]?.value ?? 100

    setSegmentLimits({ min, max })
  }, [segments])

  useEffect(() => {
    setAxis({ id, dimension, dataKey, dataType })
  }, [id, dimension, dataKey, dataType, setAxis])

  return hidden
    ? (
      <Fragment />
      )
    : (
      <Fragment>
        {dimension === 'x' && (
          <Svg.Group
            className={className}
          >
            <Svg.Line
              points={[{ x: Math.max(viewBox.x, segmentLimits.min), y: axisYAsNumber }, { x: Math.min(viewBox.x + viewBox.width, segmentLimits.max), y: axisYAsNumber }]}
              strokeOptions={strokeOptions}
            />

            {segments.map((segX, i) => (
              <Fragment
                key={i}
              >
                <Svg.Line
                  key={i}
                  points={[{ x: segX.value, y: axisYAsNumber }, { x: segX.value, y: axisYAsNumber + (labelDirection === 'top' ? -1 : 1) }]}
                  strokeOptions={strokeOptions}
                />

                <Svg.Text
                  point={{ x: segX.value, y: axisYAsNumber + (labelDirection === 'top' ? -2 : 2) }}
                  text={segX.label}
                  dominantBaseline='hanging'
                  {...tickLabelOptions}
                />
              </Fragment>
            ))}

            {(snappedData?.x != null && snappedData?.data?.x != null) && (
              <Fragment>
                <Svg.Line
                  points={[{ x: snappedData.x, y: axisYAsNumber }, { x: snappedData?.x, y: axisYAsNumber + (labelDirection === 'down' ? -1 : 1) }]}
                  strokeOptions={strokeOptions}
                />
                <Svg.Text
                  point={{ x: snappedData.x, y: axisYAsNumber + (labelDirection === 'down' ? -2 : 2) }}
                  text={snappedData?.data.x}
                  {...tickLabelOptions}
                  dominantBaseline={tickLabelOptions?.dominantBaseline === 'hanging' ? 'hanging' : 'middle'}
                />
              </Fragment>
            )}
          </Svg.Group>
        )}

        {dimension === 'y' && (
          <Svg.Group
            className={className}
          >
            <Svg.Line
              points={[{ x: axisXAsNumber, y: Math.max(viewBox.y, segmentLimits.min) }, { x: axisXAsNumber, y: Math.min(viewBox.y + viewBox.height, segmentLimits.max) }]}
              strokeOptions={strokeOptions}
            />

            {segments.map((segY, i) => (
              <Fragment
                key={i}
              >
                <Svg.Line
                  key={i}
                  points={[{ x: axisXAsNumber, y: segY.value }, { x: axisXAsNumber + (labelDirection === 'right' ? -1 : 1), y: segY.value }]}
                  strokeOptions={strokeOptions}
                />

                <Svg.Text
                  point={{ x: axisXAsNumber + (labelDirection === 'right' ? -2 : 2), y: segY.value }}
                  text={segY.label}
                  textAnchor='end'
                  {...tickLabelOptions}
                />
              </Fragment>
            ))}

            {(snappedData?.y != null && snappedData?.data?.y != null) && (
              <Fragment>
                <Svg.Line
                  points={[{ x: axisXAsNumber, y: snappedData.y }, { x: axisXAsNumber + (labelDirection === 'left' ? -1 : 1), y: snappedData?.y }]}
                  strokeOptions={strokeOptions}
                />
                <Svg.Text
                  point={{ x: axisXAsNumber + (labelDirection === 'left' ? -2 : 2), y: snappedData.y }}
                  text={snappedData?.data.y}
                  {...tickLabelOptions}
                  textAnchor={tickLabelOptions?.textAnchor === 'start' ? 'end' : 'start'}
                />
              </Fragment>
            )}
          </Svg.Group>
        )}
      </Fragment>
      )

  // return hidden
  //   ? (
  //     <Fragment />
  //     )
  //   : (
  //     <Svg.Group
  //       className={className}
  //     >
  //       <Svg.Line
  //         points={[{ x: Math.max(x, tickLimits.min), y: axisY }, { x: Math.min(x + width, tickLimits.max), y: axisY }]}
  //         strokeOptions={strokeOptions}
  //       />

  //       {segments.map((segX, i) => (
  //         <Fragment
  //           key={i}
  //         >
  //           <Svg.Line
  //             key={i}
  //             points={[{ x: segX.value, y: axisY }, { x: segX.value, y: axisY + (labelDirection === 'top' ? -1 : 1) }]}
  //             strokeOptions={strokeOptions}
  //           />

  //           <Svg.Text
  //             point={{ x: segX.value, y: axisY + (labelDirection === 'top' ? -2 : 2) }}
  //             text={segX.label}
  //             {...tickLabelOptions}
  //           />
  //         </Fragment>
  //       ))}

  //       {highlightedX != null && (
  //         <Fragment>
  //           <Svg.Line
  //             points={[{ x: highlightedX.value, y: axisY }, { x: highlightedX.value, y: axisY + (labelDirection === 'top' ? -1 : 1) }]}
  //             strokeOptions={strokeOptions}
  //           />
  //           <Svg.Text
  //             point={{ x: highlightedX.value, y: axisY + (labelDirection === 'top' ? -4 : 4) }}
  //             text={highlightedX.label}
  //             {...tickLabelOptions}
  //           />
  //         </Fragment>
  //       )}
  //     </Svg.Group>
  //     )
}

export default Axis
