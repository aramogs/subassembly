let value = false
let serial_num = document.getElementById("serial_num")
let alerta_prefijo = document.getElementById("alerta_prefijo")
let submitSerial = document.getElementById("submitSerial")


let submitCantidad = document.getElementById("submitCantidad")
let cantidadSubmit = document.getElementById("cantidadSubmit")
let alerta_cantidad = document.getElementById("alerta_cantidad")
let Bserial = document.getElementById("Bserial")
let Bmaterial = document.getElementById("Bmaterial")
let Bstock = document.getElementById("Bstock")
let Bdescription = document.getElementById("Bdescription")
let Bweigth = document.getElementById("Bweigth")


let errorText = document.getElementById("errorText")
let btnCerrar = document.querySelectorAll(".btnCerrar")

let successText = document.getElementById("successText")
let btnTransferir = document.getElementById("btnTransferir")
let user_id = document.getElementById("user_id")

let tabla_consulta = document.getElementById('tabla_consulta').getElementsByTagName('tbody')[0];



serial_num.focus()

btnCerrar.forEach(element => {
    element.addEventListener("click", cleanInput)
});

serial_num.addEventListener("keyup", check_qualifier)


submitSerial.addEventListener("submit", (e) => { process_input(e) })


function process_input(e) {
    e.preventDefault()
    serial_mandrel_material = serial_num.value

    if (serial_mandrel_material.charAt(0).toUpperCase() === "M") {

        if (serial_mandrel_material.length > 7) {
            $('#modalSpinner').modal({ backdrop: 'static', keyboard: false })
            serial_num.disabled = true
            let data = { "proceso": "transfer_SEM_mandrel", "mandrel": `${serial_mandrel_material.substring(1)}`, "user_id": user_id.innerHTML };
            axios({
                method: 'post',
                url: `/getUbicacionesSEMMandrel`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data)
            })
            .then((result) => {

                let response = result.data
                if (result.data.key ) {
                    soundWrong()
                    errorText.innerHTML = result.data.key ? result.data.key : result.data.message
                    setTimeout(() => { $('#modalSpinner').modal('hide') }, 500);
                    $('#modalError').modal({ backdrop: 'static', keyboard: false })
                } else {
                    soundOk()
    
                    tabla_consulta.innerHTML = ""
                    dates = {}
                    array_fifo = response
                    // cScan.innerHTML = `${currentCount}/${contenedores}`
                    let date_
                    array_fifo.forEach(function (element) {
                        if (!(element.LGPLA).toUpperCase().includes("CICLI")) {
                            let key = JSON.stringify(moment(element.WDATU == "00000000" ? date_ = "20110101" : date_ = element.WDATU, "YYYYMMDD").format("MM/DD/YYYY"))
                            dates[key] = (dates[key] || 0) + 1
                        }
                    })
    
                    const arregloFinalSortDate = array_fifo.sort((d1, d2) => new Date(moment(d1.WDATU == "00000000" ? date_ = "20110101" : date_ = d1.WDATU, "YYYYMMDD").format('MM/DD/YYYY')) - new Date(moment(d2.WDATU == "00000000" ? date_ = "20110101" : date_ = d2.WDATU, "YYYYMMDD").format('MM/DD/YYYY')))
                    arregloFinalSortDate.forEach(element => {
    
                        let newRow = tabla_consulta.insertRow(tabla_consulta.rows.length);
                        newRow.setAttribute("id", `${(element.LENUM).replace(/^0+/gm, "")}`)
    
                        if ((element.LGPLA).toUpperCase().includes("CICLI")) {
                            newRow.setAttribute("class", "bg-secondary text-white")
                            row = `
                        <tr>
                            <td>${element.LGPLA}</td>
                            <td>${(element.LENUM).replace(/^0+/gm, "")}</td>
                            <td>${moment(element.WDATU == "00000000" ? date_ = "20110101" : date_ = element.WDATU, "YYYYMMDD").format("MM/DD/YYYY")}</td>
                        </tr>
                        `
                        } else {
                            row = `
                        <tr>
                            <td>${element.LGPLA}</td>
                            <td>${(element.LENUM).replace(/^0+/gm, "")}</td>
                            <td>${moment(element.WDATU == "00000000" ? date_ = "20110101" : date_ = element.WDATU, "YYYYMMDD").format("MM/DD/YYYY")}</td>
                        </tr>
                        `
                        }
    
    
    
                        return newRow.innerHTML = row;
                    });
       
    
                    setTimeout(function () {
                        $('#modalSpinner').modal('hide')
                        $('#myModal').modal({ backdrop: 'static', keyboard: false })
                    }, 500);
    

    
    
                }
    
            })
            .catch((err) => { console.error(err) })
            .finally(() => {
                setTimeout(() => {
                    cycleButtons = document.getElementsByClassName("cycleButton")
                    for (let i = 0; i < cycleButtons.length; i++) {
                        cycleButtons[i].addEventListener("click", (e) => { cycleAdd(e) })
    
                    }
                }, 500);
    
            })
                // .then((result) => {
                //     console.log(result);


                //     let response = JSON.parse(result.data)
                //     console.log(response);
                //     if (response.error !== "N/A") {
                //         soundWrong()
                //         errorText.innerHTML = response.error ? response.error : response.message
                //         setTimeout(() => { $('#modalSpinner').modal('hide') }, 500);
                //         $('#modalError').modal({ backdrop: 'static', keyboard: false })
                //     } else {

                //         let storage_bins = []
                //         let arregloFinal = []
                //         tabla_consulta.innerHTML = ""
                //         soundOk()
                //         let result = response.result

                //         for (let i = 0; i < result.length; i++) {
                //             if (storage_bins.indexOf(result[i].storage_bin) === -1) {
                //                 storage_bins.push(`${result[i].storage_bin}`)
                //             }
                //         }


                //         for (let i = 0; i < storage_bins.length; i++) {
                //             let count = 0
                //             let recentDate = ""
                //             for (let y = 0; y < result.length; y++) {
                //                 if (storage_bins[i] == result[y].storage_bin) {
                //                     count++
                //                     if (recentDate < result[y].gr_date) {
                //                         recentDate = result[y].gr_date
                //                     }
                //                 }
                //             }
                //             let push = { "storage_bin": `${storage_bins[i]}`, "count": `${count}`, "recentDate": `${recentDate}` }
                //             arregloFinal.push(push)

                //         }

                //         const arregloFinalSortDate = arregloFinal.sort((a, b) => b.recentDate - a.recentDate)
                //         arregloFinalSortDate.forEach(element => {
                //             row = `
                //             <tr>
                //                 <td>${element.storage_bin}</td>
                //                 <td>${element.count}</td>
                //                 <td>${element.recentDate}</td>
                //             </tr>
                //             `

                //             let newRow = tabla_consulta.insertRow(tabla_consulta.rows.length);
                //             return newRow.innerHTML = row;
                //         });

                //         $('#modalSpinner').modal('hide')
                //         $('#myModal').modal({ backdrop: 'static', keyboard: false })

                //     }

                // })
                // .catch((err) => { console.error(err) })
        } else {
            soundWrong()
            alerta_prefijo.classList.remove("animate__flipOutX", "animate__animated")
            alerta_prefijo.classList.add("animate__flipInX", "animate__animated")
            serial_num.value = ""
        }

    } else if (serial_mandrel_material.charAt(0).toUpperCase() === "S") {
        if (serial_mandrel_material.substring(1).length > 8) {
            $('#modalSpinner').modal({ backdrop: 'static', keyboard: false })
            serial_num.disabled = true
            let _serial
            if (serial_mandrel_material.substring(1).length < 10) {
                _serial = `0${serial_mandrel_material.substring(1)}`
            } else{
                _serial = serial_mandrel_material.substring(1)
            }


            let data = { "proceso": "transfer_SEM_serial", "serial": `${_serial}`, "user_id": user_id.innerHTML, "storage_type": `` };
            axios({
                method: 'post',
                url: "/getUbicacionesSEMSerial",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data)
            })
            .then((result) => {

                // if ((result.data).includes("<!DOCTYPE html>")) {
                //     soundWrong()
                //     setTimeout(() => {
                //         location.href = "/login/Acreditacion"
                //     }, 500);
                    
                // }

                let response = result.data
                console.log(response);
                if (result.data.key) {
                    soundWrong()
                    errorText.innerHTML = result.data.key ? result.data.key : result.data.message
                    setTimeout(() => { $('#modalSpinner').modal('hide') }, 500);
                    $('#modalError').modal({ backdrop: 'static', keyboard: false })
                } else {
                    soundOk()
    
                    tabla_consulta.innerHTML = ""
                    dates = {}
                    array_fifo = response
                    // cScan.innerHTML = `${currentCount}/${contenedores}`
                    let date_
                    array_fifo.forEach(function (element) {
                        if (!(element.LGPLA).toUpperCase().includes("CICLI")) {
                            let key = JSON.stringify(moment(element.WDATU == "00000000" ? date_ = "20110101" : date_ = element.WDATU, "YYYYMMDD").format("MM/DD/YYYY"))
                            dates[key] = (dates[key] || 0) + 1
                        }
                    })
    
                    const arregloFinalSortDate = array_fifo.sort((d1, d2) => new Date(moment(d1.WDATU == "00000000" ? date_ = "20110101" : date_ = d1.WDATU, "YYYYMMDD").format('MM/DD/YYYY')) - new Date(moment(d2.WDATU == "00000000" ? date_ = "20110101" : date_ = d2.WDATU, "YYYYMMDD").format('MM/DD/YYYY')))
                    arregloFinalSortDate.forEach(element => {
    
                        let newRow = tabla_consulta.insertRow(tabla_consulta.rows.length);
                        newRow.setAttribute("id", `${(element.LENUM).replace(/^0+/gm, "")}`)
    
                        if ((element.LGPLA).toUpperCase().includes("CICLI")) {
                            newRow.setAttribute("class", "bg-secondary text-white")
                            row = `
                        <tr>
                            <td>${element.LGPLA}</td>
                            <td>${(element.LENUM).replace(/^0+/gm, "")}</td>
                            <td>${moment(element.WDATU == "00000000" ? date_ = "20110101" : date_ = element.WDATU, "YYYYMMDD").format("MM/DD/YYYY")}</td>
                        </tr>
                        `
                        } else {
                            row = `
                        <tr>
                            <td>${element.LGPLA}</td>
                            <td>${(element.LENUM).replace(/^0+/gm, "")}</td>
                            <td>${moment(element.WDATU == "00000000" ? date_ = "20110101" : date_ = element.WDATU, "YYYYMMDD").format("MM/DD/YYYY")}</td>
                        </tr>
                        `
                        }
    
    
    
                        return newRow.innerHTML = row;
                    });
       
    
                    setTimeout(function () {
                        $('#modalSpinner').modal('hide')
                        $('#myModal').modal({ backdrop: 'static', keyboard: false })
                    }, 500);
    

    
    
                }
    
            })
            .catch((err) => { console.error(err) })
            .finally(() => {
                setTimeout(() => {
                    cycleButtons = document.getElementsByClassName("cycleButton")
                    for (let i = 0; i < cycleButtons.length; i++) {
                        cycleButtons[i].addEventListener("click", (e) => { cycleAdd(e) })
    
                    }
                }, 500);
    
            })
                // .then((result) => {
                //     if ((result.data).includes("<!DOCTYPE html>")) {

                //         setTimeout(() => {
                //             location.href = "/login"
                //         }, 1000);
                //         soundWrong()
                //     }

                //     let response = JSON.parse(result.data)

                //     if (response.error !== "N/A") {
                //         soundWrong()
                //         errorText.innerHTML = response.error
                //         setTimeout(() => { $('#modalSpinner').modal('hide') }, 500);
                //         $('#modalError').modal({ backdrop: 'static', keyboard: false })
                //     } else {

                //         let storage_bins = []
                //         let arregloFinal = []
                //         tabla_consulta.innerHTML = ""
                //         soundOk()
                //         let result = response.result

                //         for (let i = 0; i < result.length; i++) {
                //             if (storage_bins.indexOf(result[i].storage_bin) === -1) {
                //                 storage_bins.push(`${result[i].storage_bin}`)
                //             }
                //         }


                //         for (let i = 0; i < storage_bins.length; i++) {
                //             let count = 0
                //             let recentDate = ""
                //             for (let y = 0; y < result.length; y++) {
                //                 if (storage_bins[i] == result[y].storage_bin) {
                //                     count++
                //                     if (recentDate < result[y].gr_date) {
                //                         recentDate = result[y].gr_date
                //                     }
                //                 }
                //             }
                //             let push = { "storage_bin": `${storage_bins[i]}`, "count": `${count}`, "recentDate": `${recentDate}` }
                //             arregloFinal.push(push)

                //         }

                //         const arregloFinalSortDate = arregloFinal.sort((a, b) => b.recentDate - a.recentDate)
                //         arregloFinalSortDate.forEach(element => {
                //             row = `
                //             <tr>
                //                 <td>${element.storage_bin}</td>
                //                 <td>${element.count}</td>
                //                 <td>${element.recentDate}</td>
                //             </tr>
                //             `

                //             let newRow = tabla_consulta.insertRow(tabla_consulta.rows.length);
                //             return newRow.innerHTML = row;
                //         });

                //         $('#modalSpinner').modal('hide')
                //         $('#myModal').modal({ backdrop: 'static', keyboard: false })

                //     }

                // })
                // .catch((err) => { console.error(err) })
        } else {
            soundWrong()
            alerta_prefijo.classList.remove("animate__flipOutX", "animate__animated")
            alerta_prefijo.classList.add("animate__flipInX", "animate__animated")
            serial_num.value = ""
        }
    } else if (serial_mandrel_material.charAt(0).toUpperCase() === "P") {

        if (serial_mandrel_material.length > 8) {
            $('#modalSpinner').modal({ backdrop: 'static', keyboard: false })
            serial_num.disabled = true
            let data = { "proceso": "transfer_SEM_material", "material": `${serial_mandrel_material.substring(1)}`, "user_id": user_id.innerHTML };
            axios({
                method: 'post',
                url: "/getUbicacionesSEMMaterial",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data)
            })
            .then((result) => {

                let response = result.data
                console.log(result);
                if (result.data.key) {
                    soundWrong()
                    errorText.innerHTML = result.data.key ? result.data.key : result.data.message
                    setTimeout(() => { $('#modalSpinner').modal('hide') }, 500);
                    $('#modalError').modal({ backdrop: 'static', keyboard: false })
                } else {
                    soundOk()
    
                    tabla_consulta.innerHTML = ""
                    dates = {}
                    array_fifo = response
                    // cScan.innerHTML = `${currentCount}/${contenedores}`
                    let date_
                    array_fifo.forEach(function (element) {
                        if (!(element.LGPLA).toUpperCase().includes("CICLI")) {
                            let key = JSON.stringify(moment(element.WDATU == "00000000" ? date_ = "20110101" : date_ = element.WDATU, "YYYYMMDD").format("MM/DD/YYYY"))
                            dates[key] = (dates[key] || 0) + 1
                        }
                    })
    
                    const arregloFinalSortDate = array_fifo.sort((d1, d2) => new Date(moment(d1.WDATU == "00000000" ? date_ = "20110101" : date_ = d1.WDATU, "YYYYMMDD").format('MM/DD/YYYY')) - new Date(moment(d2.WDATU == "00000000" ? date_ = "20110101" : date_ = d2.WDATU, "YYYYMMDD").format('MM/DD/YYYY')))
                    arregloFinalSortDate.forEach(element => {
    
                        let newRow = tabla_consulta.insertRow(tabla_consulta.rows.length);
                        newRow.setAttribute("id", `${(element.LENUM).replace(/^0+/gm, "")}`)
    
                        if ((element.LGPLA).toUpperCase().includes("CICLI")) {
                            newRow.setAttribute("class", "bg-secondary text-white")
                            row = `
                        <tr>
                            <td>${element.LGPLA}</td>
                            <td>${(element.LENUM).replace(/^0+/gm, "")}</td>
                            <td>${moment(element.WDATU == "00000000" ? date_ = "20110101" : date_ = element.WDATU, "YYYYMMDD").format("MM/DD/YYYY")}</td>
                        </tr>
                        `
                        } else {
                            row = `
                        <tr>
                            <td>${element.LGPLA}</td>
                            <td>${(element.LENUM).replace(/^0+/gm, "")}</td>
                            <td>${moment(element.WDATU == "00000000" ? date_ = "20110101" : date_ = element.WDATU, "YYYYMMDD").format("MM/DD/YYYY")}</td>
                        </tr>
                        `
                        }
    
    
    
                        return newRow.innerHTML = row;
                    });
       
    
                    setTimeout(function () {
                        $('#modalSpinner').modal('hide')
                        $('#myModal').modal({ backdrop: 'static', keyboard: false })
                    }, 500);
    

    
    
                }
    
            })
            .catch((err) => { console.error(err) })
            .finally(() => {
                setTimeout(() => {
                    cycleButtons = document.getElementsByClassName("cycleButton")
                    for (let i = 0; i < cycleButtons.length; i++) {
                        cycleButtons[i].addEventListener("click", (e) => { cycleAdd(e) })
    
                    }
                }, 500);
    
            })
                // .then((result) => {
                //     if ((result.data).includes("<!DOCTYPE html>")) {

                //         setTimeout(() => {
                //             location.href = "/login"
                //         }, 1000);
                //         soundWrong()
                //     }

                //     let response = JSON.parse(result.data)

                //     if (response.error !== "N/A") {
                //         soundWrong()
                //         errorText.innerHTML = response.error
                //         setTimeout(() => { $('#modalSpinner').modal('hide') }, 500);
                //         $('#modalError').modal({ backdrop: 'static', keyboard: false })
                //     } else {

                //         let storage_bins = []
                //         let arregloFinal = []
                //         tabla_consulta.innerHTML = ""
                //         soundOk()
                //         let result = response.result

                //         for (let i = 0; i < result.length; i++) {
                //             if (storage_bins.indexOf(result[i].storage_bin) === -1) {
                //                 storage_bins.push(`${result[i].storage_bin}`)
                //             }
                //         }


                //         for (let i = 0; i < storage_bins.length; i++) {
                //             let count = 0
                //             let recentDate = ""
                //             for (let y = 0; y < result.length; y++) {
                //                 if (storage_bins[i] == result[y].storage_bin) {
                //                     count++
                //                     if (recentDate < result[y].gr_date) {
                //                         recentDate = result[y].gr_date
                //                     }
                //                 }
                //             }
                //             let push = { "storage_bin": `${storage_bins[i]}`, "count": `${count}`, "recentDate": `${recentDate}` }
                //             arregloFinal.push(push)

                //         }

                //         const arregloFinalSortDate = arregloFinal.sort((a, b) => b.recentDate - a.recentDate)
                //         arregloFinalSortDate.forEach(element => {
                //             row = `
                //             <tr>
                //                 <td>${element.storage_bin}</td>
                //                 <td>${element.count}</td>
                //                 <td>${element.recentDate}</td>
                //             </tr>
                //             `

                //             let newRow = tabla_consulta.insertRow(tabla_consulta.rows.length);
                //             return newRow.innerHTML = row;
                //         });

                //         $('#modalSpinner').modal('hide')
                //         $('#myModal').modal({ backdrop: 'static', keyboard: false })

                //     }

                // })
                // .catch((err) => { console.error(err) })
        } else {
            soundWrong()
            alerta_prefijo.classList.remove("animate__flipOutX", "animate__animated")
            alerta_prefijo.classList.add("animate__flipInX", "animate__animated")
            serial_num.value = ""
        }

    }

}



function check_qualifier() {
    serial_mandrel_material = serial_num.value;
    if (String(serial_mandrel_material.charAt(0)) !== "s" && String(serial_mandrel_material.charAt(0)) !== "S"
        && String(serial_mandrel_material.charAt(0)) !== "p" && String(serial_mandrel_material.charAt(0)) !== "P"
        && String(serial_mandrel_material.charAt(0)) !== "m" && String(serial_mandrel_material.charAt(0)) !== "M") {
        soundWrong()
        alerta_prefijo.classList.remove("animate__flipOutX", "animate__animated")
        alerta_prefijo.classList.add("animate__flipInX", "animate__animated")
        serial_num.value = ""
    } else {
        value = true
        alerta_prefijo.classList.remove("animate__flipInX", "animate__animated")
        alerta_prefijo.classList.add("animate__flipOutX", "animate__animated")
    }
}

function cleanInput() {
    serial_num.disabled = false
    serial_num.value = ""
    value = false
}

