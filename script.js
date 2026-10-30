
/* =========================
   SCENTIFY PERFUME SHOP
   JAVASCRIPT SYSTEM
========================= */


/* =========================
   1. DARK MODE / LIGHT MODE
========================= */

function applyTheme(theme) {

    const isDark = theme === 'dark';

    document.documentElement.classList.toggle('dark', isDark);

    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');
    const button = document.getElementById('themeToggle');

    if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
    }

    if (label) {
        label.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }

    if (button) {
        button.setAttribute(
            'aria-label',
            isDark ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }
}

function toggleTheme() {

    const currentTheme =
        document.documentElement.classList.contains('dark')
            ? 'dark'
            : 'light';

    const nextTheme =
        currentTheme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('scentify-theme', nextTheme);

    applyTheme(nextTheme);
}


/* =========================
   2. SAMPLE DATA
========================= */

let products = JSON.parse(localStorage.getItem('products')) || [

    {
        name: 'Sweet Vanilla',
        category: 'Sweet',
        size: '30ml',
        price: 90,
        stock: 20
    },

    {
        name: 'Floral Bloom',
        category: 'Floral',
        size: '30ml',
        price: 80,
        stock: 15
    },

    {
        name: 'Ocean Breeze',
        category: 'Fresh',
        size: '50ml',
        price: 150,
        stock: 10
    }

];

let customers = JSON.parse(localStorage.getItem('customers')) || [];

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];


/* =========================
   3. SAVE DATA
========================= */

function saveData() {

    localStorage.setItem(
        'products',
        JSON.stringify(products)
    );

    localStorage.setItem(
        'customers',
        JSON.stringify(customers)
    );

    localStorage.setItem(
        'transactions',
        JSON.stringify(transactions)
    );

}


/* =========================
   4. NAVIGATION
========================= */

function page(name) {

    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });

    const selectedPage = document.getElementById(name);

    if (!selectedPage) return;

    selectedPage.classList.remove('hidden');

    const titles = {

        dashboard: 'Dashboard',
        products: 'Products',
        inventory: 'Inventory',
        customers: 'Customers',
        sales: 'Sales',
        transactions: 'Transactions'

    };

    document.getElementById('title').textContent =
        titles[name] || 'Dashboard';

    render();

}


/* =========================
   5. ADD PRODUCT
========================= */

function addProduct() {

    let name = prompt('Enter perfume name:');

    if (!name || !name.trim()) return;

    let category = prompt('Enter category:');

    if (!category || !category.trim()) return;

    let size = prompt('Enter size (10ml, 30ml, 50ml):');

    if (!size || !size.trim()) return;

    let price = Number(prompt('Enter price:'));

    let stock = Number(prompt('Enter stock:'));

    if (
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(stock) ||
        stock < 0
    ) {

        alert('Invalid price or stock.');
        return;

    }

    products.push({

        name: name.trim(),
        category: category.trim(),
        size: size.trim(),
        price: price,
        stock: stock

    });

    saveData();

    render();

    alert('Product successfully added!');

}


/* =========================
   6. DELETE PRODUCT
========================= */

function deleteProduct(index) {

    if (!confirm('Delete this product?')) return;

    products.splice(index, 1);

    saveData();

    render();

}


/* =========================
   7. ADD CUSTOMER
========================= */

function addCustomer() {

    let name = prompt('Enter customer name:');

    if (!name || !name.trim()) return;

    let phone = prompt('Enter phone number:') || '';

    customers.push({

        name: name.trim(),
        phone: phone.trim()

    });

    saveData();

    render();

    alert('Customer successfully added!');

}


/* =========================
   8. DELETE CUSTOMER
========================= */

function deleteCustomer(index) {

    if (!confirm('Delete customer?')) return;

    customers.splice(index, 1);

    saveData();

    render();

}


/* =========================
   9. SALES CALCULATION
========================= */

function calculate() {

    const productSelect =
        document.getElementById('productSelect');

    const quantityInput =
        document.getElementById('quantity');

    const totalAmount =
        document.getElementById('totalAmount');

    if (!productSelect || !quantityInput || !totalAmount) return;

    let index = Number(productSelect.value);

    let qty = Number(quantityInput.value);

    let product = products[index];

    let total =
        product && Number.isInteger(qty) && qty > 0
            ? product.price * qty
            : 0;

    totalAmount.textContent = '₱' + total.toFixed(2);

}


/* =========================
   10. SAVE SALE
========================= */

function saveSale() {

    let index = Number(
        document.getElementById('productSelect').value
    );

    let qty = Number(
        document.getElementById('quantity').value
    );

    let product = products[index];

    if (!product || !Number.isInteger(qty) || qty < 1) {

        alert('Please select a valid product and quantity.');

        return;

    }

    if (qty > product.stock) {

        alert('Not enough stock available!');

        return;

    }

    let customerIndex =
        document.getElementById('customerSelect').value;

    let customer =
        customerIndex === ''
            ? 'Walk-in Customer'
            : customers[Number(customerIndex)]?.name;

    if (!customer) {

        alert('Please select a valid customer.');

        return;

    }

    let total = product.price * qty;

    transactions.push({

        date: new Date().toLocaleDateString(),
        customer: customer,
        product: product.name,
        quantity: qty,
        total: total,
        payment: document.getElementById('payment').value

    });

    product.stock -= qty;

    saveData();

    document.getElementById('quantity').value = 1;

    alert('Sale successfully recorded!');

    render();

}


/* =========================
   11. DISPLAY DATA
========================= */

function render() {

    // DASHBOARD TOTALS

    document.getElementById('totalProducts').textContent =
        products.length;

    document.getElementById('totalCustomers').textContent =
        customers.length;

    let total = transactions.reduce(
        (sum, transaction) => sum + transaction.total,
        0
    );

    document.getElementById('totalSales').textContent =
        '₱' + total.toFixed(2);

    document.getElementById('lowStock').textContent =
        products.filter(product => product.stock <= 5).length;


    // PRODUCT LIST

    document.getElementById('productList').innerHTML =

        products.map((product, index) => `

        <tr class="border-t">

            <td>${escapeHTML(product.name)}</td>

            <td>${escapeHTML(product.category)}</td>

            <td>${escapeHTML(product.size)}</td>

            <td>₱${product.price.toFixed(2)}</td>

            <td>${product.stock}</td>

            <td>
                <button
                    onclick="deleteProduct(${index})"
                    class="text-red-500">
                    Delete
                </button>
            </td>

        </tr>

        `).join('');


    // INVENTORY LIST

    document.getElementById('inventoryList').innerHTML =

        products.map(product => `

        <tr class="border-t">

            <td>${escapeHTML(product.name)}</td>

            <td>${escapeHTML(product.size)}</td>

            <td>${product.stock}</td>

            <td class="${
                product.stock <= 5
                    ? 'text-red-500'
                    : 'text-green-600'
            }">

                ${
                    product.stock <= 5
                        ? 'Low Stock'
                        : 'Available'
                }

            </td>

        </tr>

        `).join('');


    // CUSTOMER LIST

    document.getElementById('customerList').innerHTML =

        customers.map((customer, index) => `

        <tr class="border-t">

            <td>${escapeHTML(customer.name)}</td>

            <td>${escapeHTML(customer.phone)}</td>

            <td>

                <button
                    onclick="deleteCustomer(${index})"
                    class="text-red-500">
                    Delete
                </button>

            </td>

        </tr>

        `).join('');


    // CUSTOMER DROPDOWN

    document.getElementById('customerSelect').innerHTML =

        '<option value="">Walk-in Customer</option>' +

        customers.map((customer, index) => `

            <option value="${index}">
                ${escapeHTML(customer.name)}
            </option>

        `).join('');


    // PRODUCT DROPDOWN

    document.getElementById('productSelect').innerHTML =

        '<option value="">Select Product</option>' +

        products.map((product, index) => `

            <option value="${index}">
                ${escapeHTML(product.name)}
                - ₱${product.price.toFixed(2)}
            </option>

        `).join('');


    // TRANSACTION HISTORY

    document.getElementById('transactionList').innerHTML =

        transactions.map(transaction => `

        <tr class="border-t">

            <td>${escapeHTML(transaction.date)}</td>

            <td>${escapeHTML(transaction.customer)}</td>

            <td>${escapeHTML(transaction.product)}</td>

            <td>${transaction.quantity}</td>

            <td>₱${transaction.total.toFixed(2)}</td>

        </tr>

        `).join('');


    calculate();

}


/* =========================
   12. HTML SECURITY
========================= */

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => ({

        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'

    })[character]);

}


/* =========================
   13. INITIALIZE SYSTEM
========================= */

document.addEventListener('DOMContentLoaded', function() {

    applyTheme(
        localStorage.getItem('scentify-theme') || 'light'
    );

    render();

});
