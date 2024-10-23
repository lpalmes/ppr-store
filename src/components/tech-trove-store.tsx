import { ShoppingCart, Menu, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { setTimeout } from "timers/promises";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

async function fetchProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  const json: Array<Product> = await res.json();

  return json;
}

export async function TechTroveStore() {
  const products = await fetchProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Menu className="h-6 w-6 mr-4 cursor-pointer md:hidden" />
            <h1 className="text-2xl font-bold">TechTrove</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  Categories <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Smartphones</DropdownMenuItem>
                <DropdownMenuItem>Laptops</DropdownMenuItem>
                <DropdownMenuItem>Audio</DropdownMenuItem>
                <DropdownMenuItem>TVs</DropdownMenuItem>
                <DropdownMenuItem>Gaming</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              type="search"
              placeholder="Search products..."
              className="w-64"
            />
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <Suspense
                  fallback={<p className="text-muted-foreground">Loading</p>}
                >
                  <ProductPrice product={product} />
                </Suspense>
                <Button className="w-full mt-4">Add to Cart</Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-muted mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About TechTrove</h3>
              <p className="text-muted-foreground">
                We offer the latest and greatest in consumer electronics at
                competitive prices.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest deals and updates.
              </p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none"
                />
                <Button className="rounded-l-none">Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            © 2023 TechTrove. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

async function ProductPrice(props: { product: Product }) {
  const { product } = props;
  const cookieStore = await cookies();
  const discount = parseInt(cookieStore.get("discount")?.value ?? "0");

  await setTimeout(2000);

  if (discount > 0) {
    const discountPrice = percentage(discount, product.price);

    return (
      <div className="flex flex-row gap-2">
        <p className="bg-yellow-500 rounded-full px-2 py-1">-%{discount}</p>
        <p className="text-muted-foreground">
          {(product.price - discountPrice).toPrecision(2)}
        </p>
      </div>
    );
  }
  return <p className="text-muted-foreground">{product.price}</p>;
}

function percentage(partialValue: number, totalValue: number) {
  return Math.floor((100 * partialValue) / totalValue);
}
