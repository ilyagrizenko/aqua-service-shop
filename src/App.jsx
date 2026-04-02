import { useState, useEffect } from 'react';
import './App.css';

const PRODUCTS = [
  { id: 1, name: 'Еко-змішувач Grohe', desc: 'Знижує витрату води на 50% без втрати комфорту.', price: 3500, hasEco: true, ecoRate: 5, category: 'faucet', rating: 4.8, reviews: 24, image: '/images/kran.png', specs: ['Витрата води: 5 л/хв', 'Матеріал: Латунь', 'Покриття: Хром', 'Гарантія: 5 років'] },
  { id: 2, name: 'Душова система Hansgrohe', desc: 'Тропічний душ з термостатом (захист від опіків).', price: 8200, category: 'shower', rating: 4.9, reviews: 15, image: 'https://hansgrohe.b-cdn.net/image/catalog/pics/154__hpa01750_tif.png', specs: ['Діаметр лійки: 240 мм', 'Термостат: Є', 'Матеріал: Латунь/Пластик'] },
  { id: 3, name: 'Бойлер Bosch 80л', desc: 'Енергозберігаючий водонагрівач (сухий тен).', price: 9100, category: 'heater', rating: 4.7, reviews: 89, image: '/images/boiler.png.png', specs: ['Об\'єм: 80 літрів', 'Тип тена: Сухий', 'Потужність: 2000 Вт'] },
  { id: 4, name: 'Інсталяція Geberit Duofix', desc: 'Надійна система для підвісного унітазу (до 400 кг).', price: 7400, category: 'installation', rating: 5.0, reviews: 42, image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=400&q=80', specs: ['Монтаж: У капітальну стіну', 'Макс. навантаження: 400 кг', 'Гарантія: 10 років'] },
  { id: 5, name: 'Раковина Villeroy & Boch', desc: 'Керамічна раковина з брудовідштовхувальним покриттям.', price: 4200, category: 'sink', rating: 4.6, reviews: 12, image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=400&q=80', specs: ['Ширина: 60 см', 'Матеріал: Санітарна кераміка', 'Покриття: CeramicPlus'] },
  { id: 6, name: 'Ванна акрилова Ravak', desc: 'Асиметрична ванна, економить місце, довго тримає тепло.', price: 15600, category: 'bath', rating: 4.9, reviews: 31, image: 'https://images.prom.ua/735070230_w1280_h640_735070230.jpg', specs: ['Розмір: 160х95 см', 'Матеріал: Литий акрил', 'Об\'єм: 210 літрів'] },
  { id: 7, name: 'Рушникосушка Mario', desc: 'Електрична рушникосушка з таймером.', price: 3800, category: 'accessories', rating: 4.5, reviews: 8, image: '/images/susjil.png', specs: ['Тип: Електрична', 'Матеріал: Нержавіюча сталь', 'Таймер: Є'] },
  { id: 8, name: 'Сифон для мийки Franke', desc: 'Простий в очищенні сифон.', price: 850, category: 'siphon', rating: 4.4, reviews: 56, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80', specs: ['Діаметр випуску: 3.5 дюйма', 'Матеріал: Пластик', 'Перелив: Є'] },
  { id: 9, name: 'Фільтр осмосу Ecosoft', desc: 'Шестиступенева система очищення води.', price: 6500, hasEco: true, ecoRate: 15, category: 'filter', rating: 4.9, reviews: 112, image: '/images/filtr.png', specs: ['Тип: Зворотний осмос', 'Кількість ступенів: 6', 'Накопичувальний бак: 7 літрів'] }
];

const MASTERS = [
  { id: 1, name: 'Олександр Коваленко', exp: '12 років', orders: 1450, rating: '⭐️ 4.9', avatar: '👨🏻‍🔧' },
  { id: 2, name: 'Михайло Ткачук', exp: '8 років', orders: 920, rating: '⭐️ 4.8', avatar: '👨🏼‍🔧' },
  { id: 3, name: 'Сергій Мельник', exp: '5 років', orders: 540, rating: '⭐️ 4.7', avatar: '👨🏽‍🔧' }
];

function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Темна тема (Зчитування з LocalStorage)
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('aquaTheme') === 'dark');

  // Фільтри та Сортування
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  
  // Кошик (Зчитування з LocalStorage)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('aquaCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  
  const [ecoFamilyMembers, setEcoFamilyMembers] = useState(2);
  const [ecoHours, setEcoHours] = useState(0);
  const [ecoMinutes, setEcoMinutes] = useState(15);
  const [ecoSelectedProductId, setEcoSelectedProductId] = useState(1);

  const [configBaseItem, setConfigBaseItem] = useState(null);
  const [configCart, setConfigCart] = useState([]);

  // --- Ефекти для збереження даних (LocalStorage) ---
  useEffect(() => {
    localStorage.setItem('aquaCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('aquaTheme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('aquaTheme', 'light');
    }
  }, [isDarkMode]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
    alert(`Товар додано в кошик!`);
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartItemsCount = cart.reduce((count, item) => count + item.qty, 0);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedProduct(null);
    setSearchQuery(''); 
  };

  const renderContent = () => {
    if (selectedProduct) {
      return (
        <div className="product-detail-page fade-in">
          <button className="btn-back" onClick={() => setSelectedProduct(null)}>← Повернутися</button>
          <div className="product-detail-card glass">
            <div className="detail-layout">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="detail-image" />
              <div className="detail-info">
                <h2>{selectedProduct.name}</h2>
                <div className="product-rating">
                  ⭐️ {selectedProduct.rating} <span>({selectedProduct.reviews} відгуків)</span>
                </div>
                <p className="desc-large">{selectedProduct.desc}</p>
                <div className="specs-box">
                  <h4>Характеристики:</h4>
                  <ul>{selectedProduct.specs?.map((spec, i) => <li key={i}>{spec}</li>)}</ul>
                </div>
                <p className="price-large">{selectedProduct.price} ₴</p>
                <div className="detail-actions">
                  <button className="btn-primary" onClick={() => { addToCart(selectedProduct); setActiveTab('checkout'); setSelectedProduct(null); }}>🛒 Купити зараз</button>
                  <button className="btn-secondary" onClick={() => addToCart(selectedProduct)}>В кошик</button>
                </div>
              </div>
            </div>
            
            <div className="reviews-section mt-2">
              <h3>Відгуки клієнтів</h3>
              <div className="review-card card-inner">
                  <strong>Іван М.</strong> <span className="stars">⭐️⭐️⭐️⭐️⭐️</span>
                  <p>Чудовий товар! Встановили швидко, все працює ідеально. Рекомендую AquaService.</p>
              </div>
              <div className="review-card card-inner">
                  <strong>Олена Т.</strong> <span className="stars">⭐️⭐️⭐️⭐️</span>
                  <p>Якість на висоті. Дуже зручно, що майстер відразу приїхав з товаром.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'catalog':
        let processedProducts = PRODUCTS.filter(product => 
          (product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.desc.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (filterCategory === 'all' || product.category === filterCategory)
        );

        if (sortBy === 'cheap') processedProducts.sort((a,b) => a.price - b.price);
        if (sortBy === 'expensive') processedProducts.sort((a,b) => b.price - a.price);
        if (sortBy === 'popular') processedProducts.sort((a,b) => b.rating - a.rating);

        return (
          <div className="fade-in">
            <div className="catalog-header glass">
              <h2>Каталог товарів</h2>
              
              <div className="filter-panel">
                <div className="search-bar">
                  <span className="search-icon">🔍</span>
                  <input type="text" placeholder="Пошук..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
                  <option value="all">Усі категорії</option>
                  <option value="faucet">Змішувачі</option>
                  <option value="bath">Ванни</option>
                  <option value="heater">Бойлери</option>
                  <option value="filter">Фільтри</option>
                </select>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                  <option value="default">За замовчуванням</option>
                  <option value="cheap">Від дешевих до дорогих</option>
                  <option value="expensive">Від дорогих до дешевих</option>
                  <option value="popular">За популярністю</option>
                </select>
              </div>
            </div>

            {processedProducts.length === 0 ? (
              <div className="empty-search glass">
                <p>За вашим запитом нічого не знайдено 😔</p>
                <button className="btn-secondary" onClick={() => {setSearchQuery(''); setFilterCategory('all');}}>Очистити фільтри</button>
              </div>
            ) : (
              <div className="products-grid">
                {processedProducts.map((product) => (
                  <div key={product.id} className={`product-card glass ${product.hasEco ? 'highlight' : ''}`}>
                    <img src={product.image} alt={product.name} className="product-image" />
                    <h3>{product.name}</h3>
                    <div className="product-rating-small">⭐️ {product.rating} <span>({product.reviews})</span></div>
                    <p className="desc">{product.desc}</p>
                    <p className="price">{product.price} ₴</p>
                    <div className="card-buttons">
                      <button className="btn-secondary" onClick={() => setSelectedProduct(product)}>Детальніше</button>
                      <button className="btn-primary mt-0" onClick={() => addToCart(product)}>В кошик</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'eco':
        const selectedEcoProduct = PRODUCTS.find(p => p.id === ecoSelectedProductId);
        const totalMinutesPerDay = (ecoHours * 60) + ecoMinutes;
        const waterSaved = ecoFamilyMembers * totalMinutesPerDay * (selectedEcoProduct.ecoRate || 5) * 365;
        const moneySaved = Math.round((waterSaved / 1000) * 40.5);

        return (
          <div className="info-page fade-in glass full-width">
            <h2>🌱 Еко-калькулятор заощаджень</h2>
            <div className="eco-dashboard">
              <div className="eco-controls card-inner">
                <div className="calc-group">
                  <label>Оберіть еко-товар:</label>
                  <select value={ecoSelectedProductId} onChange={(e) => setEcoSelectedProductId(Number(e.target.value))}>
                    {PRODUCTS.filter(p => p.hasEco).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="calc-group input-group">
                  <label>Членів сім'ї (чол.):</label>
                  <input type="number" min="1" max="20" value={ecoFamilyMembers} onChange={(e) => setEcoFamilyMembers(Number(e.target.value))} />
                </div>
                <div className="calc-group input-group-time">
                  <label>Час використання на день:</label>
                  <div className="time-inputs">
                    <div className="input-with-label">
                      <input type="number" min="0" max="23" value={ecoHours} onChange={(e) => setEcoHours(Math.min(23, Number(e.target.value)))} />
                      <span>год.</span>
                    </div>
                    <div className="input-with-label">
                      <input type="number" min="0" max="59" value={ecoMinutes} onChange={(e) => setEcoMinutes(Math.min(59, Number(e.target.value)))} />
                      <span>хв.</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="eco-results-panel">
                <h3>Результат за рік:</h3>
                <div className="res-big blue"><span className="res-label">💧 Води збережено:</span><span className="res-value">{waterSaved.toLocaleString('uk-UA')} л</span></div>
                <div className="res-big green"><span className="res-label">💰 Грошей заощаджено:</span><span className="res-value">~ {moneySaved.toLocaleString('uk-UA')} ₴</span></div>
              </div>
            </div>
          </div>
        );

      case 'configurator':
        const configTotal = configCart.reduce((sum, item) => sum + item.price, 0);
        const suggestedProducts = configBaseItem === 'sink' ? [1, 8] : [2];

        return (
          <div className="info-page fade-in glass full-width">
            <h2>⚙️ Інтелектуальний конфігуратор</h2>
            <div className="config-selector">
              <h3>Крок 1: Базовий елемент</h3>
              <div className="config-buttons">
                <button className={configBaseItem === 'sink' ? 'btn-primary' : 'btn-secondary'} onClick={() => { setConfigBaseItem('sink'); setConfigCart([PRODUCTS.find(p => p.id === 5)]); }}>🛁 Раковина</button>
                <button className={configBaseItem === 'bath' ? 'btn-primary' : 'btn-secondary'} onClick={() => { setConfigBaseItem('bath'); setConfigCart([PRODUCTS.find(p => p.id === 6)]); }}>🚿 Ванна</button>
              </div>
            </div>
            {configBaseItem && (
              <div className="config-main-layout">
                <div className="config-suggestions">
                    <h3>Крок 2: Сумісні модулі</h3>
                    <div className="products-grid-config">
                        {PRODUCTS.filter(p => suggestedProducts.includes(p.id)).map(p => (
                            <div key={p.id} className="product-card mini glass">
                                <img src={p.image} alt={p.name} className="mini-image" />
                                <h4>{p.name}</h4>
                                <p className="price-small">{p.price} ₴</p>
                                <button className="btn-secondary" onClick={() => {if(!configCart.find(i=>i.id===p.id)) setConfigCart([...configCart, p])}}>+ Додати</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="config-cart-summary card-inner">
                    <h3>Ваша збірка:</h3>
                    <ul className="config-list">
                        {configCart.map(item => (
                            <li key={item.id}><span>✅ {item.name}</span><b>{item.price} ₴</b>
                                {item.id !== 5 && item.id !== 6 && <button className="btn-text-red" onClick={() => setConfigCart(configCart.filter(i => i.id !== item.id))}>видалити</button>}
                            </li>
                        ))}
                    </ul>
                    <div className="config-total">Разом: <strong>{configTotal} ₴</strong></div>
                    <button className="btn-primary" onClick={() => {configCart.forEach(addToCart); setConfigCart([]); setActiveTab('checkout');}}>🛒 Оформити комплект</button>
                </div>
              </div>
            )}
          </div>
        );

      case 'cart':
      case 'checkout':
        return (
          <div className="checkout-page fade-in glass full-width">
            <h2>Оформлення замовлення</h2>
            {cart.length === 0 ? <p>Кошик порожній.</p> : (
              <div className="checkout-layout">
                <div className="cart-items-section card-inner">
                  <h3>Ваші товари:</h3>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details"><h4>{item.name}</h4><p>{item.price} ₴ x {item.qty}</p></div>
                      <button className="btn-remove" onClick={() => removeFromCart(item.id)}>🗑</button>
                    </div>
                  ))}
                  <div className="cart-summary">Разом: <strong>{cartTotal} ₴</strong></div>
                </div>
                <div className="checkout-form-section">
                  <form onSubmit={(e) => { e.preventDefault(); setShowSuccessModal(true); setCart([]); setFormData({ name: '', phone: '', address: '' }); }}>
                    <input type="text" required placeholder="Ваше Ім'я" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input type="tel" required placeholder="Телефон" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    <input type="text" required placeholder="Адреса" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    <button type="submit" className="btn-primary">🚀 Відправити заявку</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        );

      case 'masters':
        return (
          <div className="info-page fade-in glass full-width">
            <h2>👷‍♂️ Наші сертифіковані майстри</h2>
            <div className="masters-grid">
              {MASTERS.map(m => (
                <div key={m.id} className="master-card glass">
                  <div className="master-avatar">{m.avatar}</div>
                  <h3>{m.name}</h3>
                  <p>Досвід: {m.exp}</p>
                  <p>Замовлень: {m.orders}</p>
                  <p className="product-rating-small" style={{fontSize: "18px", marginTop: "10px"}}>⭐️ {m.rating.replace('⭐️ ', '')}</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'ar':
        return (
          <div className="info-page fade-in glass full-width" style={{textAlign: "center", padding: "80px 40px"}}>
            <div style={{fontSize: "70px", marginBottom: "20px"}}>📱</div>
            <h2>AR-примірка (Доповнена реальність)</h2>
            <p>Функція в розробці. Реліз заплановано на наступний квартал.</p>
          </div>
        );

      case '3d':
        return (
          <div className="info-page fade-in glass full-width" style={{textAlign: "center", padding: "80px 40px"}}>
            <div style={{fontSize: "70px", marginBottom: "20px"}}>🧊</div>
            <h2>3D-візуалізатор «Збери свою ванну»</h2>
            <p>Функція в розробці. Доступ до бета-версії відкриється незабаром.</p>
          </div>
        );

      case 'about':
        return (
          <div className="info-page fade-in glass full-width">
            <h2>🛡️ Система «Єдина гарантія»</h2>
            <p>Купуючи товар разом із нашим встановленням, ви отримуєте повний захист. Якщо щось піде не так — ми самі приїдемо і все виправимо.</p>
            <div className="certs-container">
                <div className="cert-card card-inner">
                    <span className="cert-icon">📜</span>
                    <div className="cert-text">
                        <h4>Ліцензія №2940-А</h4>
                        <p>На проведення монтажних робіт. Дійсна до 2026 р.</p>
                    </div>
                </div>
                <div className="cert-card card-inner">
                    <span className="cert-icon">🥇</span>
                    <div className="cert-text">
                        <h4>ISO 9001:2015</h4>
                        <p>Міжнародний стандарт якості обслуговування.</p>
                    </div>
                </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="info-page fade-in glass full-width">
            <h2>📞 Контакти</h2>
            <div className="contact-card card-inner" style={{borderLeft: "5px solid #0284c7"}}>
              <p><strong>Менеджер проекту:</strong> Ілля Гриценко</p>
              <p><strong>Телефон:</strong> +38 (099) 123-45-67</p>
              <p><strong>Email:</strong> i.hrytsenko_femp_11_22_b_d@knute.edu.ua</p>
              <p><strong>Адреса:</strong> м. Київ, вул. Кіото, 19 (ДТЕУ)</p>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="app-layout">
      {/* Виправлено модальне вікно (z-index) */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content glass fade-in">
            <h2>🎉 Заявку відправлено!</h2>
            <p>Ми зв'яжемось з вами найближчим часом.</p>
            <button className="btn-primary" onClick={() => {setShowSuccessModal(false); setActiveTab('catalog')}}>Ок</button>
          </div>
        </div>
      )}
      
      <aside className="sidebar glass">
        <div className="logo"><h1>AquaService</h1></div>
        <nav className="nav-links">
          <button className={activeTab === 'catalog' ? 'active' : ''} onClick={() => handleTabChange('catalog')}>🛒 Каталог</button>
          <button className={activeTab === 'cart' || activeTab === 'checkout' ? 'active' : ''} onClick={() => handleTabChange('cart')}>🛍 Кошик {cartItemsCount > 0 && <span className="badge-red">{cartItemsCount}</span>}</button>
          <button className={activeTab === 'eco' ? 'active' : ''} onClick={() => handleTabChange('eco')}>🌱 Еко-кальк</button>
          <button className={activeTab === 'configurator' ? 'active' : ''} onClick={() => handleTabChange('configurator')}>⚙️ Конфігуратор</button>
          {/* Повернув відсутні пункти */}
          <button className={activeTab === 'masters' ? 'active' : ''} onClick={() => handleTabChange('masters')}>👷‍♂️ Майстри</button>
          <button className={activeTab === 'ar' ? 'active' : ''} onClick={() => handleTabChange('ar')}>📱 AR-примірка</button>
          <button className={activeTab === '3d' ? 'active' : ''} onClick={() => handleTabChange('3d')}>🧊 3D-візуал.</button>
          <button className={activeTab === 'about' ? 'active' : ''} onClick={() => handleTabChange('about')}>🛡 Гарантія</button>
          <button className={activeTab === 'contacts' ? 'active' : ''} onClick={() => handleTabChange('contacts')}>📞 Контакти</button>
        </nav>
        
        <div className="theme-toggle" style={{marginTop: "20px"}}>
            <button className="btn-secondary" onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? '☀️ Світла тема' : '🌙 Темна тема'}
            </button>
        </div>
      </aside>
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;