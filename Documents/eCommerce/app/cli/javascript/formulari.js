// formulari.js - CORREGIDO
document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
});

function initializeForm() {
    const form = document.getElementById('miFormulario');

    if (!form) {
        console.error('Form not found');
        return;
    }

    // Initialize quantity fields state
    document.querySelectorAll('input[name="items[]"]').forEach(checkbox => {
        const itemId = checkbox.id.replace('item', '');
        const cantidadInput = document.getElementById('quantitatItem' + itemId);
        if (cantidadInput) {
            cantidadInput.disabled = !checkbox.checked;
        }
    });

    // Add event listeners for checkboxes
    document.querySelectorAll('input[name="items[]"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const itemId = this.id.replace('item', '');
            const cantidadInput = document.getElementById('quantitatItem' + itemId);
            if (cantidadInput) {
                cantidadInput.disabled = !this.checked;

                if (!this.checked) {
                    cantidadInput.value = '0';
                } else {
                    cantidadInput.value = '1';
                }
            }
        });
    });

    // Form submit handler
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validarFormulario()) {
            submitOrder();
        }
    });

    // Real-time validation
    addRealTimeValidation();
}
function validarFormulario() {
    let esValido = true;

    // Clear previous errors
    document.querySelectorAll('.error').forEach(error => error.textContent = '');

    // Validate name
    const nom = document.getElementById('nom').value.trim();
    if (nom === '') {
        document.getElementById('errorNom').textContent = 'Name is required';
        esValido = false;
    } else if (nom.length < 2) {
        document.getElementById('errorNom').textContent = 'Name must be at least 2 characters';
        esValido = false;
    }

    // Validate surname
    const cognom = document.getElementById('cognom').value.trim();
    if (cognom === '') {
        document.getElementById('errorCognom').textContent = 'Surname is required';
        esValido = false;
    } else if (cognom.length < 2) {
        document.getElementById('errorCognom').textContent = 'Surname must be at least 2 characters';
        esValido = false;
    }

    // Validate address
    const adresa = document.getElementById('adresa').value.trim();
    if (adresa === '') {
        document.getElementById('errorAdresa').textContent = 'Address is required';
        esValido = false;
    } else if (adresa.length < 5) {
        document.getElementById('errorAdresa').textContent = 'Address must be at least 5 characters';
        esValido = false;
    }

    // Validate email
    const correu = document.getElementById('correu').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correu)) {
        document.getElementById('errorCorreu').textContent = 'Valid email is required';
        esValido = false;
    }

    // Validate phone
    const tel = document.getElementById('numTel').value;
    const telRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{3}$/;  // 9 dígitos
    if (!telRegex.test(tel)) {
        document.getElementById('errorTel').textContent = 'Format: 123-456-789';  // Actualiza el mensaje
        esValido = false;
    }

    // Validate that at least one item is selected with quantity > 0
    const hasSelectedItems = validateItems();
    if (!hasSelectedItems) {
        alert('Please select at least one item with quantity greater than 0');
        esValido = false;
    }

    return esValido;
}

function validateItems() {
    let hasValidItems = false;
    const checkboxes = document.querySelectorAll('input[name="items[]"]:checked');

    checkboxes.forEach(checkbox => {
        const itemId = checkbox.id.replace('item', '');
        const cantidadInput = document.getElementById('quantitatItem' + itemId);
        const quantity = parseInt(cantidadInput.value);

        if (quantity > 0) {
            hasValidItems = true;
        }
    });

    return hasValidItems;
}

function submitOrder() {
    const form = document.getElementById('miFormulario');
    const formData = new FormData(form);
    const submitButton = form.querySelector('input[type="submit"]');
    
    // Debug: Mostrar los datos que se envían
    console.log('Datos del formulario:');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
    
    // Disable submit button during processing
    submitButton.disabled = true;
    submitButton.value = 'Processing...';
    
    // Show loading state
    showResult('Processing your order...', 'info');
    
    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        // Primero obtener el texto para ver qué devuelve realmente
        return response.text().then(text => {
            console.log('Raw response:', text);
            
            // Intentar parsear como JSON
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('JSON parse error:', e);
                throw new Error(`Server returned invalid JSON: ${text.substring(0, 100)}`);
            }
        });
    })
    .then(data => {
        console.log('Parsed data:', data);
        
        if (data.success) {
            showResult(`
                <h3>✅ Order Created Successfully!</h3>
                <p><strong>Order ID:</strong> ${data.order_id}</p>
                <p><strong>Total with VAT (21%):</strong> €${data.total_with_vat}</p>
                <p>${data.message}</p>
                <button onclick="resetForm()" style="margin-top: 10px;">Create New Order</button>
            `, 'success');
            
            // Reset form after successful submission
            form.reset();
            
            // Re-initialize form state
            initializeForm();
        } else {
            showResult(`<p>❌ Error: ${data.error}</p>`, 'error');
        }
    })
    .catch(error => {
        console.error('Full error details:', error);
        showResult(`
            <p>❌ Error processing order</p>
            <p style="font-size: 0.9em; color: #666;">Details: ${error.message}</p>
            <p style="font-size: 0.9em; color: #666;">Check browser console for complete error information</p>
        `, 'error');
    })
    .finally(() => {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.value = 'Submit';
    });
}

function showResult(message, type) {
    let resultDiv = document.getElementById('result');

    // Create result div if it doesn't exist
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'result';
        resultDiv.style.marginTop = '20px';
        resultDiv.style.padding = '15px';
        resultDiv.style.borderRadius = '5px';
        resultDiv.style.display = 'none';
        document.querySelector('.container').appendChild(resultDiv);
    }

    // Set styles based on type
    switch (type) {
        case 'success':
            resultDiv.style.backgroundColor = '#d4edda';
            resultDiv.style.color = '#155724';
            resultDiv.style.border = '1px solid #c3e6cb';
            break;
        case 'error':
            resultDiv.style.backgroundColor = '#f8d7da';
            resultDiv.style.color = '#721c24';
            resultDiv.style.border = '1px solid #f5c6cb';
            break;
        case 'info':
            resultDiv.style.backgroundColor = '#d1ecf1';
            resultDiv.style.color = '#0c5460';
            resultDiv.style.border = '1px solid #bee5eb';
            break;
    }

    resultDiv.innerHTML = message;
    resultDiv.style.display = 'block';

    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetForm() {
    const form = document.getElementById('miFormulario');
    form.reset();

    // Hide result div
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }

    // Re-initialize form state
    initializeForm();
}

function addRealTimeValidation() {
    // Real-time validation for name
    document.getElementById('nom').addEventListener('blur', function () {
        const value = this.value.trim();
        const errorElement = document.getElementById('errorNom');

        if (value === '') {
            errorElement.textContent = 'Name is required';
        } else if (value.length < 2) {
            errorElement.textContent = 'Name must be at least 2 characters';
        } else {
            errorElement.textContent = '';
        }
    });

    // Real-time validation for surname
    document.getElementById('cognom').addEventListener('blur', function () {
        const value = this.value.trim();
        const errorElement = document.getElementById('errorCognom');

        if (value === '') {
            errorElement.textContent = 'Surname is required';
        } else if (value.length < 2) {
            errorElement.textContent = 'Surname must be at least 2 characters';
        } else {
            errorElement.textContent = '';
        }
    });

    // Real-time validation for address
    document.getElementById('adresa').addEventListener('blur', function () {
        const value = this.value.trim();
        const errorElement = document.getElementById('errorAdresa');

        if (value === '') {
            errorElement.textContent = 'Address is required';
        } else if (value.length < 5) {
            errorElement.textContent = 'Address must be at least 5 characters';
        } else {
            errorElement.textContent = '';
        }
    });

    // Real-time validation for email
    document.getElementById('correu').addEventListener('blur', function () {
        const value = this.value.trim();
        const errorElement = document.getElementById('errorCorreu');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            errorElement.textContent = 'Valid email is required';
        } else {
            errorElement.textContent = '';
        }
    });

    // Real-time validation for phone
    document.getElementById('numTel').addEventListener('blur', function () {
        const value = this.value;
        const errorElement = document.getElementById('errorTel');
        const telRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{3}$/;

        if (!telRegex.test(value)) {
            errorElement.textContent = 'Format: 123-45-678';
        } else {
            errorElement.textContent = '';
        }
    });

    // Real-time validation for quantities
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('change', function () {
            const value = parseInt(this.value);
            if (value < 0) {
                this.value = '0';
            } else if (value > 50) {
                this.value = '50';
            }
        });

        input.addEventListener('input', function () {
            const value = parseInt(this.value);
            if (value > 50) {
                this.value = '50';
            }
        });
    });
}

// Helper function to calculate total (optional - for client-side preview)
function calculatePreviewTotal() {
    const prices = {
        'item1': 29.99,
        'item2': 49.99,
        'item3': 19.99,
        'item4': 79.99
    };

    let subtotal = 0;

    document.querySelectorAll('input[name="items[]"]:checked').forEach(checkbox => {
        const itemId = checkbox.id.replace('item', '');
        const cantidadInput = document.getElementById('quantitatItem' + itemId);
        const quantity = parseInt(cantidadInput.value);

        if (quantity > 0) {
            subtotal += prices[checkbox.value] * quantity;
        }
    });

    const vat = subtotal * 0.21;
    const total = subtotal + vat;

    return {
        subtotal: subtotal.toFixed(2),
        vat: vat.toFixed(2),
        total: total.toFixed(2)
    };
}

// Export functions for global access (if needed)
window.resetForm = resetForm;
window.calculatePreviewTotal = calculatePreviewTotal;