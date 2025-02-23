/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        "upload.wikimedia.org", // For the Barcelona logo
        "store.fcbarcelona.com", // For the jersey image
        "thumblr.uniid.it", // For the scarf image
        "static.nike.com", // For the ball image
      ],
    },
  };
  
  export default nextConfig;