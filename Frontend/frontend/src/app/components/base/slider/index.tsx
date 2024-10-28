import {Slider as RSlider} from '@radix-ui/themes'
import cn from 'classnames'
import './style.css'

type ISliderProps = {
  className?: string
  value: number
  max?: number
  min?: number
  step?: number
  disabled?: boolean
  onChange: (value: number) => void
}

const Slider: React.FC<ISliderProps> = ({ className, max, min, step, value, disabled, onChange }) => {
  return <RSlider
    disabled={disabled}
    defaultValue={isNaN(value) ? [0] : [value]}
    min={min || 0}
    max={max || 100}
    step={step || 1}
    className={cn(className, 'slider')}
    onChange={(e: any) => {onChange(e.target.value)}}
  />
}

export default Slider
