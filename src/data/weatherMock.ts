import sunnyIcon from "../../starter-files/assets/images/icon-sunny.webp";
import partlyCloudyIcon from "../../starter-files/assets/images/icon-partly-cloudy.webp";
import rainIcon from "../../starter-files/assets/images/icon-rain.webp";
import drizzleIcon from "../../starter-files/assets/images/icon-drizzle.webp";
import stormIcon from "../../starter-files/assets/images/icon-storm.webp";
import fogIcon from "../../starter-files/assets/images/icon-fog.webp";
import bgTodayLarge from "../../starter-files/assets/images/bg-today-large.svg";

export type UnitSystem = "metric" | "imperial";

export type ForecastDay = {
  id: string;
  day: string;
  icon: string;
  condition: string;
  high: number;
  low: number;
};

export type HourlyEntry = {
  time: string;
  icon: string;
  condition: string;
  temperature: number;
};

export const currentWeatherCard = {
  backgroundImage: bgTodayLarge,
  city: "Berlin, Germany",
  dateLabel: "Tuesday, Aug 5, 2025",
  icon: sunnyIcon,
};

export const forecastDays: ForecastDay[] = [
  {
    id: "tue",
    day: "Tue",
    icon: drizzleIcon,
    condition: "Drizzle",
    high: 20,
    low: 14,
  },
  {
    id: "wed",
    day: "Wed",
    icon: rainIcon,
    condition: "Rain",
    high: 21,
    low: 15,
  },
  {
    id: "thu",
    day: "Thu",
    icon: sunnyIcon,
    condition: "Sunny",
    high: 24,
    low: 14,
  },
  {
    id: "fri",
    day: "Fri",
    icon: partlyCloudyIcon,
    condition: "Partly cloudy",
    high: 25,
    low: 13,
  },
  {
    id: "sat",
    day: "Sat",
    icon: stormIcon,
    condition: "Storm",
    high: 21,
    low: 15,
  },
  {
    id: "sun",
    day: "Sun",
    icon: rainIcon,
    condition: "Snow",
    high: 25,
    low: 16,
  },
  { id: "mon", day: "Mon", icon: fogIcon, condition: "Fog", high: 24, low: 15 },
];

export const hourlyByDay: Record<string, HourlyEntry[]> = {
  tue: [
    {
      time: "3 PM",
      icon: partlyCloudyIcon,
      condition: "Cloudy",
      temperature: 20,
    },
    {
      time: "4 PM",
      icon: partlyCloudyIcon,
      condition: "Partly cloudy",
      temperature: 20,
    },
    { time: "5 PM", icon: sunnyIcon, condition: "Sunny", temperature: 20 },
    {
      time: "6 PM",
      icon: partlyCloudyIcon,
      condition: "Cloudy",
      temperature: 19,
    },
    { time: "7 PM", icon: rainIcon, condition: "Rain", temperature: 18 },
    { time: "8 PM", icon: fogIcon, condition: "Fog", temperature: 18 },
    { time: "9 PM", icon: rainIcon, condition: "Rain", temperature: 17 },
    {
      time: "10 PM",
      icon: partlyCloudyIcon,
      condition: "Cloudy",
      temperature: 17,
    },
  ],
  wed: [
    { time: "3 PM", icon: rainIcon, condition: "Rain", temperature: 21 },
    { time: "4 PM", icon: rainIcon, condition: "Rain", temperature: 20 },
    { time: "5 PM", icon: drizzleIcon, condition: "Drizzle", temperature: 19 },
    { time: "6 PM", icon: drizzleIcon, condition: "Drizzle", temperature: 18 },
    {
      time: "7 PM",
      icon: partlyCloudyIcon,
      condition: "Cloud breaks",
      temperature: 17,
    },
    { time: "8 PM", icon: fogIcon, condition: "Fog", temperature: 17 },
    {
      time: "9 PM",
      icon: partlyCloudyIcon,
      condition: "Cloudy",
      temperature: 16,
    },
    { time: "10 PM", icon: rainIcon, condition: "Shower", temperature: 15 },
  ],
  thu: [
    { time: "3 PM", icon: sunnyIcon, condition: "Sunny", temperature: 24 },
    { time: "4 PM", icon: sunnyIcon, condition: "Sunny", temperature: 23 },
    { time: "5 PM", icon: sunnyIcon, condition: "Sunny", temperature: 22 },
    {
      time: "6 PM",
      icon: partlyCloudyIcon,
      condition: "Partly cloudy",
      temperature: 21,
    },
    {
      time: "7 PM",
      icon: partlyCloudyIcon,
      condition: "Partly cloudy",
      temperature: 19,
    },
    { time: "8 PM", icon: fogIcon, condition: "Fog", temperature: 18 },
    {
      time: "9 PM",
      icon: partlyCloudyIcon,
      condition: "Cloudy",
      temperature: 17,
    },
    {
      time: "10 PM",
      icon: partlyCloudyIcon,
      condition: "Cloudy",
      temperature: 16,
    },
  ],
  fri: [
    {
      time: "3 PM",
      icon: partlyCloudyIcon,
      condition: "Partly cloudy",
      temperature: 25,
    },
    {
      time: "4 PM",
      icon: partlyCloudyIcon,
      condition: "Partly cloudy",
      temperature: 24,
    },
    { time: "5 PM", icon: sunnyIcon, condition: "Sunny", temperature: 22 },
    { time: "6 PM", icon: sunnyIcon, condition: "Sunny", temperature: 21 },
    {
      time: "7 PM",
      icon: partlyCloudyIcon,
      condition: "Cloudy",
      temperature: 19,
    },
    { time: "8 PM", icon: fogIcon, condition: "Fog", temperature: 18 },
    { time: "9 PM", icon: rainIcon, condition: "Light rain", temperature: 16 },
    { time: "10 PM", icon: rainIcon, condition: "Shower", temperature: 15 },
  ],
  sat: [
    { time: "3 PM", icon: stormIcon, condition: "Storm", temperature: 21 },
    { time: "4 PM", icon: stormIcon, condition: "Storm", temperature: 20 },
    { time: "5 PM", icon: rainIcon, condition: "Rain", temperature: 19 },
    { time: "6 PM", icon: rainIcon, condition: "Rain", temperature: 18 },
    { time: "7 PM", icon: drizzleIcon, condition: "Drizzle", temperature: 17 },
    { time: "8 PM", icon: fogIcon, condition: "Fog", temperature: 16 },
    {
      time: "9 PM",
      icon: partlyCloudyIcon,
      condition: "Clearing",
      temperature: 15,
    },
    {
      time: "10 PM",
      icon: partlyCloudyIcon,
      condition: "Cloudy",
      temperature: 15,
    },
  ],
  sun: [
    { time: "3 PM", icon: rainIcon, condition: "Snow", temperature: 25 },
    { time: "4 PM", icon: rainIcon, condition: "Snow", temperature: 23 },
    {
      time: "5 PM",
      icon: drizzleIcon,
      condition: "Wintry mix",
      temperature: 21,
    },
    {
      time: "6 PM",
      icon: partlyCloudyIcon,
      condition: "Cloudy",
      temperature: 20,
    },
    { time: "7 PM", icon: fogIcon, condition: "Fog", temperature: 18 },
    { time: "8 PM", icon: fogIcon, condition: "Fog", temperature: 17 },
    {
      time: "9 PM",
      icon: partlyCloudyIcon,
      condition: "Cloudy",
      temperature: 17,
    },
    {
      time: "10 PM",
      icon: partlyCloudyIcon,
      condition: "Cloudy",
      temperature: 16,
    },
  ],
  mon: [
    { time: "3 PM", icon: fogIcon, condition: "Fog", temperature: 24 },
    { time: "4 PM", icon: fogIcon, condition: "Fog", temperature: 22 },
    {
      time: "5 PM",
      icon: partlyCloudyIcon,
      condition: "Cloud breaks",
      temperature: 21,
    },
    {
      time: "6 PM",
      icon: partlyCloudyIcon,
      condition: "Cloudy",
      temperature: 20,
    },
    { time: "7 PM", icon: rainIcon, condition: "Rain", temperature: 19 },
    { time: "8 PM", icon: rainIcon, condition: "Rain", temperature: 18 },
    { time: "9 PM", icon: fogIcon, condition: "Fog", temperature: 17 },
    { time: "10 PM", icon: fogIcon, condition: "Fog", temperature: 17 },
  ],
};
