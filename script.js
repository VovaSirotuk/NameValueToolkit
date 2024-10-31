document.addEventListener("DOMContentLoaded", function() {
    // Grabbing references to all necessary elements on the page
    const addButton = document.querySelector(".add-button");
    const sortByNameButton = document.getElementById("SortByName");
    const sortByValueButton = document.getElementById("SortByValue");
    const deleteAllButton = document.getElementById("DeleteAll");
    const deleteSelectedButton = document.getElementById("DeleteSelected");
    const showXMLButton = document.getElementById("ShowXML");
    const nameValueInput = document.getElementById("name-value");
    const nameValueList = document.getElementById("name-value-list");
    const copyXMLButton = document.getElementById("copy-button");

    // Array to hold name-value pairs
    let pairs = [];

    // Event listener to handle adding a new name-value pair
    addButton.addEventListener("click", () => {
        const input = nameValueInput.value;
        const regex = /^[а-яіА-ЯІa-zA-Z]+\s*=\s*[0-9]+$/;

        // Validate the input format
        if (regex.test(input)) {
            const [name, value] = input.split("=");
            pairs.push({ name: name.trim(), value: value.trim() });
            updateList(); // Refresh the list display
            nameValueInput.value = ""; // Clear the input field
        } else {
            alert("Invalid format. Please enter in 'Name=Value' format.");
        }
    });

    // Event listener to sort pairs by name alphabetically
    sortByNameButton.addEventListener("click", () => {
        pairs.sort((a, b) => a.name.localeCompare(b.name));
        updateList(); // Update the list display after sorting
    });

    // Event listener to sort pairs by their numeric value
    sortByValueButton.addEventListener("click", () => {
        pairs.sort((a, b) => a.value.localeCompare(b.value));
        updateList(); // Refresh the list display after sorting
    });

    // Event listener to delete all pairs from the list
    deleteAllButton.addEventListener("click", () => {
        pairs = []; // Clear the pairs array
        updateList(); // Update the list display
    });

    // Event listener to delete selected pairs from the list
    deleteSelectedButton.addEventListener("click", () => {
        const selectedOptions = Array.from(nameValueList.selectedOptions);
        selectedOptions.forEach(option => {
            const [name, value] = option.textContent.split("=");
            // Filter out the selected pair(s) from the array
            pairs = pairs.filter(pair => pair.name !== name.trim() || pair.value !== value.trim());
        });
        updateList(); // Refresh the list display
    });

    // Event listener to toggle the XML display and update it
    showXMLButton.addEventListener("click", () => {
        const xmlSection = document.querySelector(".xml-list-section");

        if (xmlSection.style.display === "none" || xmlSection.style.display === "") {
            xmlSection.style.display = "block"; // Show XML section
            showXMLButton.textContent = "Hide XML"; // Update button text
            updateXML(); // Generate XML
        } else {
            xmlSection.style.display = "none"; // Hide XML section
            showXMLButton.textContent = "Show XML"; // Update button text
        }
    });

    // Function to update the displayed list of pairs
    function updateList() {
        nameValueList.innerHTML = ""; // Clear current list
        pairs.forEach(pair => {
            const option = document.createElement("option");
            option.textContent = `${pair.name}=${pair.value}`;
            nameValueList.appendChild(option); // Add each pair as a list item
        });
        updateXML(); // Also update XML if it's being displayed
    }

    // Function to generate and display XML format of pairs
    function updateXML() {
        const xmlSection = document.querySelector(".xml-list-section");
        const xmlTextArea = document.getElementById("pair-XML");

        if (xmlSection.style.display === "block") {
            let xml = "<pairs>\n";
            pairs.forEach(pair => {
                xml += `  <pair><name>${pair.name}</name><value>${pair.value}</value></pair>\n`;
            });
            xml += "</pairs>";
            xmlTextArea.value = xml; // Display generated XML in the textarea
        }
    }

    // Event listener to copy the XML content to clipboard
    copyXMLButton.addEventListener("click", () => {
        const xmlTextArea = document.getElementById("pair-XML");

        xmlTextArea.select(); // Select XML content
        xmlTextArea.setSelectionRange(0, 99999); // For mobile support

        // Copy selected text to clipboard
        navigator.clipboard.writeText(xmlTextArea.value).then(() => {
            copyXMLButton.textContent = "Copied ✓"; // Confirmation message
            setTimeout(() => {
                copyXMLButton.textContent = "Copy XML"; // Reset button text after 1 second
            }, 1000);
        }).catch(err => {
            alert("Failed to copy XML: ", err); // Error handling if copying fails
        });
    });
});
