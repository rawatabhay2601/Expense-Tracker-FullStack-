// event listener to display fileUrl
window.addEventListener('DOMContentLoaded',showFilesDownloaded);

// showing fileURL data tp UI
async function showFilesDownloaded(){

    const parentTagBody = document.getElementById('table-body-files');
    const token = localStorage.getItem('id');
    try{
        const response = await axios.get('http://34.230.81.176:3000/download/ListOfFiles', {headers : {'Authorization': token}});
        creatingRowsForTable(response.data.success, parentTagBody);
    }
    catch(err){
        alert('Something went wrong !!');
    }
};

function creatingRowsForTable(expense,parentTag){
    // clearing the old data
    parentTag.innerHTML = "";

    for(let i of expense){

        // creating tags
        const tdUrl = document.createElement('td');
        const tdDate = document.createElement('td');

        // adding data to the rows
        tdUrl.textContent = i.url;
        tdDate.textContent = i.createdAt;

        // creating parent tag
        const tr = document.createElement('tr');
        tr.appendChild(tdUrl);
        tr.appendChild(tdDate);

        // adding to the whole row to the table
        parentTag.appendChild(tr);
    }
};