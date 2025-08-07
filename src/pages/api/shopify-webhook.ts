import { NextApiRequest, NextApiResponse } from 'next';
import { productService } from '../../services/productService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, title, body_html, vendor, product_type, variants } = req.body;

    const product = await productService.getProduct(variants[0].sku);

    if (product) {
      const updatedProduct = {
        ...product,
        name: title,
        description: body_html,
        supplier: vendor,
        productType: product_type,
        price: variants[0].price,
      };
      await productService.updateProduct(product.id, updatedProduct);
    }

    res.status(200).send('OK');
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
