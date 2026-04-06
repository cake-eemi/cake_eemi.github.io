/**
 * Google Forms Email Service
 *
 * HOW TO SET UP:
 * 1. Go to https://docs.google.com/forms and create a new form.
 * 2. Add fields matching the entry IDs below (or update the IDs after creating your fields).
 * 3. Get your Form ID from the URL: https://docs.google.com/forms/d/YOUR_FORM_ID/edit
 * 4. To find entry IDs: open the form, right-click > Inspect, fill a field, submit,
 *    and look at the network request for "entry.XXXXXXXX" parameters.
 *    OR: use the pre-fill URL method (Forms menu → Get pre-filled link).
 * 5. Replace GOOGLE_FORM_ID and entry IDs below.
 *
 * Suggested form fields:
 *  - Name              (Short answer)
 *  - Email             (Short answer)
 *  - Address           (Paragraph)
 *  - Product Type      (Short answer)  ← NEW
 *  - Order Date        (Short answer)  ← NEW
 *  - Cake Size         (Short answer)
 *  - Cake Base         (Short answer)
 *  - Filling           (Short answer)
 *  - Fruit             (Short answer)
 *  - Decoration Notes  (Paragraph)
 *  - Total Price (CHF) (Short answer)
 */

// ← Replace with your actual Google Form ID
const GOOGLE_FORM_ID = 'YOUR_GOOGLE_FORM_ID';

// ← Replace with your actual entry IDs from your Google Form
const ENTRY_IDS = {
  name:             'entry.1000000001',
  email:            'entry.1000000002',
  address:          'entry.1000000003',
  productType:      'entry.1000000010', // ← NEW
  orderDate:        'entry.1000000011', // ← NEW
  size:             'entry.1000000004',
  base:             'entry.1000000005',
  filling:          'entry.1000000006',
  fruit:            'entry.1000000007',
  decorationNotes:  'entry.1000000008',
  totalPrice:       'entry.1000000009',
};

export interface OrderSubmission {
  name: string;
  email: string;
  address: string;
  productType: string; // ← NEW
  orderDate: string;   // ← NEW
  size: string;
  base: string;
  filling: string;
  fruit: string;
  decorationNotes: string;
  totalPrice: number;
}

/**
 * Submits the order to Google Forms via a no-CORS fetch.
 * Google Forms doesn't return CORS headers, so we use "no-cors" mode —
 * we won't get a success response body, but the form submission will work.
 */
export async function submitOrderToGoogleForms(order: OrderSubmission): Promise<void> {
  const formUrl = `https://docs.google.com/forms/d/${GOOGLE_FORM_ID}/formResponse`;

  const body = new URLSearchParams({
    [ENTRY_IDS.name]:            order.name,
    [ENTRY_IDS.email]:           order.email,
    [ENTRY_IDS.address]:         order.address,
    [ENTRY_IDS.productType]:     order.productType,
    [ENTRY_IDS.orderDate]:       order.orderDate,
    [ENTRY_IDS.size]:            order.size,
    [ENTRY_IDS.base]:            order.base,
    [ENTRY_IDS.filling]:         order.filling,
    [ENTRY_IDS.fruit]:           order.fruit,
    [ENTRY_IDS.decorationNotes]: order.decorationNotes,
    [ENTRY_IDS.totalPrice]:      `CHF ${order.totalPrice}`,
  });

  await fetch(formUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  // With no-cors, we can't verify success — assume it worked if no exception thrown.
}