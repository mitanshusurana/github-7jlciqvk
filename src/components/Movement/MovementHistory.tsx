import React from 'react';
import { Movement } from '../../types';
import { format } from 'date-fns';

interface MovementHistoryProps {
  movements: Movement[];
}

const MovementHistory: React.FC<MovementHistoryProps> = ({ movements }) => {
  if (movements.length === 0) {
    return <p>No movement history for this product.</p>;
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">Date</th>
          <th className="text-left p-2">From</th>
          <th className="text-left p-2">To</th>
          <th className="text-left p-2">User</th>
        </tr>
      </thead>
      <tbody>
        {movements.map((movement) => (
          <tr key={movement.id} className="border-b">
            <td className="p-2">{format(new Date(movement.date), 'MMM d, yyyy')}</td>
            <td className="p-2">{movement.fromLocation}</td>
            <td className="p-2">{movement.toLocation}</td>
            <td className="p-2">{movement.userId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MovementHistory;
