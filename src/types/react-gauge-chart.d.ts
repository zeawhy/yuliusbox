declare module 'react-gauge-chart' {
    import { FC } from 'react';
    interface GaugeChartProps {
        id: string;
        nrOfLevels?: number;
        arcsLength?: number[];
        colors?: string[];
        percent?: number;
        arcPadding?: number;
        arcWidth?: number;
        textColor?: string;
        needleColor?: string;
        needleBaseColor?: string;
        hideText?: boolean;
        animate?: boolean;
        animDelay?: number;
        formatTextValue?: (value: string) => string;
        style?: React.CSSProperties;
        className?: string;
    }
    const GaugeChart: FC<GaugeChartProps>;
    export default GaugeChart;
}
