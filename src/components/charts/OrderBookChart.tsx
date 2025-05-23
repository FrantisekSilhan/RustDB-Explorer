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
  className = "w-full h-80",
}: OrderBookChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const { buyData, sellData, allPrices, buyPriceIndexes, sellPriceIndexes } = useMemo(() => {
    const sortedBuyOrders = [...buyOrders].sort((a, b) => b.price - a.price);
    const sortedSellOrders = [...sellOrders].sort((a, b) => a.price - b.price);

    let buyRunningTotal = 0;
    const buyPoints = sortedBuyOrders.map((order) => {
      buyRunningTotal += order.quantity;
      return {
        price: order.price / 100,
        cumulative: buyRunningTotal,
      };
    });

    let sellRunningTotal = 0;
    const sellPoints = sortedSellOrders.map((order) => {
      sellRunningTotal += order.quantity;
      return {
        price: order.price / 100,
        cumulative: sellRunningTotal,
      };
    });

    const buyPrices = buyPoints.map((p) => p.price);
    const sellPrices = sellPoints.map((p) => p.price);
    
    const minBuyPrice = buyPrices.length > 0 ? Math.min(...buyPrices) : 0;
    const maxBuyPrice = buyPrices.length > 0 ? Math.max(...buyPrices) : 0;
    const minSellPrice = sellPrices.length > 0 ? Math.min(...sellPrices) : 0;
    const maxSellPrice = sellPrices.length > 0 ? Math.max(...sellPrices) : 0;

    const allOrderPrices = [...buyPrices, ...sellPrices];
    const minPrice = Math.min(...allOrderPrices);
    const maxPrice = Math.max(...allOrderPrices);

    const priceStep = 0.01;

    const prices: number[] = [];
    for (let price = minPrice; price <= maxPrice; price += priceStep) {
      prices.push(Math.round(price * 100) / 100);
    }

    const buyDataPoints = prices.map((price) => {
      if (price < minBuyPrice || price > maxBuyPrice) {
        return null;
      }
      
      let maxCumulative = 0;
      for (let i = 0; i < buyPoints.length; i++) {
        if (buyPoints[i].price >= price) {
          maxCumulative = Math.max(maxCumulative, buyPoints[i].cumulative);
        }
      }
      
      return maxCumulative > 0 ? maxCumulative : null;
    });

    const sellDataPoints = prices.map((price) => {
      if (price < minSellPrice || price > maxSellPrice) {
        return null;
      }
      
      let maxCumulative = 0;
      for (let i = 0; i < sellPoints.length; i++) {
        if (sellPoints[i].price <= price) {
          maxCumulative = Math.max(maxCumulative, sellPoints[i].cumulative);
        }
      }
      
      return maxCumulative > 0 ? maxCumulative : null;
    });

    const buyPriceIndexes = buyPoints.map((p) => ({
      price: p.price,
      index: prices.findIndex((x) => Math.abs(x - p.price) < 0.0001),
    }));
    const sellPriceIndexes = sellPoints.map((p) => ({
      price: p.price,
      index: prices.findIndex((x) => Math.abs(x - p.price) < 0.0001),
    }));

    return {
      buyData: buyDataPoints,
      sellData: sellDataPoints,
      allPrices: prices,
      buyPriceIndexes,
      sellPriceIndexes,
    };
  }, [buyOrders, sellOrders]);

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
        labels: allPrices.map((price) => price.toFixed(2)),
        datasets: [
          {
            label: "Buy Orders",
            data: buyData,
            borderColor: "rgba(72, 187, 120, 1)",
            backgroundColor: "rgba(72, 187, 120, 0.5)",
            borderWidth: 2,
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
            backgroundColor: "rgba(244, 67, 54, 0.5)",
            borderWidth: 2,
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
            title: {
              display: true,
              text: "Price ($)",
              color: "rgba(255, 255, 255, 0.7)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              maxRotation: 0,
              minRotation: 0,
              maxTicksLimit: 10,
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          y: {
            title: {
              display: true,
              text: "Cumulative Quantity",
              color: "rgba(255, 255, 255, 0.7)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
          tooltip: {
            enabled: true,
            mode: "index",
            intersect: false,
            position: "nearest",
            callbacks: {
              label: function (context) {
                const hoveredPrice = parseFloat(context.label);

                const allIndexes = [
                  ...buyPriceIndexes,
                  ...sellPriceIndexes,
                ].filter((p) => p.index !== -1);

                if (allIndexes.length === 0) return "";

                let closest = allIndexes[0];
                let minDiff = Math.abs(hoveredPrice - closest.price);
                for (let i = 1; i < allIndexes.length; i++) {
                  const diff = Math.abs(hoveredPrice - allIndexes[i].price);
                  if (diff < minDiff) {
                    minDiff = diff;
                    closest = allIndexes[i];
                  }
                }

                const dataset = context.datasetIndex === 0 ? buyData : sellData;
                const value = dataset[closest.index];

                if (value == null) return "";

                const label = context.dataset.label || "";
                return `${label}: ${value.toLocaleString()}`;
              },
              title: function (tooltipItems) {
                if (!tooltipItems || !tooltipItems[0]) return "";
                const hoveredPrice = parseFloat(tooltipItems[0].label);

                const allIndexes = [
                  ...buyPriceIndexes,
                  ...sellPriceIndexes,
                ].filter((p) => p.index !== -1);

                if (allIndexes.length === 0) return "";

                const datasetIndex = tooltipItems[0].datasetIndex;
                const direction = datasetIndex === 1 ? "or lower" : "or higher";

                let closest = allIndexes[0];
                let minDiff = Math.abs(hoveredPrice - closest.price);
                for (let i = 1; i < allIndexes.length; i++) {
                  const diff = Math.abs(hoveredPrice - allIndexes[i].price);
                  if (diff < minDiff) {
                    minDiff = diff;
                    closest = allIndexes[i];
                  }
                }

                return `Price: $${closest.price.toFixed(2)} ${direction}`;
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
  }, [buyData, sellData, allPrices, buyPriceIndexes, sellPriceIndexes]);

  return (
    <div className={className}>
      <canvas ref={chartRef} />
    </div>
  );
}
