import ReactGA from "react-ga4";

const MEASUREMENT_ID = "G-91EW17BHRG"; // Replace with your actual GA4 Measurement ID

export const initializeAnalytics = () => {
  ReactGA.initialize(MEASUREMENT_ID);
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const trackEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
