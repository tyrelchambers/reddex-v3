const proDevPlans = [
  "price_1NVdCwI8C7KcVoSyV9DX54pu",
  "price_1NVdCeI8C7KcVoSypm1bJDsd",
];

const proProdPlans = [
  "price_1NQejQI8C7KcVoSyAeORTi6T",
  "price_1KHc14I8C7KcVoSyCHwBi3aX",
  "price_1KHc14I8C7KcVoSyKOtuyz8F",
];

export const proPlans =
  process.env.NODE_ENV === "production" ? proProdPlans : proDevPlans;
