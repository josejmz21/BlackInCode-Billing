import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, Tag, DollarSign, Layers, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export default function Products() {
  const [searchQuery, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Premium Cloud SaaS Subscription', price: 299.00, stock: 124, sku: 'SKU-SaaS-PREM', status: 'In Stock' },
    { id: '2', name: 'Corporate Billing Integration API Pack', price: 149.00, stock: 12, sku: 'SKU-API-CORP', status: 'Low Stock' },
    { id: '3', name: 'Dedicated Dedicated Proxy Server License', price: 49.00, stock: 85, sku: 'SKU-SRV-PROXY', status: 'In Stock' },
    { id: '4', name: 'Automated Tax Reporting Plugin', price: 99.00, stock: 0, sku: 'SKU-TAX-REPRT', status: 'Out of Stock' },
    { id: '5', name: 'Custom Developer Support Hours (10h)', price: 799.00, stock: 350, sku: 'SKU-DEV-HOUR', status: 'In Stock' },
  ]);

  // Form states for new product
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodSku, setProdSku] = useState('');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock) return;

    const stockNum = parseInt(prodStock);
    let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (stockNum === 0) status = 'Out of Stock';
    else if (stockNum <= 15) status = 'Low Stock';

    const newProduct: Product = {
      id: (products.length + 1).toString(),
      name: prodName,
      price: parseFloat(prodPrice),
      stock: stockNum,
      sku: prodSku.toUpperCase() || `SKU-PROD-${products.length + 100}`,
      status,
    };

    setProducts([newProduct, ...products]);
    setProdName('');
    setProdPrice('');
    setProdStock('');
    setProdSku('');
    setShowAddModal(false);
  };

  const filteredProducts = products.filter((product) => {
    const term = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term)
    );
  });

  const getStockIndicator = (status: 'In Stock' | 'Low Stock' | 'Out of Stock', stock: number) => {
    switch (status) {
      case 'In Stock':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-500 bg-green-500/10 px-2.5 py-0.5 rounded-full border border-green-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {stock} units
          </span>
        );
      case 'Low Stock':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-2.5 py-0.5 rounded-full border border-yellow-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            {stock} left (Low)
          </span>
        );
      case 'Out of Stock':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Out of Stock
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground text-sm">Manage inventory catalog, services pricing, and stock metrics.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by product name or SKU..."
          className="pl-10 bg-card"
          value={searchQuery}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card border rounded-lg">
            No products match your search. Add a new catalog item or retry.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="bg-card border hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
              <CardHeader className="pb-3 border-b bg-muted/10">
                <div className="flex justify-between items-start gap-4">
                  <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase border">
                    {product.sku}
                  </span>
                  {getStockIndicator(product.status, product.stock)}
                </div>
                <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span>Unit Price</span>
                  </div>
                  <div className="text-2xl font-black text-foreground">
                    ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t bg-muted/5 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-primary/70" /> Professional Service
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-primary/70" /> Cat. #{product.id}
                </span>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md bg-card border shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="border-b">
              <CardTitle>Add Catalog Product</CardTitle>
              <CardDescription>Register products or digital services to catalog list.</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddProduct}>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prodName">Product Name</Label>
                  <Input
                    id="prodName"
                    placeholder="e.g. Corporate License"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="prodPrice">Price ($ MXN)</Label>
                    <Input
                      id="prodPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="prodStock">Initial Stock</Label>
                    <Input
                      id="prodStock"
                      type="number"
                      placeholder="e.g. 100"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="prodSku">SKU (Stock Keeping Unit)</Label>
                  <Input
                    id="prodSku"
                    placeholder="e.g. SKU-API-CORP"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                  />
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/20">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Product</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
