import { type IStrokeOptions, type ISvgTextProps } from '@donerui/donerui'
import { type DataType, type MinMax, type ValueLabel } from '..'

export type AxisDimension = 'x' | 'y' | 'color' | 'size' | string

export interface IAxisMinMax {
  minTick?: number
  maxTick?: number
  minTickScaled?: number
  maxTickScaled?: number
}

export interface IAxisData extends IAxisMinMax {
  id: string
  dimension: AxisDimension
  dataKey?: string
  dataType?: DataType
  scale?: number
  ticks?: ValueLabel[]
}

export type AxesData = Record<AxisDimension, Record<string, IAxisData>>

export interface IUseAxisReturnType {
  id: string
  dimension: AxisDimension
  dataKey: string
  dataType: DataType
  scale: number
  ticks: ValueLabel[]
}

export interface IAxisProps {
  id: string
  dimension: AxisDimension
  dataKey?: string
  dataType?: DataType
  className?: string
  strokeOptions?: IStrokeOptions
  tickCount?: number
  tickPrecision?: number
  tickLimits?: MinMax<number>
  tickLabelOptions?: ISvgTextProps
  hidden?: boolean
  axisX?: number | string
  axisY?: number | string
}
