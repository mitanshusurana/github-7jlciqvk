import { AnyProduct } from '../types';
import { productService } from './productService';

export interface ReportData {
  totalSales: number;
  averageOrderValue: number;
  topSellingProducts: AnyProduct[];
}

class ReportService {
  async generateReport(startDate: Date, endDate: Date): Promise<ReportData> {
    const allProducts = await productService.getProducts();
    const productsInDateRange = allProducts.content.filter(product => {
      const productDate = new Date(product.createdAt);
      return productDate >= startDate && productDate <= endDate;
    });

    const totalSales = productsInDateRange.reduce((acc, product) => {
      return acc + (product.sellingPrice || 0);
    }, 0);

    const averageOrderValue = totalSales / productsInDateRange.length || 0;

    const topSellingProducts = [...productsInDateRange]
      .sort((a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0))
      .slice(0, 5);

    return {
      totalSales,
      averageOrderValue,
      topSellingProducts,
    };
  }
}

export const reportService = new ReportService();
