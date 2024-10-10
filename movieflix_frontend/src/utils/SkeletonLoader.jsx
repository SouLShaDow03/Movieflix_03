import React from "react";

const SkeletonLoader = ({ height, width }) => {
  // Determine if height and width are valid numbers
  const isHeightValid = height && !isNaN(height);
  const isWidthValid = width && !isNaN(width);

  // Compute dynamic styles
  const dynamicHeight = isHeightValid ? `${height}vh` : "100%";
  const dynamicWidth = isWidthValid ? `${width}vw` : "100%";

  return (
    <div
      className="flex-shrink-0 animate-pulse overflow-hidden rounded-2xl bg-gray-800"
      style={{ height: dynamicHeight, width: dynamicWidth }}
    ></div>
  );
};

export default SkeletonLoader;
