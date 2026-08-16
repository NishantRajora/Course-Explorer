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

        results.innerHTML = `<div class="empty">No course found.</div>`;

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

                <button class="open">📖 Course</button>

                <button class="module">📂 Modules</button>

                <button class="copy-course">🔗 Copy Course</button>

                <button class="copy-module">📋 Copy Modules</button>

            </div>

        `;

        const courseLink =
            `https://nculms.canplus.io/courses/${course.id}`;
        

        const moduleLink =
            `https://nculms.canplus.io/courses/${course.id}/modules`;

        // Open Course
        card.querySelector(".open").onclick = () => {

            window.open(courseLink, "_blank");

        };

        // Open Modules
        card.querySelector(".module").onclick = () => {

            window.open(moduleLink, "_blank");

        };

        // Copy Course Link
        card.querySelector(".copy-course").onclick = (e) => {

            copyToClipboard(courseLink, e.target, "Copy Course");

        };

        // Copy Modules Link
        card.querySelector(".copy-module").onclick = (e) => {

            copyToClipboard(moduleLink, e.target, "Copy Modules");

        };

        fragment.appendChild(card);

    });

    results.appendChild(fragment);

}

function copyToClipboard(text, button, originalText) {

    navigator.clipboard.writeText(text);

    button.textContent = "✅ Copied";

    setTimeout(() => {

        button.textContent = originalText;

    }, 1000);

}
