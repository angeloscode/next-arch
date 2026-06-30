import { ProductCard } from './ProductCard';

const items = [{ id: '1', title: 'Demo item' }];

export function ProductsList() {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <ProductCard title={item.title} />
        </li>
      ))}
    </ul>
  );
}
