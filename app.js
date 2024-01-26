// app.js
function processCSV() {
    const fileInput = document.getElementById("csv-file");
    const resultTable = document.getElementById("result-table");

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        Papa.parse(file, {
            header: true,
            complete: function(results) {
                const data = results.data;

                const categoryCounts = {};
                const staticValues = {
                    "Category I": 120,
                    "Category II": 150,
                    "Category III": 150,
                    "Category IV": 150,
                    "Category V": 148
                };

                // Assuming the specific column header is 'webhookLog.data.object.description'
                const categoryColumn = 'webhookLog.data.object.description';

                data.forEach(row => {
                    // Ignore rows with the value 'STRIPE PAYOUT'
                    if (row[categoryColumn] && row[categoryColumn] !== 'STRIPE PAYOUT') {
                        const match = row[categoryColumn].match(/(.+?) x (\d+)/);

                        if (match) {
                            const category = match[1].trim();
                            const count = parseInt(match[2]);

                            categoryCounts[category] = (categoryCounts[category] || 0) + count;
                        }
                    }
                });

                displayResultTable(categoryCounts, staticValues);
            }
        });
    } else {
        resultTable.innerHTML = "<p>Please choose a CSV file.</p>";
    }
}

function displayResultTable(data, staticValues) {
    const resultTable = document.getElementById("result-table");
    resultTable.innerHTML = "";

    const categories = ["Category I", "Category II", "Category III", "Category IV", "Category V"];

    const table = document.createElement("table");
    const headerRow = table.insertRow(0);

    const categoryHeader = document.createElement("th");
    categoryHeader.textContent = "Product/Service Description";
    headerRow.appendChild(categoryHeader);

    const purchasedHeader = document.createElement("th");
    purchasedHeader.textContent = "Quantity Purchased";
    headerRow.appendChild(purchasedHeader);

    const availableHeader = document.createElement("th");
    availableHeader.textContent = "Quantity Available";
    headerRow.appendChild(availableHeader);

    const leftHeader = document.createElement("th");
    leftHeader.textContent = "Quantity Left";
    headerRow.appendChild(leftHeader);

    categories.forEach(category => {
        const row = table.insertRow(-1);

        const categoryCell = row.insertCell(0);
        categoryCell.textContent = category;

        const purchasedCell = row.insertCell(1);
        purchasedCell.textContent = data[category] || 0;

        const availableCell = row.insertCell(2);
        availableCell.textContent = staticValues[category] || 0;

        const leftCell = row.insertCell(3);
        const leftValue = (staticValues[category] || 0) - (data[category] || 0);
        leftCell.textContent = leftValue;

        // Highlight cell in red if the left quantity is 5 or less
        if (leftValue <= 5) {
            leftCell.style.color = "red";
        }
    });

    resultTable.appendChild(table);
}
