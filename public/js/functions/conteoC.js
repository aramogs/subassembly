let value = false
let storage_bin = document.getElementById("storage_bin")
let sbin = document.getElementById("sbin")
let alerta_prefijo = document.getElementById("alerta_prefijo")
let alerta_prefijo2 = document.getElementById("alerta_prefijo2")
let submitBin = document.getElementById("submitBin")

let submitCantidad = document.getElementById("submitCantidad")
let cantidadSubmit = document.getElementById("cantidadSubmit")
let alerta_cantidad = document.getElementById("alerta_cantidad")
let Bserial = document.getElementById("Bserial")
let Bmaterial = document.getElementById("Bmaterial")
let Bstock = document.getElementById("Bstock")
let Bdescription = document.getElementById("Bdescription")
let Bweigth = document.getElementById("Bweigth")
let tabla_consulta = document.getElementById("tabla_consulta").tBodies[0]

let errorText = document.getElementById("errorText")
let errorText2 = document.getElementById("errorText2")
let btnCerrar = document.querySelectorAll(".btnCerrar")

let successText = document.getElementById("successText")
let btnTransferir = document.getElementById("btnTransferir")
let user_id = document.getElementById("user_id")
let storage_type = document.getElementById("storage_type")
let storage_units_count = document.getElementById("storage_units_count")
let current_storage_units = document.getElementById("current_storage_units")
let btn_verifyCount = document.getElementById("btn_verifyCount")
let inp_verifyCount = document.getElementById("inp_verifyCount")
let submitSU = document.getElementById("submitSU")
let storage_units = []
let listed_storage_units = []
let unlisted_storage_units = []
let not_found_storage_units = []
let nav3014 = document.getElementById("nav3014")
let nav3015 = document.getElementById("nav3015")
let nav3017 = document.getElementById("nav3017")
let estacion = document.getElementById("estacion").innerHTML

storage_bin.focus()

if (storage_type.innerHTML === "EXT") {
    nav3014.style.display = "none"
    nav3015.style.display = "block"
    nav3017.style.display = "none"
} else if (storage_type.innerHTML === "SEM") {
    nav3014.style.display = "none"
    nav3015.style.display = "none"
    nav3017.style.display = "block"
} else {
    nav3014.style.display = "block"
    nav3015.style.display = "none"
    nav3017.style.display = "none"
}


btnCerrar.forEach(element => {
    element.addEventListener("click", cleanInput)
});



function cleanInput() {
    storage_bin.disabled = false
    storage_bin.value = ""
    current_storage_units.innerHTML = ""
    storage_units = []
    listed_storage_units = []
    unlisted_storage_units = []
    not_found_storage_units = []
    btn_verifyCount.classList.remove("bg-success")
    btn_verifyCount.classList.add("bg-secondary")
    btn_verifyCount.classList.remove("animate__animated", "animate__tada")
    // btn_verifyCount.disabled = true
    storage_bin.focus()
}


submitBin.addEventListener("submit", function (e) {
    e.preventDefault()

    if (storage_bin.value.trim() == "") {
        cleanInput()
        soundWrong()
    } else {



        $('#modalSpinner').modal({ backdrop: 'static', keyboard: false })
        storage_bin.disabled = true


        let data = { "proceso": "cycle_count_status", "storage_type": `${storage_type.innerHTML}`, "storage_bin": `${storage_bin.value.toUpperCase()}`, "user_id": user_id.innerHTML };
        axios({
            method: 'post',
            url: "/getBinStatusReport",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        })
            .then((result) => {
                console.log(result);
                if ((JSON.stringify(result.data)).includes("<!DOCTYPE html>")) {

                    setTimeout(() => {
                        location.href = "/login/Acreditacion"
                    }, 1000);
                    soundWrong()
                }
                let response = result.data

                if (response.key) {
                    soundWrong()
                    errorText2.innerHTML = response.key
                    setTimeout(() => { $('#modalSpinner').modal('hide') }, 500);
                    $('#modalError2').modal({ backdrop: 'static', keyboard: false })
                } else {

                    soundOk()
                    let result = response.info_list

                    for (let i = 0; i < result.length; i++) {
                        if (storage_units.indexOf(result[i].storage_unit) === -1) {
                            storage_units.push(parseInt(result[i].storage_unit))
                        }
                    }
                    storage_units_count.innerHTML = result.length
                    sbin.innerHTML = storage_bin.value.toUpperCase()
                    storage_units.forEach(element => {

                        if (isNaN(element)) {
                            badge = `<span class="badge badge-warning  m-1 serialBadge">EMPTY</span>`
                            current_storage_units.innerHTML = current_storage_units.innerHTML + badge
                            btn_verifyCount.disabled = false
                        } else {
                            badge = `<span class="badge badge-secondary  m-1 serialBadge">${parseInt(element)}</span>`
                            current_storage_units.innerHTML = current_storage_units.innerHTML + badge
                        }
                    });

                    $('#modalSpinner').modal('hide')
                    $('#myModal').modal({ backdrop: 'static', keyboard: false })
                    setTimeout(() => { inp_verifyCount.focus() }, 500);

                }

            })
            .catch((err) => { console.error(err) })
    }
})




submitSU.addEventListener("submit", function (e) {
    e.preventDefault()
    let serialBadge = document.querySelectorAll(".serialBadge")
    let currentSerial = parseInt(inp_verifyCount.value.substring(1))
    let serial = inp_verifyCount.value;

    if (serial.charAt(0) !== "S" && serial.charAt(0) !== "s") {
        soundWrong()
        alerta_prefijo2.classList.remove("animate__flipOutX", "animate__animated")
        alerta_prefijo2.classList.add("animate__flipInX", "animate__animated")
        inp_verifyCount.value = ""

    } else {

        if (storage_units.includes(currentSerial) && !listed_storage_units.includes(currentSerial) && !unlisted_storage_units.includes(currentSerial)) {
            listed_storage_units.push(currentSerial)
            soundOk()
            alerta_prefijo2.classList.remove("animate__flipInX", "animate__animated")
            alerta_prefijo2.classList.add("animate__flipOutX", "animate__animated")

            serialBadge.forEach(sbadge => {
                if (parseInt(sbadge.innerHTML) === currentSerial) {
                    sbadge.classList.remove("badge-secodnary")
                    sbadge.classList.add("badge-success")
                }
            })
            btn_verifyCount.disabled = false
            btn_verifyCount.classList.remove("bg-secondary")
            btn_verifyCount.classList.add("bg-success")
            btn_verifyCount.classList.add("animate__animated", "animate__tada")
            inp_verifyCount.value = ""
        } else {
            if (!listed_storage_units.includes(currentSerial) && !unlisted_storage_units.includes(currentSerial)) {
                soundOk()
                setTimeout(() => { soundOk() }, 200)
                setTimeout(() => { soundOk() }, 400)
                badge = `<span class="badge badge-warning m-1">${currentSerial}</span>`
                current_storage_units.innerHTML = current_storage_units.innerHTML + badge
                unlisted_storage_units.push(currentSerial)
                btn_verifyCount.disabled = false
                btn_verifyCount.classList.remove("bg-secondary")
                btn_verifyCount.classList.add("bg-success")
                btn_verifyCount.classList.add("animate__animated", "animate__tada")
                inp_verifyCount.value = ""
            } else {
                soundWrong()
                alerta_prefijo2.classList.remove("animate__flipOutX", "animate__animated")
                alerta_prefijo2.classList.add("animate__flipInX", "animate__animated")
                inp_verifyCount.value = ""
            }

        }
    }

})

function verify_hashRedis(serialsArray_) {
    let data = { "estacion": `ciclicoSEM-${estacion}` };
    axios({
        method: 'post',
        url: "/verify_hashRedis",
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }

    })
        .then(result => {
            if (result.data !== null) {
                let temp_array = []
                result_array = (result.data).split("\n")
                result_array.forEach(element => {
                    if (serialsArray_.includes(parseInt(element))) { temp_array.push(element); }
                });
                beginOF.innerHTML = temp_array.length
                endOF.innerHTML = storage_units.length
            }
        })
        .catch(err => {
            console.error(err);
        })
}

btn_verifyCount.addEventListener("click", () => {
    $('#myModal').modal('hide')
    setTimeout(() => {
        soundOk()
    }, 150);
    soundOk()
    // $('#modalSpinner').modal({ backdrop: 'static', keyboard: false })
    $('#modalCountDown').modal({ backdrop: 'static', keyboard: false })
    storage_units.forEach(storageU => {
        if (!listed_storage_units.includes(parseInt(storageU)) && !unlisted_storage_units.includes(parseInt(storageU))) {
            not_found_storage_units.push(parseInt(storageU))
        }
    })

    let data = { "proceso": "cycle_count_transfer", "storage_type": `${storage_type.innerHTML}`, "storage_bin": `${storage_bin.value.toUpperCase()}`, "user_id": user_id.innerHTML, "listed_storage_units": listed_storage_units, "unlisted_storage_units": unlisted_storage_units, "not_found_storage_units": not_found_storage_units }
    // let interval = setInterval(() => verify_hashRedis(storage_units), 800);
    axios({
        method: 'post',
        url: "/postCycleSU",
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    })
        .then((result) => {
            response = result.data
            console.log(response);

            if (response.key) {
                errorTextField.innerHTML = response.key
                errorText.hidden = false
                tabla_consulta_container.hidden = true
                storage_units = []
                // currentST.innerHTML = ""
                // btn_transferFG.disabled = true

                setTimeout(() => { soundWrong(), $('#modalCountDown').modal('hide') }, 500);
                $('#modalError').modal({ backdrop: 'static', keyboard: false })

            } else {
                soundOk()
                errorText.hidden = true
                tabla_consulta_container.hidden = false
                let errors = 0
                response.forEach(element => { if (element.error != "N/A") { errors++ } })


                tabla_consulta.innerHTML = ""
                cantidadErrores.innerHTML = errors
                if (response.length != 0) {



                    response.forEach(element => {
                        newRow = tabla_consulta.insertRow(tabla_consulta.rows.length);
                        if (element.error !== "N/A") {
                            let row = `
                                <tr class="bg-danger">
                                    <td>${element.serial_num}</td>
                                    <td>${element.error}</td>
                                </tr>
                                `
                            newRow.classList.add("bg-danger", "text-white")
                            return newRow.innerHTML = row;
                        } else {
                            let row = `
                        <tr>
                            <td>${element.serial_num}</td>
                            <td>${element.result}</td>
                        </tr>
                        `
                            return newRow.innerHTML = row;
                        }
                    })
                    
                        
                        setTimeout(() => {  $('#modalCountDown').modal('hide') }, 500);
                        $('#modalError').modal({ backdrop: 'static', keyboard: false })
                   
                } else {
                    // $('#modalSpinner').modal('hide')
                    // $('#modalSuccess').modal({ backdrop: 'static', keyboard: false })
                    
                    setTimeout(() => { soundOk(), $('#modalCountDown').modal('hide') }, 500);
                    $('#modalSuccess').modal({ backdrop: 'static', keyboard: false })
                }
            }

        })
        .catch((err) => {
            console.error(err);
        })
})

//     axios({
//         method: 'post',
//         url: "/postCycleSU",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         data: JSON.stringify(data)
//     })
//         .then((result) => {

//             if ((result.data).includes("<!DOCTYPE html>")) {

//                 setTimeout(() => {
//                     location.href = "/login"
//                 }, 1000);
//                 soundWrong()
//             }

            
//             setTimeout(() => {
//                 response = JSON.parse(result.data)

            


//             if (response.error !== "N/A") {

//                 errorTextField.innerHTML = response.error
//                 errorText.hidden = false
//                 tabla_consulta_container.hidden = true
//                 storage_units = []
//                 // currentST.innerHTML = ""
//                 btn_transferFG.disabled = true
//                 clearInterval(interval);
//                 setTimeout(() => { soundWrong(), $('#modalSpinner').modal('hide') }, 500);
//                 $('#modalError').modal({ backdrop: 'static', keyboard: false })

//             } else {
//                 soundOk()
//                 errorText.hidden = true
//                 tabla_consulta_container.hidden = false
//                 let result = response.result
//                 let result_mod = ""

//                 result_mod = result.replace("[", "").replace("]", "").replace(/'/g, '"')
//                 let objectStringArray = (new Function("return [" + result_mod + "];")());
//                 let errors = 0

//                 objectStringArray.forEach(element => {
//                     if (typeof (element.result) != "number") {
//                         errors++
//                     }
//                 });

//                 // if (errors != 0) {
//                 //     tabla_consulta.innerHTML = ""
//                 //     objectStringArray.forEach(element => {
//                 //         let newRow = tabla_consulta.insertRow(tabla_consulta.rows.length);
//                 //         if (typeof (element.result) != "number") {
//                 //             let row = `
//                 //                 <tr class="bg-danger">
//                 //                     <td>${element.serial_num}</td>
//                 //                     <td>${element.result}</td>
//                 //                 </tr>
//                 //                 `
//                 //             newRow.classList.add("bg-danger", "text-white")
//                 //             return newRow.innerHTML = row;
//                 //         }

//                 //     })
//                 //     cantidadErrores.innerHTML = errors
//                 //     $('#modalSpinner').modal('hide')
//                 //     $('#modalError').modal({ backdrop: 'static', keyboard: false })
//                 // } else {
//                 //     setTimeout(() => { $('#modalSpinner').modal('hide') }, 500);
//                 //     setTimeout(() => { $('#modalSuccess').modal({ backdrop: 'static', keyboard: false }) }, 800);


//                 // }
//                 if (errors != 0) {
//                     tabla_consulta.innerHTML = ""
//                     objectStringArray.forEach(element => {
//                         let newRow = tabla_consulta.insertRow(tabla_consulta.rows.length);
//                         if (typeof (element.result) != "number") {
//                             let row = `
//                                 <tr class="bg-danger">
//                                     <td>${element.serial_num}</td>
//                                     <td>${element.result}</td>
//                                 </tr>
//                                 `
//                             newRow.classList.add("bg-danger", "text-white")
//                             return newRow.innerHTML = row;
//                         }


//                     })
//                     cantidadErrores.innerHTML = errors
//                     // $('#modalSpinner').modal('hide')
//                     // $('#modalError').modal({ backdrop: 'static', keyboard: false })
//                     setTimeout(function () {
//                         clearInterval(interval);
//                         $('#modalCountDown').modal('hide')
//                         $('#modalError').modal({ backdrop: 'static', keyboard: false })
//                     }, 500);
//                 } else {
//                     // $('#modalSpinner').modal('hide')
//                     // $('#modalSuccess').modal({ backdrop: 'static', keyboard: false })
//                     clearInterval(interval);
//                     $('#modalCountDown').modal('hide')
//                     $('#modalSuccess').modal({ backdrop: 'static', keyboard: false })
//                 }
//             }
//         }, 500);
//         })
//         .catch((err) => {
//             console.error(err);
//         })
// })
