// i moved it all to index.js

document.addEventListener("DOMContentLoaded", () => {
    let todo = [];
    let inpogress = [];
    let testing = [];
    let close = [];

    const columns = ["kanban_todo", "kanban_in_progress", "kanban_testing", "kanban_close"];


    document.getElementById("inject_dummy_tasks").addEventListener("click", () => {
        let rows = `<td>`;
        for (let i = 0; i < 10; i++) {
            rows += `
                <div class="card mb-3" id="task_${i}" style="width: auto;">
                    <div class="card-header task-title" data-id="${i}">Task ${i}</div>
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted task-priority" data-id="${i}">Priority: Medium</h6>
                        <p class="card-text task-desc" data-id="${i}">This is a description for Task ${i}.</p>
                        <button class="btn btn-sm btn-warning modify-btn" data-id="${i}">Modify</button>
                        <button class="btn btn-sm btn-primary move-btn" data-id="${i}">Move</button>
                    </div>
                </div>
            `;
        }
        rows += `</td>`;
        document.getElementById("kanban_todo").innerHTML = rows;
        attachModifyListeners();
        attachMoveListener();
    });

    function attachDoneListener() {
        document.querySelectorAll(".done-btn").forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const card = document.getElementById(`task_${id}`);
                card.remove();
            });
        });
    }
    

    function attachMoveListener() {
        document.querySelectorAll(".move-btn").forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const card = document.getElementById(`task_${id}`);
                const currentColumnId = card.closest("td").id;
                const currentIndex = columns.indexOf(currentColumnId);

                if (currentIndex >= 0 && currentIndex < columns.length - 1) {
                    const nextColumnId = columns[currentIndex + 1];
                    document.getElementById(nextColumnId).appendChild(card);

                    if (nextColumnId === "kanban_close") {
                        const moveBtn = card.querySelector(".move-btn");
                        if (moveBtn) {
                            moveBtn.outerHTML = `<button class="btn btn-sm btn-danger done-btn" data-id="${id}">Done</button>`;
                            attachDoneListener();
                        }
                    }
                } else {
                    alert("Task is already in the final column!");
                }
            });
        });
    }
    
    


    function attachModifyListeners() {
        document.querySelectorAll('.modify-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;

                const titleEl = document.querySelector(`#task_${id} .task-title`);
                const priorityEl = document.querySelector(`#task_${id} .task-priority`);
                const descEl = document.querySelector(`#task_${id} .task-desc`);

                const title = titleEl.innerText;
                const priority = priorityEl.innerText.replace('Priority: ', '');
                const desc = descEl.innerText;

                // Replace static content with input fields
                titleEl.innerHTML = `<input class="form-control form-control-sm" id="edit_title_${id}" placeholder="${title}">`;
                priorityEl.innerHTML = `<input class="form-control form-control-sm" id="edit_priority_${id}" placeholder="${priority}">`;
                descEl.innerHTML = `<textarea class="form-control form-control-sm" id="edit_desc_${id}" placeholder="${desc}"></textarea>`;

                // Replace Modify button with Save
                e.target.outerHTML = `<button class="btn btn-sm btn-success save-btn" data-id="${id}">Save</button>`;

                attachSaveListener(id);
            });
        });
    }

    function attachSaveListener(id) {
        // Defer to wait for DOM update
        setTimeout(() => {
            const saveBtn = document.querySelector(`#task_${id} .save-btn`);
            saveBtn.addEventListener('click', () => {
                const newTitle = document.getElementById(`edit_title_${id}`).value || document.getElementById(`edit_title_${id}`).placeholder;
                const newPriority = document.getElementById(`edit_priority_${id}`).value || document.getElementById(`edit_priority_${id}`).placeholder;
                const newDesc = document.getElementById(`edit_desc_${id}`).value || document.getElementById(`edit_desc_${id}`).placeholder;

                // Update DOM to show plain text again
                document.querySelector(`#task_${id} .task-title`).innerText = newTitle;
                document.querySelector(`#task_${id} .task-priority`).innerText = `Priority: ${newPriority}`;
                document.querySelector(`#task_${id} .task-desc`).innerText = newDesc;

                // Replace Save button with Modify again
                saveBtn.outerHTML = `<button class="btn btn-sm btn-warning modify-btn" data-id="${id}">Modify</button>`;

                // Re-attach modify handler
                attachModifyListeners();
            });
        }, 0);
    }
});