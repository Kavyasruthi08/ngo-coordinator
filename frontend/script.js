const baseURL = "http://localhost:5000/api";
const content = document.getElementById("content");

// ====== LOAD DASHBOARD ======
document.getElementById("showDashboard").addEventListener("click", async () => {
  const [volRes, eventRes, regRes] = await Promise.all([
    fetch(`${baseURL}/volunteers`),
    fetch(`${baseURL}/events`),
    fetch(`${baseURL}/registrations`),
  ]);
  const [volunteers, events, registrations] = await Promise.all([
    volRes.json(),
    eventRes.json(),
    regRes.json(),
  ]);

  content.innerHTML = `
    <h2>📊 Dashboard Overview</h2>
    <p>👥 Total Volunteers: <strong>${volunteers.length}</strong></p>
    <p>🎉 Total Events: <strong>${events.length}</strong></p>
    <p>📝 Total Registrations: <strong>${registrations.length}</strong></p>
  `;
});

// ====== VOLUNTEERS ======
document.getElementById("showVolunteers").addEventListener("click", async () => {
  const res = await fetch(`${baseURL}/volunteers`);
  const data = await res.json();

  content.innerHTML = `
    <h2>👥 Volunteers</h2>
    <form id="volunteerForm">
      <input id="vname" placeholder="Name" required />
      <input id="vemail" placeholder="Email" type="email" required />
      <input id="vphone" placeholder="Phone" required />
      <input id="vskills" placeholder="Skills (comma separated)" />
      <button type="submit">Add Volunteer</button>
    </form>
    <div id="tableContainer"></div>
  `;

  document.getElementById("volunteerForm").addEventListener("submit", addVolunteer);
  renderTable(data, ["_id", "name", "email", "phone", "skills"]);
});

async function addVolunteer(e) {
  e.preventDefault();
  const name = document.getElementById("vname").value;
  const email = document.getElementById("vemail").value;
  const phone = document.getElementById("vphone").value;
  const skills = document.getElementById("vskills").value.split(",");

  await fetch(`${baseURL}/volunteers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, skills }),
  });

  alert("✅ Volunteer added!");
  document.getElementById("showVolunteers").click();
}

// ====== EVENTS ======
document.getElementById("showEvents").addEventListener("click", async () => {
  const res = await fetch(`${baseURL}/events`);
  const data = await res.json();

  content.innerHTML = `
    <h2>🎉 Events</h2>
    <form id="eventForm">
      <input id="etitle" placeholder="Event Name" required />
      <input id="edate" placeholder="Date (YYYY-MM-DD)" required />
      <input id="elocation" placeholder="Location" required />
      <input id="edescription" placeholder="Description" />
      <button type="submit">Add Event</button>
    </form>
    <div id="tableContainer"></div>
  `;

  document.getElementById("eventForm").addEventListener("submit", addEvent);
  renderTable(data, ["_id", "title", "date", "location", "description"]);
});

async function addEvent(e) {
  e.preventDefault();

  const title = document.getElementById("etitle").value.trim();
  const dateInput = document.getElementById("edate").value.trim();
  const location = document.getElementById("elocation").value.trim();
  const description = document.getElementById("edescription").value.trim();

  const date = new Date(dateInput).toISOString();

  if (!title || !dateInput || !location) {
    alert("❌ Title, Date and Location are required!");
    return;
  }

  const payload = { title, date, location, description };

  try {
    const response = await fetch(`${baseURL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      alert("❌ Server rejected request: " + (result.message || "Bad Request"));
      return;
    }

    alert("✅ Event added successfully!");
    document.getElementById("showEvents").click();

  } catch (err) {
    alert("❌ Network or server error");
    console.error(err);
  }
}

// ====== REGISTRATIONS ======
document.getElementById("showRegistrations").addEventListener("click", async () => {
  const res = await fetch(`${baseURL}/registrations`);
  const data = await res.json();

  content.innerHTML = `
    <h2>📝 Registrations</h2>
    <form id="registrationForm">
      <input id="volunteerId" placeholder="Volunteer ID" required />
      <input id="eventId" placeholder="Event ID" required />
      <input id="status" placeholder="Status (optional)" />
      <button type="submit">Add Registration</button>
    </form>
    <div id="tableContainer"></div>
  `;

  document.getElementById("registrationForm").addEventListener("submit", addRegistration);
  renderTable(data, ["_id", "volunteer", "event", "status"]);
});

async function addRegistration(e) {
  e.preventDefault();

  const volunteer = document.getElementById("volunteerId").value.trim();
  const event = document.getElementById("eventId").value.trim();
  const status = document.getElementById("status").value.trim();

  if (!volunteer || !event) {
    alert("❌ Volunteer ID and Event ID are required!");
    return;
  }

  const payload = { volunteerId: volunteer, eventId: event, status };

  console.log("✅ Sending registration:", payload);

  try {
    const response = await fetch(`${baseURL}/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("🟡 Server response:", result);

    if (!response.ok) {
      alert("❌ Failed: " + (result.message || "Bad Request"));
      return;
    }

    alert("✅ Registration added!");
    document.getElementById("showRegistrations").click();

  } catch (error) {
    console.error("❌ Error:", error);
    alert("❌ Server error, check console!");
  }
}


// ====== FIXED TABLE RENDER FUNCTION ======
function renderTable(data, fields) {
  if (!Array.isArray(data)) {
    document.getElementById("tableContainer").innerHTML = "<p>No data available</p>";
    return;
  }

  let table = `<table border="1" cellpadding="5"><thead><tr>${fields.map(f => `<th>${f}</th>`).join("")}</tr></thead><tbody>`;

  table += data.map(item =>
    `<tr>${fields.map(field => {
      if (field === "volunteer") return `<td>${item.volunteer?.name || item.volunteer?._id || ""}</td>`;
      if (field === "event") return `<td>${item.event?.title || item.event?._id || ""}</td>`;
      return `<td>${item[field] || ""}</td>`;
    }).join("")}</tr>`
  ).join("");

  table += `</tbody></table>`;
  document.getElementById("tableContainer").innerHTML = table;
}
