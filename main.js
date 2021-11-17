//Function to retrieve unique title names to populate title optgroup
async function fetchUniqueTitles(campus, unit) {

    const resp = await fetch('./data.json')
    const json = await resp.json()

    let titles = []
    json.forEach(val => {
        if (val['Campus'] === campus && val['TUC'] == unit) {
            if (!titles.includes(val['Title Base Name'])) {
                titles.push(val['Title Base Name'])
            }
        } 
    })

    return titles.sort()

}


document.querySelector('.selection').addEventListener('change', function () {
    const campus = this.children[0].value
    const unit = this.children[1].value


    async function fetchTitles() {
        const titles = await fetchUniqueTitles(campus, unit)
        const occupation_section = document.querySelector('#Occupations')
        let opts = []
    
        titles.forEach(val => {
            const opt = document.createElement('option')
            opt.setAttribute('value', val)
            opt.setAttribute('label', val)
            opts.push(opt)
        })

        if (occupation_section.children.length >= 1) {
            occupation_section.innerHTML = ''
            occupation_section.innerHTML = `<option label="Choose a title" value="Choose"></option>`
            occupation_section.append(...opts)
        } else {
            occupation_section.innerHTML = `<option label="Choose a title" value="Choose"></option>`
            occupation_section.append(...opts)
        }
        
    }

   fetchTitles()
    
})

//Retrieve titles when passed a campus, unit and title.
document.querySelector('.selection').addEventListener('change', function () {
    
    selections = []
    if (this.children[0].value != '') {
        selections.push(this.children[0].value)
    }

    if (this.children[1].value != 'Choose') {
        selections.push(this.children[1].value)
    }

    if (this.children[2].value != 'Choose') {
        selections.push(this.children[2].value)
    }

    if (selections.length === 3) {
        const results = document.getElementById('results')
        async function fetchData() {
            const resp = await fetch('./data.json')
            const json = await resp.json()

            json.forEach(val => {
                if (val['Campus'] === selections[0] && val['TUC'] === selections[1] && val['Title Base Name'] === selections[2]) {
                    
                    const steps = {} 
                    const shift_rates = {}
                    const on_call = {}

                    function retrieveColumnsAndStoreInObject(colName, objName) {
                        for (const prop in val) {
                            if (prop.includes(colName)) {
                                objName[prop] = val[prop]
                            }
                        }
                    }

                    retrieveColumnsAndStoreInObject('Step', steps)
                    retrieveColumnsAndStoreInObject('Shift', shift_rates)
                    retrieveColumnsAndStoreInObject('On Call', on_call)


                    
                    results.innerHTML += `

                            <div class='container'>
                                <div class="title-meta">
                                    <h2>${val['Title Base Name']} ${val['Title Grade'] != 'NaN' ? val['Title Grade'] : ''} ${val['Per Diem'] === 'Y' ? 'PER DIEM' : ''}</h2>
                                    <p>Title Code: ${val['Title Code']}</p>
                                    <p>Campus: ${val['Campus']}</p>
                                    <p>Exempt Status: ${val['Overtime Status']}</p>
                                    <p>Pay Period: ${val['Monthly Pay Period'] === 'NaN' ? 'Bi-weekly' : 'Monthly'}</p>
                                </div>
                                <div class="steps">${Object.entries(steps).map(([key, val]) => `<p><strong>${key.replace(":", "")}</strong>: $${val}</p>`).join(' ')}</div>
                                <div class="rates shift">${Object.entries(shift_rates).map(([key, val]) => `<p><strong>${key.replace(":", "")}</strong>: $${val}</p>`).join(' ')}</div>
                                <div class="rates">${Object.entries(on_call).map(([key, val]) => `<p><strong>${key.replace(":", "")}</strong>: $${val}</p>`).join(' ')}</div>
                            </div>
                    
                    
                    
                    
                    
                    `
                }
            })
        }


        
        fetchData()
    }

    
    
})


