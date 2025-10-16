document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("miFormulario");

    form.addEventListener("submit", function (event) {
        let isValid = true;

        // Elimina els missatges d'error
        document.querySelectorAll(".error").forEach(span => span.textContent = "");

        // Informació personal
        const nom = document.getElementById("nom");
        const cognom = document.getElementById("cognom");
        const adresa = document.getElementById("adresa");
        const correu = document.getElementById("correu");
        const tel = document.getElementById("numTel");

        if (nom.value.trim() === "") {
            document.getElementById("errorNom").textContent = "Name is required.";
            isValid = false;
        }

        if (cognom.value.trim() === "") {
            document.getElementById("errorCognom").textContent = "Surname is required.";
            isValid = false;
        }

        if (adresa.value.trim() === "") {
            document.getElementById("errorAdresa").textContent = "Location is required.";
            isValid = false;
        }

        if (!correu.value.includes("@")) {
            document.getElementById("errorCorreu").textContent = "Invalid email format.";
            isValid = false;
        }

        if (!tel.value.match(/^\d{3}-\d{3}-\d{3}$/)) {
            document.getElementById("errorTel").textContent = "Phone format must be 123-456-789.";
            isValid = false;
        }

        // Validació de productes
        const products = ["item1", "item2", "item3", "item4"];
        let atLeastOneProductSelected = false;

        for (let item of products) {
            const checkbox = document.getElementById(item);
            const quantityInput = document.getElementById("quantitat" + item.charAt(0).toUpperCase() + item.slice(1));
            const quantity = parseInt(quantityInput.value, 10);

            if (checkbox.checked) {
                if (isNaN(quantity) || quantity <= 0) {
                    alert(`Quantity for ${item} must be greater than 0 if selected.`);
                    isValid = false;
                } else {
                    atLeastOneProductSelected = true;
                }
            }
        }

        if (!atLeastOneProductSelected) {
            alert("You must select at least one product with a valid quantity.");
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault(); // Para els rebuts
        }
    });
});
