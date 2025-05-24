"use client";

import { useEffect, useRef, useMemo } from "react";
import { Order } from "@/utils/types";
import { Chart, ChartConfiguration } from "chart.js/auto";

interface OrderBookChartProps {
  sellOrders: Order[];
  buyOrders: Order[];
  className?: string;
}

export default function OrderBookChart({
  sellOrders,
  buyOrders,
  className = "w-full h-80",
}: OrderBookChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const buyData = useMemo(
    () =>
      buyOrders
        .slice()
        .reverse()
        .map((order) => ({
          x: order.price / 100,
          y: order.cumulative_quantity,
        })),
    [buyOrders]
  );

  const sellData = useMemo(
    () =>
      sellOrders.map((order) => ({
        x: order.price / 100,
        y: order.cumulative_quantity,
      })),
    [sellOrders]
  );

  const [minPrice, maxPrice] = useMemo(() => {
    const allPrices = [...buyData, ...sellData].map((d) => d.x);
    return [Math.min(...allPrices), Math.max(...allPrices)];
  }, [buyData, sellData]);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: "line",
      data: {
        datasets: [
          {
            label: "Buy Orders",
            data: buyData,
            borderColor: "rgba(72, 187, 120, 1)",
            backgroundColor: "rgba(72, 187, 120, 0.4)",
            borderWidth: 3,
            fill: true,
            tension: 0,
            spanGaps: false,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
          {
            label: "Sell Orders",
            data: sellData,
            borderColor: "rgba(244, 67, 54, 1)",
            backgroundColor: "rgba(244, 67, 54, 0.4)",
            borderWidth: 3,
            fill: true,
            tension: 0,
            spanGaps: false,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "linear",
            min: minPrice,
            max: maxPrice,
            grid: {
              display: true,
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              count: 10,
              callback: (value) => `$${Number(value).toFixed(2)}`,
            },
          },
          y: {
            min: 0,
            suggestedMax: Math.max(
              ...buyData.map((d) => d.y),
              ...sellData.map((d) => d.y)
            ) * 1.1,
            title: {
              display: true,
              text: "Cumulative Quantity",
              color: "rgba(255, 255, 255, 0.7)",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "rgba(255, 255, 255, 0.7)",
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const isBuy = context.datasetIndex === 0;
                const direction = isBuy ? "Buy" : "Sell";
                return `${direction} orders ${context.parsed.y}`;
              },
              title: function (context) {
                const isBuy = context[0].datasetIndex === 0;
                const direction = isBuy ? "or higher" : "or lower";
                return `Price: $${context[0].parsed.x.toFixed(2)} ${direction}`;
              },
            },
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
        elements: {
          line: {
            borderJoinStyle: "round",
          },
          point: {
            hoverBorderWidth: 2,
          },
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [buyData, sellData, minPrice, maxPrice]);

  return (
    <div className={className}>
      <canvas ref={chartRef} />
    </div>
  );
}
