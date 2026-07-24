const searchBox = document.getElementById("searchBox");
const results = document.getElementById("results");

let courses = [];

// Load CSV
fetch("course.csv")
    .then(res => res.text())
    .then(text => {

        const rows = text.trim().split("\n");

        courses = rows.map(row => {

            const comma = row.indexOf(",");

            return {
                id: row.substring(0, comma).trim(),
                name: row.substring(comma + 1).trim()
            };

        });

    });

// Debounce
let timer;

searchBox.addEventListener("input", () => {

    clearTimeout(timer);

    timer = setTimeout(search, 120);

});

function search() {

    const query = searchBox.value.trim().toLowerCase();

    results.innerHTML = "";

    if (query === "")
        return;

    const filtered = [];

    for (const course of courses) {

        if (
            course.id.includes(query) ||
            course.name.toLowerCase().includes(query)
        ) {
            filtered.push(course);

            if (filtered.length >= 100)
                break;
        }

    }

    render(filtered);

}

function render(list) {

    if (list.length === 0) {

        results.innerHTML =
            `<div class="empty">No course found.</div>`;

        return;

    }

    const fragment = document.createDocumentFragment();

    list.forEach(course => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `

        <h3>${course.name}</h3>

        <p>Course ID : <strong>${course.id}</strong></p>

        <div class="buttons">

        <button class="open">Open Course</button>

        <button class="copy">Copy Link</button>

        </div>

        `;

        card.querySelector(".open").onclick = () => {

            window.open(
                `https://nculms.ncuindia.edu/courses/${course.id}`,
                "_blank"
            );

        };

        card.querySelector(".copy").onclick = () => {

            navigator.clipboard.writeText(
                `https://nculms.ncuindia.edu/courses/${course.id}`
            );

            const btn = card.querySelector(".copy");

            btn.textContent = "Copied ✓";

            setTimeout(() => {

                btn.textContent = "Copy Link";

            }, 1000);

        };

        fragment.appendChild(card);

    });

    results.appendChild(fragment);

}