import React from 'react';
import { motion } from 'framer-motion';

interface RouteInfoProps {
  distance: number | null;
  duration: number | null;
  price: number | null;
}

const RouteInfo: React.FC<RouteInfoProps> = ({ distance, duration, price }) => {
  if (distance === null || duration === null || price === null) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 mt-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Informations sur l'itinéraire</h3>
      <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-3">
        <div className="p-3 text-center bg-gray-100 rounded-md dark:bg-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">Distance</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{(distance / 1000).toFixed(2)} km</p>
        </div>
        <div className="p-3 text-center bg-gray-100 rounded-md dark:bg-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">Durée</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{(duration / 60).toFixed(0)} min</p>
        </div>
        <div className="p-3 text-center bg-blue-100 rounded-md dark:bg-blue-900">
          <p className="text-sm text-blue-600 dark:text-blue-300">Prix Estimé</p>
          <p className="text-xl font-bold text-blue-800 dark:text-blue-200">{price.toLocaleString()} CFA</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RouteInfo;
