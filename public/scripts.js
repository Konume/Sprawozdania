document.addEventListener("DOMContentLoaded", () => {
    // Adres URL do pobrania listy plików XML
    const url = "/files";
    const select = document.getElementById("xmlFiles");

    // Pobierz listę plików XML z serwera
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Pobrane pliki:", data);
            // Utwórz opcje dla listy rozwijanej
              // Wyczyszczenie listy rozwijanej przed jej wypełnieniem
            select.innerHTML = '<option value="" selected disabled>Wybierz plik XML</option>';
           
            data.forEach(file => {
                const option = document.createElement("option");
                option.value = file;
                option.textContent = file;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error("There was a problem with fetching XML files:", error);
        });
        select.addEventListener("change", (event) => {
            const selectedFile = event.target.value;
            if (selectedFile) {
                window.location.href = `/xml/${selectedFile}`;
            }
        });
});
