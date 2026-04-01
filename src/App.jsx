import { useState } from 'react';
import './App.css';

// 1. Оновлена база товарів (зміни посилання в `image`, якщо знайдеш кращі фото)
const PRODUCTS = [
  { id: 1, name: 'Еко-змішувач Grohe', desc: 'Знижує витрату води на 50% без втрати комфорту.', price: 3500, hasEco: true, category: 'faucet', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80', specs: ['Витрата води: 5 л/хв', 'Матеріал: Латунь', 'Покриття: Хром', 'Гарантія: 5 років'] },
  { id: 2, name: 'Душова система Hansgrohe', desc: 'Тропічний душ з термостатом (захист від опіків).', price: 8200, category: 'shower', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=400&q=80', specs: ['Діаметр лійки: 240 мм', 'Термостат: Є', 'Матеріал: Латунь/Пластик'] },
  // ОСЬ ТУТ МОЖЕШ ЗАМІНИТИ ПОСИЛАННЯ ДЛЯ БОЙЛЕРА (зараз стоїть заглушка placehold.co)
  { id: 3, name: 'Бойлер Bosch 80л', desc: 'Енергозберігаючий водонагрівач (сухий тен).', price: 9100, category: 'heater', image: 'https://vencon.ua/uploads/goods/132096/main/boyler-bosch-tronic-2000-t-es-080-5-2000w-bo-m1x-ktwvb.jpg', specs: ['Об\'єм: 80 літрів', 'Тип тена: Сухий', 'Потужність: 2000 Вт'] },
  { id: 4, name: 'Інсталяція Geberit Duofix', desc: 'Надійна система для підвісного унітазу (до 400 кг).', price: 7400, category: 'installation', image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=400&q=80', specs: ['Монтаж: У капітальну стіну', 'Макс. навантаження: 400 кг', 'Гарантія: 10 років'] },
  { id: 5, name: 'Раковина Villeroy & Boch', desc: 'Керамічна раковина з брудовідштовхувальним покриттям.', price: 4200, category: 'sink', image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=400&q=80', specs: ['Ширина: 60 см', 'Матеріал: Санітарна кераміка', 'Покриття: CeramicPlus'] },
  { id: 6, name: 'Ванна акрилова Ravak', desc: 'Асиметрична ванна, економить місце, довго тримає тепло.', price: 15600, category: 'bath', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=400&q=80', specs: ['Розмір: 160х95 см', 'Матеріал: Литий акрил', 'Об\'єм: 210 літрів'] },
  // ОСЬ ТУТ МОЖЕШ ЗАМІНИТИ ПОСИЛАННЯ ДЛЯ РУШНИКОСУШКИ
  { id: 7, name: 'Рушникосушка Mario', desc: 'Електрична рушникосушка з таймером.', price: 3800, category: 'accessories', image: 'https://vencon.ua/uploads/goods/147563/main/mario-klassik-900h530500.jpg', specs: ['Тип: Електрична', 'Матеріал: Нержавіюча сталь', 'Таймер: Є'] },
  { id: 8, name: 'Сифон для мийки Franke', desc: 'Простий в очищенні сифон.', price: 850, category: 'siphon', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80', specs: ['Діаметр випуску: 3.5 дюйма', 'Матеріал: Пластик', 'Перелив: Є'] },
  // ОСЬ ТУТ МОЖЕШ ЗАМІНИТИ ПОСИЛАННЯ ДЛЯ ФІЛЬТРА
  { id: 9, name: 'Фільтр осмосу Ecosoft', desc: 'Шестиступенева система очищення води.', price: 6500, hasEco: true, category: 'filter', image: 'https://romstal.ua/gallery/product/original/23550/23550.jpg', specs: ['Тип: Зворотний осмос', 'Кількість ступенів: 6', 'Накопичувальний бак: 7 літрів'] }
];

// База майстрів
const MASTERS = [
  { id: 1, name: 'Олександр Коваленко', exp: '12 років', orders: 1450, rating: '⭐️ 4.9', avatar: '👨🏻‍🔧' },
  { id: 2, name: 'Михайло Ткачук', exp: '8 років', orders: 920, rating: '⭐️ 4.8', avatar: '👨🏼‍🔧' },
  { id: 3, name: 'Сергій Мельник', exp: '5 років', orders: 540, rating: '⭐️ 4.7', avatar: '👨🏽‍🔧' }
];

function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Кошик та Замовлення
  const [cart, setCart] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  
  // Стейти Еко-калькулятора
  const [ecoFamilyMembers, setEcoFamilyMembers] = useState(2);
  const [ecoMinutes, setEcoMinutes] = useState(15);
  const [ecoSelectedProductId, setEcoSelectedProductId] = useState(1);

  // Стейти Конфігуратора
  const [configBaseItem, setConfigBaseItem] = useState(null);
  const [configCart, setConfigCart] = useState([]);

  // --- Надійне додавання в кошик ---
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    alert(`Товар "${product.name}" додано до кошика!`);
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartItemsCount = cart.reduce((count, item) => count + item.qty, 0);

  // --- Виправлене додавання в Конфігуратор ---
  const addToConfigCart = (product) => {
    setConfigCart((prevCart) => {
      // Перевіряємо, чи є вже цей товар у наборі
      const isAlreadyInCart = prevCart.find(item => item.id === product.id);
      if (!isAlreadyInCart) {
        return [...prevCart, product]; // Додаємо, якщо немає
      }
      return prevCart; // Нічого не змінюємо, якщо вже є
    });
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setShowSuccessModal(true);
    setCart([]); 
    setFormData({ name: '', phone: '', address: '' }); 
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setActiveTab('catalog');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedProduct(null);
  };

  const formatTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0 && mins > 0) return `${hours} год. ${mins} хв.`;
    if (hours > 0) return `${hours} год.`;
    return `${mins} хв.`;
  };

  const renderContent = () => {
    if (selectedProduct) {
      return (
        <div className="product-detail-page fade-in">
          <button className="btn-back" onClick={() => setSelectedProduct(null)}>← Повернутися</button>
          <div className="product-detail-card">
            <div className="detail-layout">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="detail-image" />
              <div className="detail-info">
                <h2>{selectedProduct.name}</h2>
                <p className="desc-large">{selectedProduct.desc}</p>
                <div className="specs-box">
                  <h4>Характеристики:</h4>
                  <ul>
                    {selectedProduct.specs?.map((spec, i) => <li key={i}>{spec}</li>)}
                  </ul>
                </div>
                <p className="price-large">{selectedProduct.price} ₴</p>
                <div className="detail-actions">
                  <button className="btn-primary" onClick={() => { addToCart(selectedProduct); setActiveTab('checkout'); setSelectedProduct(null); }}>
                    🛒 Придбати зараз
                  </button>
                  <button className="btn-secondary" onClick={() => addToCart(selectedProduct)}>
                    Додати в кошик
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'catalog':
        return (
          <div className="fade-in">
            <h2>Каталог товарів</h2>
            <div className="products-grid">
              {PRODUCTS.map((product) => (
                <div key={product.id} className={`product-card ${product.hasEco ? 'highlight' : ''}`}>
                  <img src={product.image} alt={product.name} className="product-image" />
                  <h3>{product.name}</h3>
                  <p className="desc">{product.desc}</p>
                  <p className="price">{product.price} ₴</p>
                  <div className="card-buttons">
                    <button className="btn-secondary" onClick={() => setSelectedProduct(product)}>Детальніше</button>
                    <button className="btn-primary mt-0" onClick={() => addToCart(product)}>В кошик</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cart':
      case 'checkout':
        return (
          <div className="checkout-page fade-in">
            <h2>{activeTab === 'cart' ? 'Ваш кошик' : 'Оформлення замовлення'}</h2>
            
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Ваш кошик порожній.</p>
                <button className="btn-primary" onClick={() => handleTabChange('catalog')}>Перейти до каталогу</button>
              </div>
            ) : (
              <div className="checkout-layout">
                <div className="cart-items-section">
                  <h3>Товари ({cartItemsCount} шт.)</h3>
                  <div className="cart-list">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.name} />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p>{item.price} ₴ x {item.qty} шт.</p>
                        </div>
                        <div className="item-total">
                          <strong>{item.price * item.qty} ₴</strong>
                          <button className="btn-remove" onClick={() => removeFromCart(item.id)}>❌</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="cart-summary">
                    <h3>Загалом до сплати: {cartTotal} ₴</h3>
                  </div>
                  {activeTab === 'cart' && (
                    <button className="btn-primary mt-2" onClick={() => setActiveTab('checkout')}>Перейти до оформлення</button>
                  )}
                </div>

                {activeTab === 'checkout' && (
                  <div className="checkout-form-section">
                    <h3>Ваші дані</h3>
                    <form onSubmit={handleOrderSubmit}>
                      <div className="form-group">
                        <label>ПІБ:</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Іванов Іван" />
                      </div>
                      <div className="form-group">
                        <label>Телефон:</label>
                        <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+38 (099) 000-00-00" />
                      </div>
                      <div className="form-group">
                        <label>Адреса доставки / об'єкту:</label>
                        <input type="text" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="м. Київ, вул. Хрещатик, 1" />
                      </div>
                      <button type="submit" className="btn-primary submit-btn">🚀 Підтвердити та відправити заявку</button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'eco':
        const selectedEcoProduct = PRODUCTS.find(p => p.id === ecoSelectedProductId);
        const waterSaved = ecoFamilyMembers * ecoMinutes * 5 * 365;
        const moneySaved = Math.round((waterSaved / 1000) * 40.5);

        return (
          <div className="info-page fade-in">
            <h2>🌱 Глобальний Еко-калькулятор</h2>
            <p className="subtitle">Розрахуйте вашу економію при переході на енерго- та водозберігаючу сантехніку.</p>
            
            <div className="eco-dashboard">
              <div className="eco-controls">
                <div className="calc-group">
                  <label>Оберіть еко-товар:</label>
                  <select value={ecoSelectedProductId} onChange={(e) => setEcoSelectedProductId(Number(e.target.value))}>
                    {PRODUCTS.filter(p => p.hasEco).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="calc-group slider-group">
                  <label>Членів сім'ї: <strong>{ecoFamilyMembers} чол.</strong></label>
                  <input type="range" min="1" max="10" value={ecoFamilyMembers} onChange={(e) => setEcoFamilyMembers(Number(e.target.value))} />
                </div>

                <div className="calc-group slider-group">
                  <label>Час використання (на особу в день): <strong>{formatTime(ecoMinutes)}</strong></label>
                  <input type="range" min="1" max="720" value={ecoMinutes} onChange={(e) => setEcoMinutes(Number(e.target.value))} />
                  <span className="slider-hint">від 1 хв до 12 годин</span>
                </div>
              </div>

              <div className="eco-results-panel">
                <h3>Річна економія:</h3>
                <div className="res-big blue">
                  <span>💧 Збережено води</span>
                  <strong>{waterSaved.toLocaleString('uk-UA')} л</strong>
                </div>
                <div className="res-big green">
                  <span>💰 Збережено коштів</span>
                  <strong>~ {moneySaved.toLocaleString('uk-UA')} ₴</strong>
                </div>
                <button 
                  className="btn-primary mt-2" 
                  onClick={() => setSelectedProduct(selectedEcoProduct)}
                >
                  Переглянути {selectedEcoProduct?.name}
                </button>
              </div>
            </div>
          </div>
        );

      case 'configurator':
        const configTotal = configCart.reduce((sum, item) => sum + item.price, 0);
        
        return (
          <div className="info-page fade-in">
            <h2>⚙️ Інтелектуальний конфігуратор сумісності</h2>
            <p>Оберіть основу, і система підбере гарантовано сумісні комплектуючі для монтажу.</p>
            
            <div className="config-selector">
              <h3>Крок 1: Що будемо облаштовувати?</h3>
              <div className="config-buttons">
                <button className={configBaseItem === 'sink' ? 'btn-primary' : 'btn-secondary'} onClick={() => { setConfigBaseItem('sink'); setConfigCart([PRODUCTS.find(p => p.id === 5)]); }}>
                  Раковину
                </button>
                <button className={configBaseItem === 'bath' ? 'btn-primary' : 'btn-secondary'} onClick={() => { setConfigBaseItem('bath'); setConfigCart([PRODUCTS.find(p => p.id === 6)]); }}>
                  Ванну
                </button>
              </div>
            </div>

            {configBaseItem && (
              <div className="config-results fade-in">
                <h3>Крок 2: Додайте сумісні комплектуючі</h3>
                <div className="products-grid">
                  {configBaseItem === 'sink' && (
                    <>
                      <div className="product-card mini">
                        <h4>Змішувач</h4>
                        <p>{PRODUCTS.find(p => p.id === 1).name}</p>
                        <p className="price-small">{PRODUCTS.find(p => p.id === 1).price} ₴</p>
                        <button className="btn-secondary" onClick={() => addToConfigCart(PRODUCTS.find(p => p.id === 1))}>+ Додати в комплект</button>
                      </div>
                      <div className="product-card mini">
                        <h4>Сифон</h4>
                        <p>{PRODUCTS.find(p => p.id === 8).name}</p>
                        <p className="price-small">{PRODUCTS.find(p => p.id === 8).price} ₴</p>
                        <button className="btn-secondary" onClick={() => addToConfigCart(PRODUCTS.find(p => p.id === 8))}>+ Додати в комплект</button>
                      </div>
                    </>
                  )}
                  {configBaseItem === 'bath' && (
                    <div className="product-card mini">
                      <h4>Душова система</h4>
                      <p>{PRODUCTS.find(p => p.id === 2).name}</p>
                      <p className="price-small">{PRODUCTS.find(p => p.id === 2).price} ₴</p>
                      <button className="btn-secondary" onClick={() => addToConfigCart(PRODUCTS.find(p => p.id === 2))}>+ Додати в комплект</button>
                    </div>
                  )}
                </div>

                <div className="config-cart">
                  <h3>Твій комплект:</h3>
                  {configCart.length === 0 ? <p>Комплект порожній</p> : (
                    <ul>
                      {configCart.map(item => (
                        <li key={item.id}>
                          <span>✔️ {item.name}</span> 
                          <div className="config-item-right">
                            <span>{item.price} ₴</span>
                            {item.category !== configBaseItem && (
                               <button className="btn-remove-small" onClick={() => setConfigCart(configCart.filter(i => i.id !== item.id))}>Видалити</button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="cart-total">Загальна сума: <strong>{configTotal} ₴</strong></div>
                  <button className="btn-primary mt-2" onClick={() => { 
                    configCart.forEach(item => addToCart(item)); 
                    setConfigCart([]);
                    setActiveTab('checkout'); 
                  }}>
                    🛒 Оформити цей комплект
                  </button>
                </div>
              </div>
            )}
            <div className="alert-box note mt-2">⚠️ <strong>Примітка:</strong> Інтелектуальний алгоритм підбору наразі в розробці.</div>
          </div>
        );

      case 'masters':
        return (
          <div className="info-page fade-in">
            <h2>👷‍♂️ Наші сертифіковані майстри</h2>
            <p>Усі фахівці AquaService проходять жорсткий відбір та тестування на реальних об'єктах.</p>
            <div className="masters-grid">
              {MASTERS.map(master => (
                <div key={master.id} className="master-card">
                  <div className="master-avatar">{master.avatar}</div>
                  <div className="master-info">
                    <h3>{master.name}</h3>
                    <p className="master-stat"><strong>Досвід:</strong> {master.exp}</p>
                    <p className="master-stat"><strong>Виконано замовлень:</strong> {master.orders}</p>
                    <p className="master-stat rating"><strong>Рейтинг:</strong> {master.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'ar':
        return (
          <div className="mockup-page fade-in">
            <div className="mockup-icon">📱</div>
            <h2>AR-примірка (Доповнена реальність)</h2>
            <div className="alert-box">⚠️ <strong>Функція в розробці.</strong> Реліз заплановано на наступний квартал.</div>
          </div>
        );
      case '3d':
        return (
          <div className="mockup-page fade-in">
            <div className="mockup-icon">🧊</div>
            <h2>3D-візуалізатор «Збери свою ванну»</h2>
            <div className="alert-box">⚠️ <strong>Функція в розробці.</strong> Доступ до бета-версії відкриється незабаром.</div>
          </div>
        );
      case 'about':
        return (
          <div className="info-page fade-in">
            <h2>Що таке «Єдина гарантія»?</h2>
            <p>Купуючи товар разом із нашим встановленням, ви отримуєте Єдину Гарантію. Якщо щось піде не так — ми самі приїдемо і все виправимо.</p>
            <h3 className="mt-2">Наші сертифікати якості</h3>
            <div className="certificates">
              <div className="certificate-card"><div className="cert-icon">📜</div><div className="cert-info"><h4>Ліцензія на монтажні роботи</h4><p>Дійсна до 2026 року.</p></div></div>
              <div className="certificate-card"><div className="cert-icon">🥇</div><div className="cert-info"><h4>ISO 9001:2015</h4><p>Міжнародний стандарт якості.</p></div></div>
            </div>
          </div>
        );
      case 'contacts':
        return (
          <div className="info-page fade-in">
            <h2>Зв'яжіться з нами</h2>
            <div className="contact-card">
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
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content fade-in">
            <div className="modal-icon">🎉</div>
            <h2>Дякуємо за замовлення!</h2>
            <p>{formData.name}, ваша заявка успішно оформлена.</p>
            <p>Наш менеджер зв'яжеться з вами за номером <strong>{formData.phone}</strong> найближчим часом для узгодження деталей та часу приїзду майстра.</p>
            <button className="btn-primary" onClick={closeModal}>Повернутися до магазину</button>
          </div>
        </div>
      )}

      <aside className="sidebar">
        <div className="logo">
          <h1>AquaService</h1>
          <span>маркетплейс сантехніки</span>
        </div>
        <nav className="nav-links">
          <button className={activeTab === 'catalog' ? 'active' : ''} onClick={() => handleTabChange('catalog')}>🛒 Каталог товарів</button>
          <button className={activeTab === 'cart' || activeTab === 'checkout' ? 'active cart-btn' : 'cart-btn'} onClick={() => handleTabChange('cart')}>
            🛍️ Кошик {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </button>
          <button className={activeTab === 'eco' ? 'active' : ''} onClick={() => handleTabChange('eco')}>🌱 Еко-калькулятор</button>
          <button className={activeTab === 'configurator' ? 'active' : ''} onClick={() => handleTabChange('configurator')}>⚙️ Конфігуратор</button>
          <button className={activeTab === 'masters' ? 'active' : ''} onClick={() => handleTabChange('masters')}>👷‍♂️ Наші майстри</button>
          <button className={activeTab === 'ar' ? 'active' : ''} onClick={() => handleTabChange('ar')}>📱 AR-примірка</button>
          <button className={activeTab === '3d' ? 'active' : ''} onClick={() => handleTabChange('3d')}>🧊 3D-візуалізатор</button>
          <button className={activeTab === 'about' ? 'active' : ''} onClick={() => handleTabChange('about')}>🛡️ Про гарантію</button>
          <button className={activeTab === 'contacts' ? 'active' : ''} onClick={() => handleTabChange('contacts')}>📞 Контакти</button>
        </nav>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
