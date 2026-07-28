/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pozele vin direct din WordPress (domeniu configurabil prin env),
  // așa că nu trecem prin optimizatorul Next — se servesc ca atare.
  images: { unoptimized: true },
};

export default nextConfig;
