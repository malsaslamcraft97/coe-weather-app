module.exports = {
  standard: "WCAG2AA",
  timeout: 30000,
  wait: 1000,
  chromeLaunchConfig: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
};
