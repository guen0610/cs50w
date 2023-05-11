console.log("This message should appear in the console.");
document.addEventListener('DOMContentLoaded', function() {

  console.log("DOMContentLoadedee");
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = function(event) {
    // do something with the form data here
    event.preventDefault();
    console.log("compose-form onsubmit");
    const recipients = document.querySelector('#compose-recipients').value;
    console.log(`recipients ${recipients}`);
    const subject = document.querySelector('#compose-subject').value;
    console.log(`subject ${subject}`);
    const body = document.querySelector('#compose-body').value;
    console.log(`body ${body}`);

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: `${recipients}`,
          subject: `${subject}`,
          body: `${body}`
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
    
    load_mailbox('sent');
  };

});

function submit_email() {
  console.log("submit_email");
}

function compose_email() {

  console.log('compose_email');
  // Show compose view and hide other views
  document.querySelector('#profile-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = 'sad';
  document.querySelector('#compose-subject').value = 'asdasd';
  document.querySelector('#compose-body').value = '';
  
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#profile-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log('hello');
    console.log(emails);
    
    // create the table element
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headerCell1 = document.createElement('th');
    headerCell1.textContent = 'From';
    headerRow.appendChild(headerCell1);
    const headerCell2 = document.createElement('th');
    headerCell2.textContent = 'To';
    headerRow.appendChild(headerCell2);
    const headerCell3 = document.createElement('th');
    headerCell3.textContent = 'Subject';
    headerRow.appendChild(headerCell3);
    const headerCell4 = document.createElement('th');
    headerCell4.textContent = 'TimeStamp';
    headerRow.appendChild(headerCell4);
    table.append(headerRow);

    emails.forEach(email => {
      console.log(`mail recipinet ${email.recipients}`);
      let row = document.createElement('tr');
      console.log(`${email.read}`);
      if(email.read === false)
      {
        console.log("whiiite");
        row.style.backgroundColor = "white";
      }
      else
      {
        console.log("graay");
        row.style.backgroundColor = "gray";
      }
      const cellSender = document.createElement('td');
      cellSender.textContent = email.sender;
      row.appendChild(cellSender);

      const cellRecipients = document.createElement('td');
      cellRecipients.textContent = email.recipients;
      row.appendChild(cellRecipients);

      const cellSubject = document.createElement('td');
      cellSubject.textContent = email.subject;
      row.appendChild(cellSubject);

      const cellTimeStamp = document.createElement('td');
      cellTimeStamp.textContent = email.timestamp;
      row.appendChild(cellTimeStamp);

      if(mailbox === "inbox")
      {
        const cellArchive = document.createElement('td');
        var btn = document.createElement('input');
        btn.type = "button";
        btn.className = "btn";
        btn.value = "archive";
        btn.addEventListener('click', () => {
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              archived: true
            })
          })
          
        });
        cellArchive.appendChild(btn);
        row.appendChild(cellArchive);
      }
      else if (mailbox === "archive")
      {
        const cellArchive = document.createElement('td');
        var btn = document.createElement('input');
        btn.type = "button";
        btn.className = "btn";
        btn.value = "unarchive";
        btn.addEventListener('click', () => {
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              archived: false
            })
          })
          
        });
        td.appendChild(btn);
        row.appendChild(cellArchive);
      }

      console.log(`mail daid ${email.id}`);
      row.addEventListener("click", function(){
        fetch(`/emails/${email.id}`)
        .then(response => response.json())
        .then(email => {
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'none';
          document.querySelector('#profile-view').style.display = 'block';

          document.querySelector('#sender').innerHTML = email.sender;
          document.querySelector('#recipients').innerHTML = email.recipients;
          document.querySelector('#subject').innerHTML = email.subject;
          document.querySelector('#timestamp').innerHTML = email.timestamp;
          document.querySelector('#body').innerHTML = email.body;
          console.log(email);

          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              read: true
            })
          })
          .then(response => {
            console.log(response);
          });
        })
      });


      table.append(row);
    });

    document.querySelector('#emails-view').append(table);
  })
}