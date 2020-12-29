let fitnessObj = {
    date: new Date(),
    exercises: [
        // {
        //     exerciseName: "Bicep Curl",
        //     notes: false,
        //     sets: [{
        //             weight: 15,
        //             reps: 10
        //         },
        //         {
        //             weight: 15,
        //             reps: 8
        //         },
        //         {
        //             weight: 15,
        //             reps: 5
        //         }
        //     ]
        // },
        // {
        //     exerciseName: "Tricep Extension",
        //     notes: "Elbows sore",
        //     sets: [{
        //             weight: 15,
        //             reps: 9
        //         },
        //         {
        //             weight: 15,
        //             reps: 10
        //         },
        //         {
        //             weight: 15,
        //             reps: 7
        //         }
        //     ]
        // }
    ]
};
let savedWorkouts;

if (localStorage.getItem("savedWorkouts") != undefined) {
    savedWorkouts = JSON.parse(localStorage.getItem("savedWorkouts"));
} else {
    savedWorkouts = [];
}


const originalObj = JSON.parse(JSON.stringify(fitnessObj));
let copy;
let currentWorkout;
let editMode = false;

function generateWorkout() {

    document.getElementById("content").innerHTML = "";

    if (editMode === false) {
        document.getElementById("commands").innerHTML = "";
        document.getElementById("commands").insertAdjacentHTML("beforeend", `
        <button id="saveWorkoutBtn" onclick="saveWorkout()" style="padding:10px;width:100px;">Save Workout</button>
        <button id="viewSavedBtn" onclick="viewSaved()" style="padding:10px;width:100px;">View<br />Saved</button>
      `)
    }

    document.getElementById("content").insertAdjacentHTML("beforeend", `
      <div id="workoutDiv"></div>
    `)

    let thisDateObj = new Date(fitnessObj.date);
    document.getElementById("workoutDiv").insertAdjacentHTML("beforeend", `
      <h3>Date</h3>
      <p>${thisDateObj.toDateString()}</p>
      <br />
      <p><i class="ri-add-circle-line" onclick="addExercise()"></i> Add Exercise</p>
    `)

    let numOfExercises = fitnessObj.exercises.length;
    for (let n = 0; n < numOfExercises; n++) {

        document.getElementById("content").insertAdjacentHTML("beforeend", `
        <div id="exerciseDiv${n}" class="exerciseDiv"></div>
      `)

        let exerciseDiv = document.getElementById(`exerciseDiv${n}`);

        exerciseDiv.insertAdjacentHTML("beforeend", `
        <p style="text-align: center;">&nbsp<i class="ri-close-circle-line" onclick="deleteExercise(${n})")></i><strong> ${fitnessObj.exercises[n].exerciseName}</strong> <i class="ri-pencil-line" onclick="editExerciseName(${n})"></i></p>
      `)

        let numOfSets = fitnessObj.exercises[n].sets.length;
        for (let i = 0; i < numOfSets; i++) {

            exerciseDiv.insertAdjacentHTML("beforeend", `
          <div>
            <p><span id="delSet${n}${i}"><i class="ri-close-circle-line" onclick="deleteSet(${n},${i})")></i></span> Set: <strong>${i+1}</strong></p>
            <p>
              &nbsp&nbsp Weight: <strong>${fitnessObj.exercises[n].sets[i].weight}</strong> <i class="ri-pencil-line" onclick="editWeight(${n},${i})"></i>
              &nbspReps:<i class="ri-subtract-line add-sub-icon" onclick="reduceReps(${n},${i})"></i><strong>${fitnessObj.exercises[n].sets[i].reps}</strong><i class="ri-add-line add-sub-icon" onclick="increaseReps(${n},${i})"></i>
            </p>
          </div>
        `);

            if (numOfSets === 1) {
                document.getElementById(`delSet${n}${i}`).innerHTML = `
            <i class="ri-close-circle-line" style="color: gray;"></i>
          `;
            }
        }

        exerciseDiv.insertAdjacentHTML("beforeend", `
        &nbsp&nbsp <i class="ri-add-circle-line" onclick="addSet(${n})"></i> Add Set
      `)

        if (Boolean(fitnessObj.exercises[n].notes)) {
            exerciseDiv.insertAdjacentHTML("beforeend", `
          <p>&nbsp Notes: <i class="ri-close-circle-line" onclick="deleteExerciseNotes(${n})"></i> ${fitnessObj.exercises[n].notes} <i class="ri-pencil-line" onclick="editNotes(${n})"></i></p>
        `)
        } else {
            exerciseDiv.insertAdjacentHTML("beforeend", `
          &nbsp <i class="ri-add-circle-line" onclick="addNotes(${n})"></i> Add Notes
        `)
        }
    } // numOfExercises Loop End
};
generateWorkout();

function editWeight(exerciseNum, setNum) {
    let inputValue;
    let currentWeight = fitnessObj.exercises[exerciseNum].sets[setNum].weight;

    iziToast.info({
        backgroundColor: "white",
        timeout: 0,
        overlay: true,
        displayMode: 'once',
        id: 'inputs',
        zindex: 999,
        title: 'Set Weight',
        position: 'center',
        drag: false,
        overlayClose: true,
        closeOnEscape: true,
        onOpening: function () {
            let input = document.getElementById("renameInput");
            input.setSelectionRange(0, 999)
        },
        onClosing: function () {
            if (inputValue != undefined && inputValue != "") {
                fitnessObj.exercises[exerciseNum].sets[setNum].weight = inputValue;
                generateWorkout();
            }
        },
        inputs: [
            [`<input type="text" pattern="[0-9]*" inputmode="numeric" id="renameInput" value="${currentWeight}">`, 'keyup', function (instance, toast, input, e) {
                if (input.value != null && input.value != undefined) {
                    inputValue = input.value;
                } else {
                    input.value = currentWeight
                }
                if (e.keyCode === 13) {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    if (input.value != null && input.value != undefined && input.value != "") {
                        fitnessObj.exercises[exerciseNum].sets[setNum].weight = inputValue;
                    }
                    generateWorkout();
                    iziToast.destroy();
                }
            }, true]
        ]
    }); // iziToast end
}

function reduceReps(exerciseNum, setNum) {
    let reps = fitnessObj.exercises[exerciseNum].sets[setNum].reps;
    if (reps === 0) {
        //console.log("Cant go lower!")
    } else {
        fitnessObj.exercises[exerciseNum].sets[setNum].reps -= 1;
    }
    generateWorkout();
}

function increaseReps(exerciseNum, setNum) {
    fitnessObj.exercises[exerciseNum].sets[setNum].reps += 1;
    generateWorkout();
}

function deleteSet(exerciseNum, setNum) {
    let len = fitnessObj.exercises[exerciseNum].sets.length;
    if (len === 1) {
        "Cant remove last set"
    } else {
        let obj = fitnessObj.exercises[exerciseNum].sets;
        obj.splice(setNum, 1);
        generateWorkout();
    }
}

function addSet(exerciseNum) {
    fitnessObj.exercises[exerciseNum].sets.push({
        weight: 10,
        reps: 10
    })
    generateWorkout();
}

function deleteExercise(exerciseNum) {
    fitnessObj.exercises.splice(exerciseNum, 1)
    generateWorkout();
}

function addExercise() {
    fitnessObj.exercises.push( // pushes template to array
        {
            exerciseName: "Exercise Name",
            notes: false,
            sets: [{
                    weight: 10,
                    reps: 10
                }
            ]
        }
    );
    let index = fitnessObj.exercises.length - 1 // gets last index num
    editExerciseName(index); // triggers rename popup for new item
    generateWorkout(); // re-render view
}

function editExerciseName(exerciseNum) {

    let inputValue;
    let currentName = fitnessObj.exercises[exerciseNum].exerciseName;

    iziToast.info({
        backgroundColor: "white",
        timeout: 0,
        overlay: true,
        displayMode: 'once',
        id: 'inputs',
        zindex: 999,
        title: 'Exercise Name',
        position: 'center',
        drag: false,
        overlayClose: true,
        closeOnEscape: true,
        onOpening: function () {
            let input = document.getElementById("renameInput");
            input.setSelectionRange(0, currentName.length)
        },
        onClosing: function () {
            if (inputValue != undefined && inputValue != "") {
                fitnessObj.exercises[exerciseNum].exerciseName = inputValue;
                generateWorkout();
            }
        },
        inputs: [
            [`<input id="renameInput" type="text" value="${currentName}">`, 'keyup', function (instance, toast, input, e) {
                if (input.value != null && input.value != undefined) {
                    inputValue = input.value;
                } else {
                    input.value = currentName
                }
                if (e.keyCode === 13) {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    if (input.value != null && input.value != undefined && input.value != "") {
                        fitnessObj.exercises[exerciseNum].exerciseName = inputValue;
                    }
                    generateWorkout();
                    iziToast.destroy();
                }
            }, true]
        ]
    }); // iziToast end
}

function editNotes(exerciseNum) {
    let inputValue;
    let currentNotes = fitnessObj.exercises[exerciseNum].notes;

    iziToast.info({
        backgroundColor: "white",
        timeout: 0,
        overlay: true,
        displayMode: 'once',
        id: 'inputs',
        zindex: 999,
        title: `${fitnessObj.exercises[exerciseNum].exerciseName} Notes`,
        position: 'center',
        drag: false,
        overlayClose: true,
        closeOnEscape: true,
        onOpening: function () {
            let input = document.getElementById("renameInput");
            input.setSelectionRange(0, 999)
        },
        onClosing: function () {
            if (inputValue != undefined && inputValue != "") {
                fitnessObj.exercises[exerciseNum].notes = inputValue;
                generateWorkout();
            }
        },
        inputs: [
            [`<input type="text" id="renameInput" value="${currentNotes}">`, 'keyup', function (instance, toast, input, e) {
                if (input.value != null && input.value != undefined) {
                    inputValue = input.value;
                } else {
                    input.value = currentNotes
                }
                if (e.keyCode === 13) {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    if (input.value != null && input.value != undefined && input.value != "") {
                        fitnessObj.exercises[exerciseNum].notes = inputValue;
                    }
                    generateWorkout();
                    iziToast.destroy();
                }
            }, true]
        ]
    }); // iziToast end
}

function addNotes(exerciseNum) {
    fitnessObj.exercises[exerciseNum].notes = "";
    generateWorkout();
    editNotes(exerciseNum);
}

function deleteExerciseNotes(exerciseNum) {
    fitnessObj.exercises[exerciseNum].notes = false;
    generateWorkout();
}

function resetExample() {
    fitnessObj = JSON.parse(JSON.stringify(originalObj));
    generateWorkout();
}

function clearExample() {
    fitnessObj = {
        date: new Date(),
        exercises: []
    }
    generateWorkout();
}

function saveWorkout() {
    if (fitnessObj.exercises.length === 0) {
        iziToast.error({
            position: 'center',
            overlay: 'true',
            overlayClose: 'true',
            pauseOnHover: 'false',
            timeout: 3000,
            messageColor: 'black',
            title: 'Error',
            message: 'Nothing to save!',
        });
    } else {
        let objToSave = JSON.parse(JSON.stringify(fitnessObj));
        savedWorkouts.push(objToSave)
        let string = JSON.stringify(savedWorkouts)
        localStorage.setItem("savedWorkouts", string)
        clearExample();
        iziToast.success({
            position: 'center',
            overlay: 'true',
            overlayClose: 'true',
            pauseOnHover: 'false',
            timeout: 3000,
            messageColor: 'black',
            title: 'Great Job.',
            message: 'Workout Saved!',
        });
    }

}
/*NOTE:
  The below function can be called with false
  in order to not copy over the in-progress
  object from editor mode*/
function viewSaved(truthy) {

    if (truthy === false) {
        //Need to make this cleaner
    } else {
        currentWorkout = JSON.parse(JSON.stringify(fitnessObj))
    }

    editMode = false;

    document.getElementById("commands").innerHTML = "";
    document.getElementById("commands").insertAdjacentHTML("afterbegin", `
      <button id="viewEditorBtn" onclick="viewEditor()" style="padding:10px;width:200px;">Back to Editor</button>
    `)

    let contentDiv = document.getElementById("content")
    contentDiv.innerHTML = "";

    contentDiv.insertAdjacentHTML("afterbegin", `
      <h3>Saved Workouts</h3>
    `)

    if (savedWorkouts.length === 0) {
        contentDiv.insertAdjacentHTML("beforeend", `
        <p>
          No saved workouts!
        </p>
      `)
    } else {
        savedWorkouts.forEach(function (element, index) {
            contentDiv.insertAdjacentHTML("beforeend", `
          <p>
            <i class="ri-close-circle-line" onclick="deleteSavedWorkout(${index})"></i>
              ${new Date(element.date).toDateString()}
            <i class="ri-pencil-line" onclick="editSaved(${index})"></i>
          </p>
        `)
        });
    }



}

function deleteSavedWorkout(index) {
    savedWorkouts.splice(index, 1)
    localStorage.setItem("savedWorkouts", JSON.stringify(savedWorkouts))
    viewSaved(false);
}

function viewEditor() {
    fitnessObj = JSON.parse(JSON.stringify(currentWorkout));
    generateWorkout();
}

function editSaved(index) {

    currentWorkout = JSON.parse(JSON.stringify(currentWorkout));

    editMode = true;
    copy = JSON.parse(JSON.stringify(savedWorkouts[index]));
    fitnessObj = copy;

    generateWorkout();

    document.getElementById("commands").innerHTML = "";
    document.getElementById("commands").insertAdjacentHTML("afterbegin", `
      <button id="updateSavedBtn" onclick="updateSaved(${index})" style="padding:10px;width:100px;">Update Workout</button>
      <button id="viewSavedBtn" onclick="viewSaved(false)" style="padding:10px;width:100px;">Discard<br />Changes</button>
      <br />
      <h3 style="background: yellow;">Editing Saved Workout</h3>
    `)
}

function updateSaved(index) {
    editMode = false;
    savedWorkouts.splice(index, 1, copy)
    localStorage.setItem("savedWorkouts", JSON.stringify(savedWorkouts))
    viewSaved(false);
}