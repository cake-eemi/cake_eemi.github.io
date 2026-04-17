import { useState } from 'react';
import {
  SIZES, BASES, FILLINGS, FRUITS,
  PRODUCT_TYPES, CUPCAKE_QUANTITIES, COOKIE_QUANTITIES,
  calculatePrice,
  type OrderConfig, type CakeSize, type CakeBase, type Fruit, type ProductType,
} from '../services/orderConfig';
import { submitOrderToGoogleForms } from '../services/googleForms';
import './Order.css';

// Steps: 0=Product, 1=Size/Qty, 2=Base (cake only), 3=Filling & Fruit (cake only), 4=Details, 5=Contact
const ALL_STEPS = ['Type', 'Quantity', 'Base', 'Filling & Fruit', 'Details', 'Contact'];

const emptyOrder: OrderConfig = {
  productType: null, size: null, base: null, filling: null, fruit: null,
  decorationNotes: '', orderDate: '', customerName: '', customerEmail: '', customerAddress: '',
};

export default function Order() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<OrderConfig>(emptyOrder);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const isCake = config.productType === 'cake';

  // Which steps are visible depends on product type
  const visibleSteps = config.productType === null || isCake
      ? ALL_STEPS
      : ALL_STEPS.filter(s => s !== 'Base' && s !== 'Filling & Fruit');

  const price = calculatePrice(config);

  const canProceed = (): boolean => {
    if (step === 0) return !!config.productType;
    if (step === 1) return !!config.size;
    if (isCake && step === 2) return !!config.base;
    if (isCake && step === 3) return !!config.filling && !!config.fruit;
    // Details step
    const detailsStep = isCake ? 4 : 2;
    if (step === detailsStep) return !!config.orderDate;
    // Contact step
    const contactStep = isCake ? 5 : 3;
    if (step === contactStep) return !!(config.customerName && config.customerEmail && config.customerAddress);
    return true;
  };

  const totalSteps = visibleSteps.length;
  const next = () => { if (canProceed()) setStep(s => Math.min(s + 1, totalSteps - 1)); };
  const back = () => setStep(s => Math.max(s - 1, 0));

  const handleProductChange = (pt: ProductType) => {
    setConfig({ ...emptyOrder, productType: pt });
    // reset step in case user goes back and changes type
  };

  const handleBaseChange = (base: CakeBase) => {
    setConfig(c => ({ ...c, base, filling: null, fruit: null }));
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    setStatus('sending');
    try {
      await submitOrderToGoogleForms({
        name:            config.customerName,
        email:           config.customerEmail,
        address:         config.customerAddress,
        productType:     config.productType ?? '',
        orderDate:       config.orderDate,
        size:            config.size ?? '',
        base:            config.base ?? '',
        filling:         config.filling ?? '',
        fruit:           config.fruit ?? '',
        decorationNotes: config.decorationNotes,
        totalPrice:      price,
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  // ── Sent state ────────────────────────────────
  if (status === 'sent') {
    return (
        <main className="order">
          <div className="order__sent fade-up">
            <div className="order__sent-icon">
              {config.productType === 'cookies' ? '🍪' : config.productType === 'cupcakes' ? '🧁' : '🎂'}
            </div>
            <h2 className="order__sent-title">Order received!</h2>
            <p className="order__sent-text">
              Thank you, <strong>{config.customerName}</strong>. I'll be in touch at{' '}
              <em>{config.customerEmail}</em> very soon to confirm your order for{' '}
              <strong>{config.orderDate}</strong>.
            </p>
            <button className="order__cta" onClick={() => { setConfig(emptyOrder); setStep(0); setStatus('idle'); }}>
              Place another order
            </button>
          </div>
        </main>
    );
  }

  // ── Labels for summary ────────────────────────
  const productLabel = PRODUCT_TYPES.find(p => p.id === config.productType)?.label;
  const sizeOptions  = config.productType === 'cupcakes' ? CUPCAKE_QUANTITIES
      : config.productType === 'cookies'  ? COOKIE_QUANTITIES
          : SIZES;
  const sizeLabel    = sizeOptions.find(s => s.id === config.size)?.label;
  const baseLabel    = BASES.find(b => b.id === config.base)?.label;
  const fillings     = config.base ? FILLINGS[config.base] : [];
  const fillingLabel = fillings.find(f => f.id === config.filling)?.label;
  const fruitLabel   = FRUITS.find(f => f.id === config.fruit)?.label;

  const detailsStep = isCake ? 4 : 2;
  const contactStep = isCake ? 5 : 3;

  return (
      <main className="order">
        {/* Page header */}
        <header className="order__header fade-up">
          <p className="order__header-label">Custom order</p>
          <h1 className="order__header-title">
            {config.productType ? `Design your ${productLabel?.toLowerCase()}` : 'Design your order'}
          </h1>
        </header>

        {/* Progress bar */}
        <div className="order__progress fade-up fade-up-delay-1">
          {visibleSteps.map((label, i) => (
              <div key={label} className={`order__progress-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                <div className="order__progress-dot">{i < step ? '✓' : i + 1}</div>
                <span className="order__progress-label">{label}</span>
                {i < visibleSteps.length - 1 && <div className="order__progress-line" />}
              </div>
          ))}
        </div>

        {/* Price display */}
        {price > 0 && (
            <div className="order__price-banner fade-up">
              Estimated price: <strong>CHF {price}</strong>
              {productLabel && <span> · {productLabel}</span>}
              {sizeLabel && <span> · {sizeLabel}</span>}
              {baseLabel && <span> · {baseLabel}</span>}
              {fillingLabel && <span> · {fillingLabel}</span>}
              {fruitLabel && config.fruit !== 'none' && <span> · {fruitLabel}</span>}
            </div>
        )}

        {/* Card */}
        <div className="order__card fade-up fade-up-delay-2">

          {/* STEP 0 — Product type */}
          {step === 0 && (
              <div className="order__step">
                <h2 className="order__step-title">What would you like?</h2>
                <p className="order__step-sub">Choose the type of treat you'd like to order.</p>
                <div className="order__base-grid">
                  {PRODUCT_TYPES.map(p => (
                      <button
                          key={p.id}
                          className={`order__base-card ${config.productType === p.id ? 'selected' : ''}`}
                          onClick={() => handleProductChange(p.id as ProductType)}
                      >
                        <span className="order__base-emoji">{p.emoji}</span>
                        <span className="order__base-name">{p.label}</span>
                        <span className="order__base-desc">{p.description}</span>
                      </button>
                  ))}
                </div>
              </div>
          )}

          {/* STEP 1 — Size / Quantity */}
          {step === 1 && (
              <div className="order__step">
                <h2 className="order__step-title">
                  {isCake ? 'Choose a size' : 'Choose a quantity'}
                </h2>
                <p className="order__step-sub">
                  {isCake ? 'How many guests are you celebrating with?' : 'How many would you like?'}
                </p>
                <div className="order__size-grid">
                  {sizeOptions.map(s => (
                      <button
                          key={s.id}
                          className={`order__size-card ${config.size === s.id ? 'selected' : ''}`}
                          onClick={() => setConfig(c => ({ ...c, size: s.id as CakeSize }))}
                      >
                        <span className="order__size-name">{s.label}</span>
                        <span className="order__size-serves">{'serves' in s ? s.serves : s.qty}</span>
                        <span className="order__size-price">CHF {s.basePrice}</span>
                      </button>
                  ))}
                </div>
              </div>
          )}

          {/* STEP 2 — Base (cake only) */}
          {isCake && step === 2 && (
              <div className="order__step">
                <h2 className="order__step-title">Choose a base</h2>
                <p className="order__step-sub">The foundation of your cake's flavour.</p>
                <div className="order__base-grid">
                  {BASES.map(b => (
                      <button
                          key={b.id}
                          className={`order__base-card ${config.base === b.id ? 'selected' : ''}`}
                          onClick={() => handleBaseChange(b.id as CakeBase)}
                      >
                        <span className="order__base-emoji">{b.emoji}</span>
                        <span className="order__base-name">{b.label}</span>
                        <span className="order__base-desc">{b.description}</span>
                      </button>
                  ))}
                </div>
              </div>
          )}

          {/* STEP 3 — Filling & Fruit (cake only) */}
          {isCake && step === 3 && config.base && (
              <div className="order__step">
                <h2 className="order__step-title">Filling & fruit</h2>
                <p className="order__step-sub">Customise the inside of your {baseLabel?.toLowerCase()} cake.</p>
                <div className="order__section">
                  <h3 className="order__section-label">Filling</h3>
                  <div className="order__option-grid">
                    {fillings.map(f => (
                        <button
                            key={f.id}
                            className={`order__option-btn ${config.filling === f.id ? 'selected' : ''}`}
                            onClick={() => setConfig(c => ({ ...c, filling: f.id }))}
                        >
                          <span>{f.label}</span>
                          {f.price > 0 && <span className="order__option-extra">+CHF {f.price}</span>}
                        </button>
                    ))}
                  </div>
                </div>
                <div className="order__section">
                  <h3 className="order__section-label">Fresh fruit topping</h3>
                  <div className="order__option-grid">
                    {FRUITS.map(f => (
                        <button
                            key={f.id}
                            className={`order__option-btn ${config.fruit === f.id ? 'selected' : ''}`}
                            onClick={() => setConfig(c => ({ ...c, fruit: f.id as Fruit }))}
                        >
                          <span>{f.label}</span>
                          {f.price > 0 && <span className="order__option-extra">+CHF {f.price}</span>}
                        </button>
                    ))}
                  </div>
                </div>
              </div>
          )}

          {/* STEP — Details (decorations + order date) */}
          {step === detailsStep && (
              <div className="order__step">
                <h2 className="order__step-title">Details</h2>
                <p className="order__step-sub">
                  When do you need your order, and any decoration wishes?
                </p>

                <div className="order__form" style={{ marginBottom: '1.5rem' }}>
                  <label className="order__label">
                    Desired order date <span className="order__label-required">*</span>
                    <input
                        className="order__input"
                        type="date"
                        value={config.orderDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setConfig(c => ({ ...c, orderDate: e.target.value }))}
                    />
                  </label>
                </div>

                <label className="order__label" style={{ marginBottom: '0.5rem' }}>
                  Decorations & special requests
                </label>
                <textarea
                    className="order__textarea"
                    rows={6}
                    placeholder="e.g. «Happy Birthday Clara» in pink, floral decoration, nut-free please…"
                    value={config.decorationNotes}
                    onChange={e => setConfig(c => ({ ...c, decorationNotes: e.target.value }))}
                />
              </div>
          )}

          {/* STEP — Contact */}
          {step === contactStep && (
              <div className="order__step">
                <h2 className="order__step-title">Your contact details</h2>
                <p className="order__step-sub">I'll reach out to confirm your order and arrange delivery.</p>

                <div className="order__form">
                  <label className="order__label">
                    Full name <span className="order__label-required">*</span>
                    <input
                        className="order__input"
                        type="text"
                        value={config.customerName}
                        onChange={e => setConfig(c => ({ ...c, customerName: e.target.value }))}
                        placeholder="Anna Müller"
                    />
                  </label>
                  <label className="order__label">
                    Email address <span className="order__label-required">*</span>
                    <input
                        className="order__input"
                        type="email"
                        value={config.customerEmail}
                        onChange={e => setConfig(c => ({ ...c, customerEmail: e.target.value }))}
                        placeholder="anna@example.com"
                    />
                  </label>
                  <label className="order__label">
                    Delivery address <span className="order__label-required">*</span>
                    <textarea
                        className="order__input order__input--textarea"
                        rows={3}
                        value={config.customerAddress}
                        onChange={e => setConfig(c => ({ ...c, customerAddress: e.target.value }))}
                        placeholder="Musterstrasse 12, 8001 Zürich"
                    />
                  </label>
                </div>

                {/* Summary */}
                <div className="order__summary">
                  <h4 className="order__summary-title">Order summary</h4>
                  <ul className="order__summary-list">
                    <li><span>Type</span><span>{productLabel}</span></li>
                    <li><span>Size</span><span>{sizeLabel}</span></li>
                    {baseLabel && <li><span>Base</span><span>{baseLabel}</span></li>}
                    {fillingLabel && <li><span>Filling</span><span>{fillingLabel}</span></li>}
                    {fruitLabel && config.fruit !== 'none' && <li><span>Fruit</span><span>{fruitLabel}</span></li>}
                    <li><span>Date</span><span>{config.orderDate}</span></li>
                    {config.decorationNotes && (
                        <li><span>Notes</span><span className="order__summary-notes">{config.decorationNotes}</span></li>
                    )}
                    <li className="order__summary-total"><span>Estimated total</span><strong>CHF {price}</strong></li>
                  </ul>
                </div>
              </div>
          )}

          {/* Navigation */}
          <div className="order__nav">
            {step > 0 && (
                <button className="order__nav-back" onClick={back}>← Back</button>
            )}
            <div style={{ flex: 1 }} />
            {step < totalSteps - 1 ? (
                <button
                    className={`order__cta ${!canProceed() ? 'disabled' : ''}`}
                    onClick={next}
                    disabled={!canProceed()}
                >
                  Continue →
                </button>
            ) : (
                <button
                    className={`order__cta order__cta--submit ${!canProceed() || status === 'sending' ? 'disabled' : ''}`}
                    onClick={handleSubmit}
                    disabled={!canProceed() || status === 'sending'}
                >
                  {status === 'sending' ? 'Sending…' : 'Place my order ✨'}
                </button>
            )}
          </div>

          {status === 'error' && (
              <p className="order__error">Something went wrong. Please try again or contact me directly.</p>
          )}
        </div>
      </main>
  );
}