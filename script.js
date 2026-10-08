const leadForm = document.getElementById("leadForm");
const leadTableBody = document.getElementById("leadTableBody");
const searchInput = document.getElementById("searchInput");

let leads = JSON.parse(localStorage.getItem("leads")) || [];
let editingId = null;


// ADD OR UPDATE LEAD
leadForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const source = document.getElementById("source").value.trim();
    const status = document.getElementById("status").value;
    const notes = document.getElementById("notes").value.trim();


    // UPDATE EXISTING LEAD
    if (editingId !== null) {

        const lead = leads.find(function (item) {
            return item.id === editingId;
        });

        if (lead) {
            lead.name = name;
            lead.email = email;
            lead.source = source;
            lead.status = status;
            lead.notes = notes;
        }

        editingId = null;

        document.querySelector("#leadForm button").textContent = "Add Lead";
        document.querySelector(".form-section h2").textContent = "Add New Lead";

    }

    // ADD NEW LEAD
    else {

        const newLead = {
            id: Date.now(),
            name: name,
            email: email,
            source: source,
            status: status,
            notes: notes
        };

        leads.push(newLead);
    }


    // SAVE DATA
    localStorage.setItem("leads", JSON.stringify(leads));

    displayLeads();

    leadForm.reset();
});


// DISPLAY LEADS
function displayLeads(list = leads) {

    leadTableBody.innerHTML = "";

    list.forEach(function (lead) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${lead.name}</td>
            <td>${lead.email}</td>
            <td>${lead.source}</td>
            <td>${lead.status}</td>
            <td>${lead.notes}</td>

            <td>
                <button type="button" class="edit-btn">
                    Edit
                </button>

                <button type="button" class="delete-btn">
                    Delete
                </button>
            </td>
        `;


        // EDIT
        row.querySelector(".edit-btn").addEventListener("click", function () {
            editLead(lead.id);
        });


        // DELETE
        row.querySelector(".delete-btn").addEventListener("click", function () {
            deleteLead(lead.id);
        });


        leadTableBody.appendChild(row);
    });
}


// EDIT LEAD
function editLead(id) {

    const lead = leads.find(function (item) {
        return item.id === id;
    });

    if (!lead) {
        return;
    }

    document.getElementById("name").value = lead.name;
    document.getElementById("email").value = lead.email;
    document.getElementById("source").value = lead.source;
    document.getElementById("status").value = lead.status;
    document.getElementById("notes").value = lead.notes;

    editingId = id;

    document.querySelector("#leadForm button").textContent = "Update Lead";
    document.querySelector(".form-section h2").textContent = "Edit Lead";

    document.querySelector(".form-section").scrollIntoView({
        behavior: "smooth"
    });
}


// DELETE LEAD
function deleteLead(id) {

    leads = leads.filter(function (lead) {
        return lead.id !== id;
    });

    localStorage.setItem("leads", JSON.stringify(leads));

    displayLeads();
}


// SEARCH
searchInput.addEventListener("input", function () {

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredLeads = leads.filter(function (lead) {

        return (
            lead.name.toLowerCase().includes(searchText) ||
            lead.email.toLowerCase().includes(searchText) ||
            lead.source.toLowerCase().includes(searchText)
        );

    });

    displayLeads(filteredLeads);
});


// SHOW SAVED LEADS
displayLeads();