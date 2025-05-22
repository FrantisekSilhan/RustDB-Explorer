"use client";

import { useEffect, useMemo, useRef } from "react";
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
  className = "w-full h-80"
}: OrderBookChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  // Process data for the chart
  const { processedBuyOrders, processedSellOrders, minPrice, maxPrice } = useMemo(() => {
    // Sort orders by price
    const sortedBuyOrders = [...buyOrders].sort((a, b) => a.price - b.price);
    const sortedSellOrders = [...sellOrders].sort((a, b) => a.price - b.price);
    
    // Get min and max prices with a margin
    const allPrices = [...sortedBuyOrders, ...sortedSellOrders].map(o => o.price);
    const min = Math.min(...allPrices) * 0.95;
    const max = Math.max(...allPrices) * 1.05;
    
    return {
      processedBuyOrders: sortedBuyOrders,
      processedSellOrders: sortedSellOrders,
      minPrice: min,
      maxPrice: max
    };
  }, [buyOrders, sellOrders]);

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;
    
    // Create chart configuration
    const config: ChartConfiguration = {
      type: "bar",
      data: {
        labels: [
          ...processedBuyOrders.map(o => (o.price / 100).toFixed(2)),
          ...processedSellOrders.map(o => (o.price / 100).toFixed(2))
        ],
        datasets: [
          {
            label: "Buy Orders",
            data: processedBuyOrders.map(o => o.quantity),
            backgroundColor: "rgba(72, 187, 120, 0.5)",
            borderColor: "rgba(72, 187, 120, 1)",
            borderWidth: 1,
            stack: "stack0",
            barPercentage: 1,
            categoryPercentage: 1
          },
          {
            label: "Sell Orders",
            data: [...Array(processedBuyOrders.length).fill(0), ...processedSellOrders.map(o => o.quantity)],
            backgroundColor: "rgba(244, 67, 54, 0.5)",
            borderColor: "rgba(244, 67, 54, 1)",
            borderWidth: 1,
            stack: "stack1",
            barPercentage: 1,
            categoryPercentage: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Price ($)",
              color: "rgba(255, 255, 255, 0.7)"
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              maxRotation: 45,
              minRotation: 45
            },
            grid: {
              display: false
            }
          },
          y: {
            title: {
              display: true,
              text: "Quantity",
              color: "rgba(255, 255, 255, 0.7)"
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)"
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)"
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: "rgba(255, 255, 255, 0.7)"
            }
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                return `Price: $${tooltipItems[0].label}`;
              }
            }
          }
        }
      }
    };
    
    // Create the chart
    chartInstance.current = new Chart(ctx, config);
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [processedBuyOrders, processedSellOrders, minPrice, maxPrice]);

  return (
    <div className={className}>
      <canvas ref={chartRef} />
    </div>
  );
}