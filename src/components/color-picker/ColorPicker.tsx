import { h, FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import register from 'preact-custom-element';
import { drawColorWheel } from './ColorPicker.utils';

import styles from './ColorPicker.module.css';

interface IColorPickerProps {
  onChange: (color: string) => void;
}

const ColorPicker: FunctionComponent<IColorPickerProps> = ({ onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState<string>('');
  const [lightness, setLightness] = useState<number>(50);
  const [coords, setCoords] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    drawColorWheel(canvasRef, lightness);
  }, [lightness]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext('2d');
      handleColorChange(context, ...coords);
    }
  }, [lightness]);

  const handleLightnessInput: h.JSX.GenericEventHandler<HTMLInputElement> = (e) => {
    setLightness(parseInt(e.currentTarget.value));
  };

  const handleClick: h.JSX.MouseEventHandler<HTMLCanvasElement> = (event) => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        const { offsetX: x, offsetY: y } = event;
        setCoords([x, y]);

        handleColorChange(context, x, y);
      }
    }
  };

  function handleColorChange(context: CanvasRenderingContext2D, x: number, y: number) {
    const imageData = context.getImageData(x, y, 1, 1).data;
    const rgbColor = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;

    setColor(rgbColor);
    onChange(rgbColor);
  }

  return (
    <div className={styles.root}>
      <div className={styles.leftColumn}>
        <canvas ref={canvasRef} width={300} height={300} onClick={handleClick} className={styles.canvas} />
        <div style={{ backgroundColor: color }} className={styles.colorSwatch}></div>
        <input type="text" value={color} />
      </div>

      <div className={styles.rightColumn}>
        <label for="lightness" className={styles.labelLightness}>
          Lightness
        </label>
        <input
          className={styles.lightness}
          type="range"
          id="lightness"
          min="0"
          max="100"
          value={lightness}
          onInput={handleLightnessInput}
        />
      </div>
    </div>
  );
};

register(ColorPicker, 'color-picker', [], { shadow: true });

export default ColorPicker;
