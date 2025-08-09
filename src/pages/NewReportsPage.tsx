import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { reportService, ReportData } from '../services/reportService';
import { formatCurrency } from '../utils/formatters';
import { AnyProduct } from '../types';
import Papa from 'papaparse';

const NewReportsPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    const data = await reportService.generateReport(startDate, endDate);
    setReportData(data);
    setLoading(false);
  };

  const handleExport = () => {
    if (!reportData) return;

    const csvData = reportData.topSellingProducts.map(product => ({
      ID: product.id,
      Name: product.name,
      Price: product.sellingPrice,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-neutral-900">Advanced Reports</h1>
      <p className="mt-1 text-neutral-500">
        Generate custom reports to gain insights into your inventory.
      </p>

      <div className="mt-6 flex items-center space-x-4">
        <div>
          <label htmlFor="startDate" className="form-label">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="form-label">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="form-input"
          />
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {reportData && (
        <div className="mt-8">
          <div className="flex justify-end">
            <button onClick={handleExport} className="btn-outline">
              Export CSV
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-neutral-900">Total Sales</h3>
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(reportData.totalSales)}</p>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-neutral-900">Average Order Value</h3>
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(reportData.averageOrderValue)}</p>
            </div>
          </div>

          <div className="card mt-8">
            <h3 className="text-xl font-semibold text-neutral-900 p-6">Top Selling Products</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Product</th>
                  <th className="text-right p-4">Price</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topSellingProducts.map((product: AnyProduct) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-4">{product.name}</td>
                    <td className="text-right p-4">{formatCurrency(product.sellingPrice || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewReportsPage;
