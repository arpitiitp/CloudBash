async function analyzeUrl() {
    const url = document.getElementById("urlInput").value;
    const errorDiv = document.getElementById("error");
    const resultTable = document.getElementById("resultTable");
    const resultBody = document.getElementById("resultBody");

    // Reset any previous errors or results
    errorDiv.textContent = '';
    resultTable.style.display = 'none';
    resultBody.innerHTML = '';

    // Validate URL input
    if (!url) {
        errorDiv.textContent = "Please enter a URL.";
        return;
    }

    try {
        // Make the request to the backend
        const response = await fetch('http://localhost:3000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url }) // Correctly send the URL as part of the request
        });

        const data = await response.json();

        // Check if the response was successful
        if (response.ok) {
            const words = data.data;
            resultTable.style.display = 'table';
            
            // Populate the table with words and frequencies
            words.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${item.word}</td><td>${item.frequency}</td>`;
                resultBody.appendChild(row);
            });
        } else {
            // Display backend error message if available
            errorDiv.textContent = data.error || "An unexpected error occurred from the server.";
        }
    } catch (error) {
        // Handle any network or parsing errors
        console.error("Frontend Error:", error);
        errorDiv.textContent = "A frontend error occurred. Please try again.";
    }
}
