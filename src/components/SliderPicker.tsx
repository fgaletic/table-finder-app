
import { Slider } from "@/components/ui/slider";

interface SliderPickerProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatter?: (value: number) => string;
}

export const SliderPicker = ({
  min,
  max,
  step,
  value,
  onChange,
  formatter = (val) => val.toString(),
}: SliderPickerProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={(values) => onChange(values[0])}
          className="flex-grow"
        />
        <span className="w-16 px-2 py-0.5 bg-muted rounded text-sm text-center">
          {formatter(value)}
        </span>
      </div>
    </div>
  );
};
