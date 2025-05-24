"use client";

import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";

interface PricePoint {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: PricePoint[];
  className?: string;
}

export default function PriceChart({ data, className = "w-full h-64" }: PriceChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dates = sortedData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString();
    });

    const prices = sortedData.map(d => d.price / 100);

    const config: ChartConfiguration = {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Price (USD)",
            data: prices,
            borderColor: "rgba(234, 88, 12, 1)",
            backgroundColor: "rgba(234, 88, 12, 0.1)",
            pointBackgroundColor: "rgba(234, 88, 12, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(234, 88, 12, 1)",
            fill: true,
            tension: 0.4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: true,
              color: "rgba(255, 255, 255, 0.1)"
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            min: Math.round(Math.min(...prices) * 0.5),
            max: Math.round(Math.max(...prices) * 1.5),
            grid: {
              color: "rgba(255, 255, 255, 0.1)"
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              callback: function(value) {
                return "$" + value;
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `$${context.parsed.y.toFixed(2)}`;
              }
            }
          }
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
      }
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className={className}>
      <canvas ref={chartRef} />
    </div>
  );
}