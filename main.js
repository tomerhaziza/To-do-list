const noteContent = document.getElementById("noteContent");
const noteDate = document.getElementById("noteDate");
const noteTime = document.getElementById("noteTime");
const allNotesSection = document.getElementById("allNotes");
const errorMessageDiv = document.getElementById("errorMessage");
const months = ["Jan.", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
let notesArray = JSON.parse(localStorage.getItem("notesList"));
let newestNote;

let today = new Date().toISOString().split('T')[0];
noteDate.setAttribute("min", today);

window.onload = showNotes();

function extractNoteFromUi() { // Create note object from inputs
    return {
        content: noteContent.value.trim(),
        date: noteDate.value,
        time: noteTime.value,
        id: Date.now() // Creating a unique ID
    }
}

function saveNote() {
    let note = extractNoteFromUi();

    try{
        validate(note);
    }

    catch(e){
        console.error(e.message);
        return;
    }

    if (notesArray === null) { // if this is the first note, create array
        notesArray = [];
    }

    notesArray.push(note); // pushing the new note to array
    localStorage.setItem("notesList", JSON.stringify(notesArray)); // updating notes in local storage

    clearInputs();
    
    createNewNote(notesArray.length-1);   // adding newest note to UI
    newestNote.classList.add("fade-in"); // with fade in
}

function clearInputs(){
    noteContent.value = "";
    noteContent.placeholder = "Enter your note";

    noteDate.value = "";
    noteDate.classList = "deadlineInputs";

    noteTime.value = "";
    noteTime.classList = "deadlineInputs";

    errorMessageDiv.style.display = "none";
}

function createNewNote(i) {
    // creating div for new note
    let newNoteDiv = document.createElement("div");
    newestNote = newNoteDiv;
    newNoteDiv.id = notesArray[i].id; // setting div ID as the note UID for remove option
    newNoteDiv.classList = "noteDiv";
    allNotesSection.appendChild(newNoteDiv);

    // creating remove element icon
    let createRemoveBtn = document.createElement('i');
    createRemoveBtn.classList = "fas fa-times";
    createRemoveBtn.setAttribute("onclick", "removeNote(this)");
    newNoteDiv.appendChild(createRemoveBtn);

    // creating note content div
    let noteContentDiv = document.createElement("div");
    noteContentDiv.classList = "noteTextArea";
    noteContentDiv.innerHTML = notesArray[i].content;
    newNoteDiv.appendChild(noteContentDiv);

    // Getting deadline date in string
    deadlineDate = new Date(notesArray[i].date);
    dateStr = months[deadlineDate.getMonth()] + " " + deadlineDate.getDate() +
    ", " + deadlineDate.getFullYear();

    // creating deadline date div
    let addNewDate = document.createElement("div");
    addNewDate.classList = "deadlineDate";
    addNewDate.innerHTML =
    "<label>Deadline:</label><br>" + dateStr + "<br>" + notesArray[i].time;
    newNoteDiv.appendChild(addNewDate);
}

function showNotes() {
    if (notesArray != null) {
        for (i = 0; i < notesArray.length; i++) {
            createNewNote(i);
        }
    }
}

function removeNote(noteToDelete) {
    let noteId = noteToDelete.parentNode.id;
    let noteIndex = notesArray.findIndex(x => x.id == noteId);

    notesArray.splice(noteIndex, 1); // remove note from array
    localStorage.setItem("notesList", JSON.stringify(notesArray)); // updating array in localstorage
    noteToDelete.parentNode.style.opacity = '0'; // fadeout
    setTimeout(function () {
        noteToDelete.parentNode.parentNode.removeChild(noteToDelete.parentNode); //removing note div from html
    }, 500);
}

function validate(note) {
    let errorMessage;

    if (note.content.trim() == "") {
        errorMessage = "You must enter a note!";
        noteInputErrorAlert(errorMessage);
        throw new Error("Note input empty.");
    }

    if (note.date == "") {
        errorMessage = "Enter deadline!";
        deadlineErrorAlert(noteDate, "21.5%",errorMessage);
        throw new Error("Deadline date input empty.");
    }

    if (note.date < today) {
        errorMessage = "Deadline date passed!";
        deadlineErrorAlert(noteDate, "21.5%", errorMessage);
        throw new Error("Task deadline date already passed.");
    }

    if (note.time != "" && note.date <= today) {
        if (note.time < currentTimeStr()) {
            errorMessage = "Deadline time passed!";
            deadlineErrorAlert(noteTime, "49.5%", errorMessage);
            throw new Error("Task deadline time already passed.");
        }
    }
}

function currentTimeStr() {
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    h = checkTime(h);
    m = checkTime(m);
    let currentTime = h + ":" + m;

    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    return currentTime;
}

function noteInputErrorAlert(errorMessage) {
    noteContent.classList.add("errorAlert");
    noteContent.value = "";
    noteContent.placeholder = errorMessage;

    setTimeout(function () {noteContent.style.opacity = 0;}, 250);
    setTimeout(function () {noteContent.style.opacity = 1;}, 550);
    setTimeout(function () {noteContent.style.opacity = 0;}, 850);
    setTimeout(function () {noteContent.style.opacity = 1;}, 1150);
    setTimeout(function () {
        noteContent.classList = "noteInput";
        noteContent.focus();
    }, 1450);
}

function deadlineErrorAlert(div,divPlacement,errorMessage){
    div.classList.add("deadlineErrorAlert");
    errorMessageDiv.style.display = "block";
    errorMessageDiv.style.marginLeft = divPlacement;
    errorMessageDiv.innerHTML = errorMessage;
    
    setTimeout(function () {div.style.opacity = 0;}, 250);
    setTimeout(function () {div.style.opacity = 1;}, 550);
    setTimeout(function () {div.style.opacity = 0;}, 850);
    setTimeout(function () {
        div.style.opacity = 1;
        div.focus();
    }, 1150);
}