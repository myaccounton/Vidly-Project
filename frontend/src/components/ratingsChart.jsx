import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from "recharts";

const RatingsChart = ({ movies }) => {
  if (!movies || movies.length === 0) return null;

  const TOP_COUNT = 5;

  const data = [...movies]
    .sort((a, b) => b.dailyRentalRate - a.dailyRentalRate)
    .slice(0, TOP_COUNT)
    .map(movie => ({
      name: movie.title,
      rating: movie.dailyRentalRate
    }));

  return (
    <div className="card shadow-sm mb-4">
     <div className="card-body">
      <h5 className="card-title mb-3">Top Priced Movies</h5>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            barSize={50}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis domain={[0, 10]} />
            <Tooltip formatter={value => [`Rating: ${value}`, ""]} />
            <Bar
              dataKey="rating"
              fill="#0d6efd"
              radius={[6, 6, 0, 0]}
            >
              <LabelList dataKey="rating" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RatingsChart;
