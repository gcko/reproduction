'use client';
import * as Highcharts from 'highcharts';
import dayjs from 'dayjs';
import { map } from 'lodash';
import utc from 'dayjs/plugin/utc';
import { useEffect, useRef, useState } from "react";
dayjs.extend(utc);

const tokens: string[] = ['ETH', 'wBTC', 'USDC', 'USDT', 'DAI'];

const maturityDates = [
  dayjs().add(10, 'days').unix(),
  dayjs().add(3, 'weeks').unix(),
  dayjs().add(6, 'weeks').unix(),
  dayjs().add(3, 'months').unix(),
  dayjs().add(6, 'months').unix(),
  dayjs().add(9, 'months').unix(),
  dayjs().add(1, 'year').unix(),
];

const fUnixTimeToUtc: (unixTimeOfSeconds?: number, format?: string) => string = (
  unixTimeOfSeconds?: number,
  format?: string,
): string => {
  if (!unixTimeOfSeconds) {
    return '';
  }
  return dayjs
    .unix(unixTimeOfSeconds)
    .utc()
    .format(format ?? 'YYYY-MM-DD');
};

const generateSeries = ({
    maturityDates,
    tokens
}: {
  maturityDates: number[];
  tokens: string[];
}): Highcharts.SeriesOptionsType[] => {
  return map(tokens, (t) => ({
    type: 'spline',
    name: t,
    data: Array.from({length: maturityDates.length}, (_, idx) =>
      numBetween(10e3 * (idx + 1.5), 10e4 * (idx + 1.5)),
    ),
  }));
};

const hasWindow = () => {
  return typeof window !== 'undefined';
};

const hasHighcharts = () => {
  return typeof Highcharts === 'object';
};

function numBetween(min: number, max: number): number {
  let multiplier = max - min + 1;
  if (max - min + 1 === 0) {
    console.warn('multiplier is 0, changing to 1');
    multiplier = 1;
  }
  return Math.floor(Math.random() * multiplier + min);
}

export default function Index() {
  const chartRef = useRef<Highcharts.Chart | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const categories = maturityDates.map((md) => fUnixTimeToUtc(md));
  const series = generateSeries({ maturityDates, tokens: tokens });
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    title: {
      text: 'test chart',
    },
    xAxis: {
      categories,
    },
    plotOptions: {
      spline: {
        lineWidth: 2,
        marker: {
          enabled: false,
        },
      },
    },
    series,
  });

  useEffect(() => {
    if (hasWindow() && hasHighcharts()) {
      if (containerRef.current) {
        chartRef.current = Highcharts.chart(containerRef.current, chartOptions, () => {});
      }
    }
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setChartOptions({ xAxis: { categories: maturityDates.map((md) => fUnixTimeToUtc(md)) } });
  }, []);

  return <div ref={containerRef} />;
}
