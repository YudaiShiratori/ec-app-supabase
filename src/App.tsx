import React, { useState } from 'react';

const initialProducts = [
  { id: 1, name: 'Nintendo Switch 本体', price: 29980, image: '/api/placeholder/150/150?text=Switch', tags: ['本体', 'ゲーム機'], status: '販売中' },
  { id: 2, name: 'ゼルダの伝説', price: 6980, image: '/api/placeholder/150/150?text=Zelda', tags: ['新品', 'ゲームソフト'], status: '販売中' },
  { id: 3, name: 'マリオカート8', price: 5980, image: '/api/placeholder/150/150?text=Mario', tags: ['ゲームソフト'], status: '売り切れ' },
  { id: 4, name: 'Switch Lite', price: 19980, image: '/api/placeholder/150/150?text=SwitchLite', tags: ['本体', 'ゲーム機'], status: '販売中' },
  { id: 5, name: 'スプラトゥーン3', price: 5980, image: '/api/placeholder/150/150?text=Splatoon', tags: ['新品', 'ゲームソフト'], status: '販売中' },
];

function App() {
  const [products] = useState(initialProducts);
  const [filters, setFilters] = useState({
    excludeKeywords: '',
    category: 'すべて',
    priceMin: 0,
    priceMax: 100000,
    salesStatus: 'すべて'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('おすすめ順');
  const [currentView, setCurrentView] = useState('list');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    setSelectedTags([]);
    setFilters({
      excludeKeywords: '',
      category: 'すべて',
      priceMin: 0,
      priceMax: 100000,
      salesStatus: 'すべて'
    });
    setSearchQuery('');
    setSortOrder('おすすめ順');
  };

  const filteredProducts = products.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedTags.length > 0 && !selectedTags.every(tag => product.tags.includes(tag))) return false;
    if (filters.excludeKeywords && product.name.toLowerCase().includes(filters.excludeKeywords.toLowerCase())) return false;
    if (filters.category !== 'すべて' && !product.tags.includes(filters.category)) return false;
    if (product.price < filters.priceMin || product.price > filters.priceMax) return false;
    if (filters.salesStatus !== 'すべて' && product.status !== filters.salesStatus) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case '安い順': return a.price - b.price;
      case '高い順': return b.price - a.price;
      default: return 0;
    }
  });

  const ProductList = () => (
    <div style={{ width: '75%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {selectedTags.map((tag, index) => (
            <button key={index} onClick={() => toggleTag(tag)} style={{ backgroundColor: '#3B82F6', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
              {tag} ×
            </button>
          ))}
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #D1D5DB' }}
        >
          <option value="おすすめ順">おすすめ順</option>
          <option value="安い順">安い順</option>
          <option value="高い順">高い順</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {sortedProducts.map((product) => (
          <div key={product.id} onClick={() => { setCurrentView('detail'); setSelectedProductId(product.id); }} style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>{product.name}</h3>
              <p style={{ color: '#4B5563', marginBottom: '0.5rem' }}>¥{product.price.toLocaleString()}</p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{product.status}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
                {product.tags.map((tag, index) => (
                  <span key={index} style={{ backgroundColor: '#E5E7EB', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '9999px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {sortedProducts.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>該当する商品がありません。</p>
      )}
    </div>
  );

  const ProductDetail = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return <div>商品が見つかりません。</div>;

    return (
      <div style={{ width: '75%', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <button onClick={() => setCurrentView('list')} style={{ marginBottom: '1rem', backgroundColor: '#3B82F6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}>
          ← 戻る
        </button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{product.name}</h2>
        <img src={product.image} alt={product.name} style={{ width: '100%', maxWidth: '32rem', height: '16rem', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem' }} />
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>¥{product.price.toLocaleString()}</p>
        <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>{product.status}</p>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>商品タグ:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {product.tags.map((tag, index) => (
              <span key={index} style={{ backgroundColor: '#E5E7EB', fontSize: '0.875rem', padding: '0.25rem 0.5rem', borderRadius: '9999px' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#F3F4F6', minHeight: '100vh' }}>
      <header style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setCurrentView('list')}>EC App</h1>
          <input
            type="search"
            placeholder="商品を検索"
            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #D1D5DB' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem', display: 'flex' }}>
        <aside style={{ width: '25%', paddingRight: '1rem' }}>
          <button style={{ color: '#3B82F6', marginBottom: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }} onClick={clearAll}>クリア</button>
          <h2 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>絞り込み</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>販売状況</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {['すべて', '販売中', '売り切れ'].map(status => (
                <label key={status} style={{ display: 'inline-flex', alignItems: 'center', marginTop: '0.25rem' }}>
                  <input
                    type="radio"
                    style={{ marginRight: '0.5rem' }}
                    checked={filters.salesStatus === status}
                    onChange={() => handleFilterChange('salesStatus', status)}
                  />
                  <span style={{ color: '#4B5563' }}>{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>除外キーワード</h3>
            <input
              type="text"
              placeholder="~を含まない"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #D1D5DB' }}
              value={filters.excludeKeywords}
              onChange={(e) => handleFilterChange('excludeKeywords', e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>カテゴリー</h3>
            <select
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #D1D5DB' }}
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="すべて">すべて</option>
              <option value="本体">本体</option>
              <option value="ゲームソフト">ゲームソフト</option>
              <option value="周辺機器">周辺機器</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>価格</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                style={{ width: '50%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #D1D5DB' }}
                value={filters.priceMin === 0 ? '' : filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder="0"
              />
              <span>-</span>
              <input
                type="number"
                style={{ width: '50%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #D1D5DB' }}
                value={filters.priceMax === 100000 ? '' : filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value === '' ? 100000 : Number(e.target.value))}
                placeholder="100000"
              />
            </div>
          </div>
        </aside>

        {currentView === 'list' ? <ProductList /> : <ProductDetail />}
      </main>
    </div>
  );
}

export default App;