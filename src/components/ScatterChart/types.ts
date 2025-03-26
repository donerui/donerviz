import { type IStrokeOptions } from '@donerui/donerui'
import { type IChartPoint, type IChartProps, type MinMax, type UseChartReturnType } from '..'

export interface IScatterContextValue {
  xAxisId: string
  yAxisId: string
  sizeAxisId?: string
  sizeRange: MinMax<number>
  colorAxisId?: string
  colorRange: MinMax<string>
  points: IChartPoint[]
}

export type ScatterContextValueMap = Record<string, IScatterContextValue>

export interface IScatterChartContext {
  scatters: ScatterContextValueMap
  addScatter: (id: string, scatter: IScatterContextValue) => void
}

export interface IScatterChartProps extends IChartProps {
}

export type UseScatterChartReturnType = UseChartReturnType & IScatterChartContext

export interface IScatterProps {
  data: any
  dataLabel?: string
  xAxisId?: string
  yAxisId?: string
  sizeAxisId?: string
  sizeRange?: MinMax<number>
  colorAxisId?: string
  colorRange?: MinMax<string>
  className?: string
  strokeOptions?: IStrokeOptions
  dotRadius?: number
  dotFill?: string
  sort?: boolean | ((a: any, b: any) => number)
}
