
// Load students from Local Storage
let students = JSON.parse(localStorage.getItem('students') || '[]');

// Variable to store currently edited student index
let edit = -1;

// Shortcut for document.getElementById()
const $ = (id) => document.getElementById(id);

// Calculate Grade
function grade(avg) {
    return avg >= 90 ? 'A+' :
           avg >= 80 ? 'A'  :
           avg >= 70 ? 'B'  :
           avg >= 60 ? 'C'  :
           avg >= 50 ? 'D'  :
           'F';
}

// Save data to Local Storage
function saveLS() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Display students in table
function render() {

    const q = $('search').value.toLowerCase();
    const tb = $('tbody');

    tb.innerHTML = '';

    let list = students.filter(student =>
        student.name.toLowerCase().includes(q) ||
        student.roll.includes(q)
    );

    let avgAll = 0;

    list.forEach((student) => {

        avgAll += student.avg;

        tb.innerHTML += `
            <tr>
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>${student.total}</td>
                <td>${student.avg}</td>
                <td>${student.grade}</td>
                <td>
                    <button onclick="editStu(${students.indexOf(student)})">
                        Edit
                    </button>

                    <button onclick="delStu(${students.indexOf(student)})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    $('stats').textContent =
        `Students: ${students.length}
         Average: ${list.length ? (avgAll / list.length).toFixed(2) : 0}`;
}

// Clear Form
function clearF() {

    ['name', 'roll', 'm1', 'm2', 'm3'].forEach(id => {
        $(id).value = '';
    });

    edit = -1;

    $('save').textContent = 'Add Student';
}

// Add / Update Student
$('save').onclick = () => {

    let name = $('name').value.trim();
    let roll = $('roll').value.trim();

    let marks = [
        +$('m1').value,
        +$('m2').value,
        +$('m3').value
    ];

    // Validation
    if (
        !name ||
        !roll ||
        marks.some(mark => isNaN(mark) || mark < 0 || mark > 100)
    ) {
        alert('Invalid input');
        return;
    }

    // Duplicate Roll Number Check
    if (
        edit === -1 &&
        students.some(student => student.roll === roll)
    ) {
        alert('Duplicate roll');
        return;
    }

    let total = marks.reduce((a, b) => a + b, 0);

    let avg = +(total / 3).toFixed(2);

    let g = grade(avg);

    let obj = {
        name,
        roll,
        total,
        avg,
        grade: g
    };

    if (edit === -1) {
        students.push(obj);
    } else {
        students[edit] = obj;
    }

    saveLS();
    render();
    clearF();
};

// Edit Student
window.editStu = (index) => {

    let student = students[index];

    edit = index;

    name.value = student.name;
    roll.value = student.roll;

    roll.disabled = true;

    m1.value = student.total / 3;
    m2.value = student.total / 3;
    m3.value = student.total / 3;

    save.textContent = 'Update';
};

// Delete Student
window.delStu = (index) => {

    if (confirm('Delete?')) {

        students.splice(index, 1);

        saveLS();

        render();
    }
};

// Search Event
search.oninput = render;

// Initial Load
render();